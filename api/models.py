from sqlalchemy import Column, Integer, String,  DateTime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    institution_name = Column(String(255))
    username = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))  # This should store the hashed password

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