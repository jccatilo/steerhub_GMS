from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    institution_name: str
    username: str
    email: str

class UserCreate(UserBase):
    institution_name: str
    username: str
    email: EmailStr
    password: str
    position: Optional[str] = None  # Optional position field

class User(UserBase):
    id: int

    class Config:
        # orm_mode = True
        from_attributes = True


class UserUpdatePassword(BaseModel):
    email: str
    new_password: str


class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str  # Add username to the response
    email: str

class VisitRequest(BaseModel):
    research_center: str
    visit_type: str
    visit_date: datetime
    duration: Optional[int] = None
    purpose: str
    requestor: str  # New requestor field
    status: Optional[str] = "pending"  # Status is optional but defaults to "pending"
    


class VisitRequestResponse(BaseModel):
    id: int
    research_center: str
    visit_type: str
    visit_date: datetime
    duration: Optional[int]
    purpose: str
    status: str
    requestor: str
    request_id:str
    created_at: datetime  # Include the created_at timestamp in the response
    requestor_remarks: Optional[str] = None  # Include requestor_remarks
    center_remarks: Optional[str] = None     # Include center_remarks
    class Config:
        # orm_mode = True  # This is for converting SQLAlchemy objects to Pydantic
        from_attributes = True


class ResearchCenterSignUp(BaseModel):
    email: EmailStr
    password: str
    max_guest_capacity: int

class ResearchCenterLogin(BaseModel):
    email: EmailStr
    password: str

class ResearchCenterToken(BaseModel):
    access_token: str
    token_type: str
    center_id: int
    email: str

class UpdateRequestStatus(BaseModel):
    request_id: str
    status: str
    center_remarks: Optional[str] = None  # Optional center_remarks

    # class Config:
    #     schema_extra = {
    #         "example": {
    #             "request_id": "A1B2C3",
    #             "status": "approved"
    #         }
    #     }


class FollowUpEmailRequest(BaseModel):
    request_id: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class PasswordResetRequest(BaseModel):
    email: EmailStr