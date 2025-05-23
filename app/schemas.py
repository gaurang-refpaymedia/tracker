from pydantic import BaseModel
from pydantic import BaseModel, constr
from pydantic import BaseModel, Field
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
    old_password: str
    new_password: str = Field(..., min_length=8)


# You might want a schema for the user data stored in the session
class UserSessionData(BaseModel):
    user_code: str
    username: str # Optional, but useful