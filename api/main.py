from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, status

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from sqlalchemy.orm import Session
from models import VisitRequestModel, User as UserModel  # SQLAlchemy model
from schemas import UserCreate, User as UserSchema, UserUpdatePassword, UserLogin, Token, VisitRequest  # Pydantic schemas
from database import SessionLocal, engine, Base
from passlib.context import CryptContext
from dotenv import load_dotenv
import os
from typing import Union

from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

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
SECRET_KEY = os.getenv("SECRET_KEY")
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
        password=hashed_password  # Store the hashed password
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
    return {"access_token": access_token, "token_type": "bearer", "username": user.username}


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
def request_visit(visit: VisitRequest, db: Session = Depends(get_db)):
    # Create a new visit request record with the requestor field
    visit_request = VisitRequestModel(
        research_center=visit.research_center,
        visit_type=visit.visit_type,
        visit_date=visit.visit_date,
        duration=visit.duration,
        purpose=visit.purpose,
        status=visit.status,
        requestor=visit.requestor  # Set the requestor field
    )
    
    # Save the visit request to the database
    db.add(visit_request)
    db.commit()
    db.refresh(visit_request)
    
    return {"msg": "Visit request submitted successfully", "visit_id": visit_request.id, "status": visit_request.status}


# Create the database tables
# Base.metadata.drop_all(bind=engine) #if need to drop only
Base.metadata.create_all(bind=engine)