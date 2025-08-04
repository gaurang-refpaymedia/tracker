# app/schemas.py --

from pydantic import BaseModel, constr, Field, EmailStr
from typing import Annotated, Optional, List


class CompanyCreate(BaseModel):
    name: str
    code: str
    subscription_code: str

class UserLogin(BaseModel):
    email: str
    password: str

class PasswordChangeRequest(BaseModel):
    user_code: str # Add this line to accept user_code from the frontend
    old_password: str
    new_password: str = Field(..., min_length=8)

class UserSessionData(BaseModel):
    user_code: str
    username: str  # Optional, but useful


OTPType = Annotated[str, constr(min_length=6, max_length=6)]
PasswordType = Annotated[str, constr(min_length=6)]
class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: OTPType
    new_password: PasswordType
    confirm_password: PasswordType