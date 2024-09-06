from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, status,Query, status
import secrets
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.orm import Session
from models import VisitRequestModel, ResearchCenterModel, User as UserModel  # SQLAlchemy model
from schemas import EmailSchema, PasswordResetRequest, FollowUpEmailRequest, ResearchCenterPasswordResetRequest, ResearchCenterResetPassword, ResetPasswordRequest, UpdateRequestStatus,UserCreate,VisitRequestResponse,ResearchCenterSignUp, ResearchCenterLogin, ResearchCenterToken,User as UserSchema, UserUpdatePassword, UserLogin, Token, VisitRequest  # Pydantic schemas
from database import SessionLocal, engine, Base
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from typing import Union,List

from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from fastapi.middleware.cors import CORSMiddleware

from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature


app = FastAPI()



origins=["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

load_dotenv(dotenv_path="gms_configs.env")
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_SERVER = os.getenv("MAIL_SERVER")

URL_FRONT_END_APP = os.getenv("URL_FRONT_END_APP")
PORT_FRONT_END_APP= os.getenv("PORT_FRONT_END_APP")

SECRET_KEY = os.getenv("SECRET_KEY")
serializer = URLSafeTimedSerializer(SECRET_KEY) #for request-password-reset and reset-password
# Email Configuration
conf = ConnectionConfig(
    MAIL_USERNAME = MAIL_USERNAME,
    MAIL_PASSWORD = MAIL_PASSWORD,
    MAIL_FROM = MAIL_FROM,
    MAIL_PORT=587,
    MAIL_SERVER = MAIL_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

# Dependency to get the database session
def get_db():
    print("get_db()")
    db = SessionLocal()
    try:
        print("yield db")
        yield db
    finally:
        print("db.close()")
        db.close()

# CREATE a new user and send an email
@app.post("/users/", response_model=UserSchema)
async def create_user(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    # Hash the password before storing it
    hashed_password = get_password_hash(user.password)
    # db_user = UserModel(**user.dict())  # SQLAlchemy model
    db_user = UserModel(
        institution_name=user.institution_name,
        username=user.username,
        email=user.email,
        password=hashed_password,  # Store the hashed password
        position=user.position  # Include the optional position field
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Prepare the email message
    message = MessageSchema(
        subject="Welcome to Steerhub GMS",
        recipients=[user.email],  # List of recipients
        body=f"Hello {user.username},\n\nThank you for registering at STEERHub Guest Management System!\n\nBest regards,\nSTEERHub GMS Team",
        subtype="plain"
    )

    # Send the email
    fm = FastMail(conf)
    try:
        background_tasks.add_task(fm.send_message, message)
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(status_code=500, detail="User created, but email could not be sent.")
    
    return db_user
    # return {"msg": "user_create success"}


# Initialize the password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Utility function to hash passwords
def get_password_hash(password):
    return pwd_context.hash(password)

# Endpoint to update user password
@app.put("/users/update-password/", response_model=dict)
def update_user_password(user_update: UserUpdatePassword, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == user_update.email).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.password = get_password_hash(user_update.new_password)
    db.commit()
    return {"msg": "Password updated successfully"}

@app.post("/users/reset-password")
async def reset_password(token: str, new_password: str, db: Session = Depends(get_db)):
    try:
        # Verify the token and extract the email
        email = serializer.loads(token, salt="password-reset-salt", max_age=3600)
    except (SignatureExpired, BadSignature):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Find the user by email
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash and update the user's password
    user.password = get_password_hash(new_password)
    db.commit()

    return {"msg": "Password has been reset successfully"}

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize the password context for bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Utility function to verify passwords
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Utility function to authenticate the user
def authenticate_user(db: Session, email: str, password: str):
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user

# Utility function to create a JWT token
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Login endpoint
@app.post("/login/", response_model=Token)
def login_for_access_token(user_login: UserLogin, db: Session = Depends(get_db)):
    user = authenticate_user(db, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create the access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Return the token along with the username
    return {"access_token": access_token, "token_type": "bearer", "username": user.username, "email": user.email}


# Delete a user by email
@app.delete("/users/", response_model=dict)
def delete_user(email: str, db: Session = Depends(get_db)):
    db_user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(db_user)
    db.commit()
    
    return {"msg": f"User with email {email} has been deleted successfully"}

@app.post("/request-visit/")
def request_visit(background_tasks: BackgroundTasks,visit: VisitRequest, db: Session = Depends(get_db), ):
  # Create a new visit request record
    new_request = VisitRequestModel(
        research_center=visit.research_center,
        visit_type=visit.visit_type,
        visit_date=visit.visit_date,
        duration=visit.duration,
        purpose=visit.purpose,
        status="pending",
        requestor=visit.requestor
    )

    # Generate and assign a unique request_id
    new_request.request_id = new_request.generate_request_id()

    # Ensure the generated request_id is unique
    while db.query(VisitRequestModel).filter(VisitRequestModel.request_id == new_request.request_id).first():
        new_request.request_id = new_request.generate_request_id()

    # Save the visit request to the database
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    # Prepare email message to the requestor
    message = MessageSchema(
        subject="Your Visit Request Has Been Submitted",
        recipients=[new_request.requestor],  # Requestor's email
        body=f"Hi! \nYour visit request has been successfully submitted.\n\n"
             f"Your unique request ID is: {new_request.request_id}.\n"
             f"Contact info of center to be visited: {new_request.research_center}\n"
             f"Visit Type: {new_request.visit_type}\n"
             f"Visit Date: {new_request.visit_date}\n"
             f"Duration: {new_request.duration} hrs\n"
             f"Purpose: {new_request.purpose}\n\n"
             f"You can use this ID to follow up on the status of your request at the research center and log-in to your STEERHub GMS account at atlas.batstate-u.edu.ph:8081/pages/user-login to view the latest status.\n\n"
             f"Thank you!"
             f"\n\nBest regards,\nSTEERHub GMS Team",
        subtype="plain"
    )

    # Send email in the background
    background_tasks.add_task(FastMail(conf).send_message, message)

    # Fetch the email of the research center from the database (if stored there)
    research_center_email = db.query(ResearchCenterModel).filter(ResearchCenterModel.email == new_request.research_center).first()
    
    if not research_center_email:
        raise HTTPException(status_code=404, detail="Research center not found")

    # Prepare email notification to the research center
    research_center_message = MessageSchema(
        subject=f"New Visit Request Notification: {new_request.request_id}",
        recipients=[research_center_email.email],  # Research center's email
        body=f"A new visit request has been made.\n\n"
        f"Request ID: {new_request.request_id}\n"
            f"Requestor: {new_request.requestor}\n\n"
             f"Visit Type: {new_request.visit_type}\n"
             f"Visit Date: {new_request.visit_date}\n"
             f"Duration: {new_request.duration} hrs\n"
             f"Purpose: {new_request.purpose}\n\n"
             f"Kindly login to our portal at http://atlas.batstate-u.edu.ph/steerhub_guest_management/pages/research-center-login/ to review the request."
             f"\n\nBest regards,\nSTEERHub GMS Team",
        subtype="plain"
    )

    # Send email to the research center in the background
    background_tasks.add_task(FastMail(conf).send_message, research_center_message)
    
    return {"msg": "Visit request submitted successfully", "visit_id": new_request.id, "request_id": new_request.request_id, "status": new_request.status}


@app.post("/research-center/signup/", status_code=status.HTTP_201_CREATED)
async def research_center_signup(background_tasks: BackgroundTasks, signup_data: ResearchCenterSignUp, db: Session = Depends(get_db)):
    # Check if the email is already registered
    db_center = db.query(ResearchCenterModel).filter(ResearchCenterModel.email == signup_data.email).first()
    if db_center:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Hash the password before storing it
    hashed_password = get_password_hash(signup_data.password)

    # Create a new research center record
    new_center = ResearchCenterModel(
        email=signup_data.email,
        password=hashed_password,  # Store the hashed password
        max_guest_capacity=signup_data.max_guest_capacity
    )

    # Save the research center to the database
    db.add(new_center)
    db.commit()
    db.refresh(new_center)

    # Prepare email notification
    message = MessageSchema(
        subject="Welcome to the STEERHub Guest Management System!",
        recipients=[signup_data.email],  # List of recipients
        body=f"Hi Team!, \n\nYou've successfully signed up with email {signup_data.email} in the STEERHub Guest Management System!\nYou will receive guest/visitor requests via your registered email and will be able to do appropriate action with regards to the requests.\n\nLogin to you're account at http://atlas.batstate-u.edu.ph/steerhub_guest_management/pages/research-center-login/ \n\nBest regards,\nSTEERHub GMS Team.",
        # body=f"Hello {user.username},\n\nThank you for registering at STEERHub Guest Management System!\n\nBest regards,\nSTEERHub GMS Team",
        subtype="plain"
    )

    # Send email in the background
    background_tasks.add_task(FastMail(conf).send_message, message)

    return {"msg": "Research center signed up successfully", "center_id": new_center.id}


@app.post("/research-center/login", response_model=ResearchCenterToken)
async def research_center_login(login_data: ResearchCenterLogin, db: Session = Depends(get_db)):
    # Authenticate the research center
    research_center = db.query(ResearchCenterModel).filter(ResearchCenterModel.email == login_data.email).first()

    if not research_center or not verify_password(login_data.password, research_center.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create the access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": research_center.email, "center_id": research_center.id},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "center_id": research_center.id,
        "email": research_center.email
    }

@app.get("/visit-requests/", response_model=List[VisitRequestResponse])
async def get_visit_requests(email: str, status_type: str, db: Session = Depends(get_db)):
    # Fetch the research center by email
    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Fetch visit requests based on research center and status type
    visit_requests = db.query(VisitRequestModel).filter(
        VisitRequestModel.requestor == user.email,
        VisitRequestModel.status == status_type
    ).all()

    if not visit_requests:
        raise HTTPException(status_code=404, detail="No visit requests found with the given status")

    return visit_requests

@app.put("/update-request-status/", status_code=status.HTTP_200_OK)
def update_request_status(background_tasks: BackgroundTasks,update_data: UpdateRequestStatus, db: Session = Depends(get_db)):
# Fetch the visit request based on the provided request_id
    visit_request = db.query(VisitRequestModel).filter(VisitRequestModel.request_id == update_data.request_id).first()

    if not visit_request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visit request not found")

    # Update the status and center_remarks if provided
    if update_data.status is not None:
        visit_request.status = update_data.status

    if update_data.center_remarks is not None:
        visit_request.center_remarks = update_data.center_remarks

    # Commit the changes to the database
    db.commit()

    # Prepare the email to notify the requestor about the status update
    requestor_message = MessageSchema(
        subject="Your Visit Request Status Has Been Updated",
        recipients=[visit_request.requestor],  # Send the email to the requestor
        body=f"Hi!\n\nThe status of your visit request (ID: {visit_request.request_id}) has been updated to '{visit_request.status}'.\n\n"
             f"Research Center Remarks: {visit_request.center_remarks}\n\n"
             f"Please follow up if you have any further questions.\n\n"
             f"Thank you!"
             f"\n\nBest regards,\nSTEERHub GMS Team",
        subtype="plain"
    )

    # Send the email in the background
    background_tasks.add_task(FastMail(conf).send_message, requestor_message)

    return {"msg": f"Request {update_data.request_id} status updated to {update_data.status}"}



@app.post("/send-follow-up-email/")
async def send_follow_up_email(request_data: FollowUpEmailRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Look up the visit request by request_id
    visit_request = db.query(VisitRequestModel).filter(VisitRequestModel.request_id == request_data.request_id).first()
    
    if not visit_request:
        raise HTTPException(status_code=404, detail="Visit request not found")
    
    # Find the research center email
    research_center_email = db.query(ResearchCenterModel).filter(ResearchCenterModel.email == visit_request.research_center).first()
    
    if not research_center_email:
        raise HTTPException(status_code=404, detail="Research center not found")
    
    # Prepare the email to the research center
    message = MessageSchema(
        subject=f"Follow-up on Visit Request {visit_request.request_id}",
        recipients=[research_center_email.email],
        body=f"Dear {research_center_email.email.split('@')[0].upper()},\n\n"
             f"This is a follow-up on the visit request with ID: {visit_request.request_id}.\n\n"
             f"Details of the request:\n"
             f"- Requestor: {visit_request.requestor}\n"
             f"- Visit Date: {visit_request.visit_date}\n"
             f"- Purpose: {visit_request.purpose}\n"
             f"- Status: {visit_request.status}\n\n"
             f"Please provide an update or confirm the status of this request.\n\n"
             f"Best regards,\n"
             f"STEERHub GMS Team",
        subtype="plain"
    )

    # Send the email in the background
    background_tasks.add_task(FastMail(conf).send_message, message)

    return {"msg": f"Follow-up email sent to {research_center_email.email} regarding request {visit_request.request_id}"}



@app.post("/request-password-reset/")
async def request_password_reset(request_data: PasswordResetRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    email = request_data.email
    print(f"looking up {email}")
    
    # Look up the user by email
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if not user:
        print("user / email not found")
        raise HTTPException(status_code=404, detail="User not found")

    # Generate a password reset token
    token = serializer.dumps(email, salt="password-reset-salt")

    # Construct the password reset link
    reset_link = f"{URL_FRONT_END_APP}/{PORT_FRONT_END_APP}/pages/reset-password/index.html?token={token}"

    # Prepare the email message
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[user.email],
        body=f"Hi {user.username},\n\n"
             f"You requested a password reset. Click the link below to reset your password:\n\n"
             f"{reset_link}\n\n"
             f"If you did not request a password reset, please ignore this email.\n\n"
             f"Best regards,\n"
             f"Your Service Team",
        subtype="plain"
    )

    # Send the email in the background
    background_tasks.add_task(FastMail(conf).send_message, message)

    return {"msg": f"Password reset link sent to {email}"}

@app.put("/users/reset-password")
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        # Verify the token and extract the email
        email = serializer.loads(request.token, salt="password-reset-salt", max_age=3600)
    except (SignatureExpired, BadSignature):
        raise HTTPException(status_code=400, detail="Invalid or expired token")

    # Find the user by email
    user = db.query(UserModel).filter(UserModel.email == email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Hash and update the user's password
    user.password = get_password_hash(request.new_password)
    db.commit()

    return {"msg": "Password has been reset successfully"}



@app.get("/research-center-requests/", response_model=List[VisitRequestResponse])
def get_visit_requests_by_center_email_and_status(
    email: str = Query(..., description="Email of the research center"),
    status: str = Query(..., description="Status of the visit request"),
    db: Session = Depends(get_db)
):
    # Query the visit_requests table based on research center's email and status
    visit_requests = db.query(VisitRequestModel).filter(
        VisitRequestModel.research_center == email,
        VisitRequestModel.status == status
    ).all()

    if not visit_requests:
        raise HTTPException(status_code=404, detail="No matching visit requests found")
    
    return visit_requests


@app.post("/research-center/request-password-reset/")
async def request_password_reset(background_tasks: BackgroundTasks, email: EmailSchema, db: Session = Depends(get_db)):
    # Query the research center by email
    research_center = db.query(ResearchCenterModel).filter_by(email=email.email).first()
    
    if not research_center:
        raise HTTPException(status_code=404, detail="Email not found")

     # Create a reset token and set expiration
    reset_token = create_access_token({"sub": research_center.email}, expires_delta=timedelta(minutes=15))
    research_center.reset_token = reset_token
    research_center.reset_token_expiration = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()
    
    # Construct the reset link with the token
    reset_link = f"{URL_FRONT_END_APP}/{PORT_FRONT_END_APP}pages/research-center-reset-password/index.html?token={research_center.reset_token}"
    
    # Construct the email content
    message = MessageSchema(
        subject="Password Reset Request",
        recipients=[email.email],  # List of recipients
        body=f"Please click the link to reset your password: {reset_link}",
        subtype="html"
    )

    fm = FastMail(conf)
    
    try:
        # Send the email asynchronously
        background_tasks.add_task(fm.send_message, message)
        return {"message": "Password reset email sent!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to send email") from e


# Reset password endpoint (changed to PUT)
@app.put("/research-center/reset-password/")
def reset_research_center_password(reset_data: ResearchCenterResetPassword, db: Session = Depends(get_db)):
    # Decode the token to get the email
    try:
        payload = jwt.decode(reset_data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    research_center = db.query(ResearchCenterModel).filter(ResearchCenterModel.email == email).first()
    if not research_center:
        raise HTTPException(status_code=404, detail="Research center not found")
    
    # Convert `reset_token_expiration` to offset-aware before comparing
    if research_center.reset_token != reset_data.token or research_center.reset_token_expiration.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    # Update the password
    research_center.password = get_password_hash(reset_data.new_password)
    research_center.reset_token = None  # Clear the reset token
    research_center.reset_token_expiration = None  # Clear the expiration time
    db.commit()

    return {"msg": "Password has been reset successfully"}

# Create the database tables
# Base.metadata.drop_all(bind=engine) #if need to drop only
Base.metadata.create_all(bind=engine)