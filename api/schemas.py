from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    institution_name: str
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        orm_mode = True


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

class VisitRequest(BaseModel):
    research_center: str
    visit_type: str
    visit_date: datetime
    duration: Optional[int] = None
    purpose: str
    requestor: str  # New requestor field
    status: Optional[str] = "pending"  # Status is optional but defaults to "pending"

    # class Config:
    #     schema_extra = {
    #         "example": {
    #             "research_center": "Center for AI Research",
    #             "visit_type": "group",
    #             "visit_date": "2024-08-16T09:00:00",
    #             "duration": 120,  # Duration in minutes or hours
    #             "purpose": "Discussing potential collaborations"
    #         }
    #     }