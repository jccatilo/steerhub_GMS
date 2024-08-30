from sqlalchemy import Column, Integer, String,  DateTime, Text
from database import Base
import random
import string
from sqlalchemy.sql import func
from datetime import datetime, timezone
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    institution_name = Column(String(255))
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))  # This should store the hashed password
    position = Column(String(255), nullable=True, default=None)
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Timestamp column

class VisitRequestModel(Base):
    __tablename__ = "visit_requests"

    id = Column(Integer, primary_key=True, index=True)
    research_center = Column(String(255), index=True)
    visit_type = Column(String(50))
    visit_date = Column(DateTime)
    duration = Column(Integer, nullable=True)
    purpose = Column(String(255))
    status = Column(String(50), default="pending")
    requestor = Column(String(255))  # Add the requestor column
    request_id = Column(String(6), unique=True, index=True)  # New request_id column
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Timestamp column
    requestor_remarks = Column(Text, nullable=True, default=None)  # New column, defaults to NULL
    center_remarks = Column(Text, nullable=True, default=None)     # New column, defaults to NULL
    # Generate a random alphanumeric request_id
    def generate_request_id(self):
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

class ResearchCenterModel(Base):
    __tablename__ = "research_centers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    max_guest_capacity = Column(Integer)
    reset_token = Column(String(255), nullable=True)  # Specify length for VARCHAR
    reset_token_expiration = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
