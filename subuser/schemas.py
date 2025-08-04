# subuser/schemas.py --

from pydantic import BaseModel, EmailStr
from typing import Optional


class SubUserBase(BaseModel):
    name: str
    email: EmailStr
    role_code: str
    active_state: Optional[bool] = True


class SubUserCreate(BaseModel):
    name: str
    email: EmailStr
    role_code: str
    phone: Optional[str] = None
    password: str


class SubUserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    role_code: Optional[str]
    active_state: Optional[bool]
    password: Optional[str]


class SubUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role_code: str
    company_code: str
    created_by: Optional[str] = None
    active_state: bool
    phone: Optional[str] = None

    class Config:
        orm_mode = True
        


class SubUserLogin(BaseModel):
    email: EmailStr
    password: str