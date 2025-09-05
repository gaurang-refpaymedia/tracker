# subuser/schemas.py --

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserOut(BaseModel):
    id: int
    name: str
    user_code: str
    class Config:
        orm_mode = True


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
    created_at: datetime
    updated_at: datetime
    updated_by: str
    creator_user: Optional[UserOut] = None
    creator_subuser: Optional[UserOut] = None
    updater_user: Optional[UserOut] = None
    updater_subuser: Optional[UserOut] = None

    model_config = {
        "from_attributes": True
    }


class SubUserLogin(BaseModel):
    email: EmailStr
    password: str