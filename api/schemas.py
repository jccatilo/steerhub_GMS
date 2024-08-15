from pydantic import BaseModel

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
