from sqlalchemy import create_engine

DATABASE_URL = "mysql+pymysql://root:@localhost/steerhub_gms"

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as connection:
        print("Connection successful!")
except Exception as e:
    print(f"An error occurred: {e}")
