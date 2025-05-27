from pydantic import BaseModel, constr, Field, EmailStr
from typing import Annotated
class CompanyCreate(BaseModel):
    name: str
    code: str
    subscription_code: str

class UserLogin(BaseModel):
    email: str
    password: str

# app/schemas.py
class PasswordChangeRequest(BaseModel):
    user_code: str # Add this line to accept user_code from the frontend
    old_password: str
    new_password: str = Field(..., min_length=8)


# You might want a schema for the user data stored in the session
class UserSessionData(BaseModel):
    user_code: str
    username: str # Optional, but useful
    
    
class SubUserCreateRequest(BaseModel):
    name: str
    email: EmailStr
    role_code: str