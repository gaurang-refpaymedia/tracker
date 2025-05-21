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
    new_password: Annotated[str, Field(min_length=8)] # Enforce a minimum password length, adjust as needed