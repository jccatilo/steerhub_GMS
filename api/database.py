from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
import os
load_dotenv(dotenv_path="gms_configs.env")
DATABASE_URL = os.getenv("DATABASE_URL")
print("in database.py")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

try:
    print("trying to connect to db")
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"An error occurred: {e}")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
