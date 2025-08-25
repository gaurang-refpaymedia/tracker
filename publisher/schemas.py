# publisher/schemas.py --


from pydantic import BaseModel, EmailStr
from typing import Optional

class CountryOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class StateOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

class StatusOut(BaseModel):
    id: int
    label: str
    class Config:
        orm_mode = True

class TimezoneOut(BaseModel):
    id: int
    code: str
    class Config:
        orm_mode = True

class CompanyOut(BaseModel):
    id: int
    name: str
    code: str
    class Config:
        orm_mode = True

class RoleOut(BaseModel):
    id: int
    code: str
    name: str
    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    name: str
    user_code: str
    class Config:
        orm_mode = True


class PublisherBase(BaseModel):
    id: int
    pubcode: str | None
    email: str | None
    contact_person: str | None
    contact_number: str | None
    token: str | None
    currency: str | None
    address: str | None
    active_state: bool

    pub_country: CountryOut
    pub_state: StateOut
    pub_status: StatusOut
    pub_timezone: TimezoneOut
    company: CompanyOut
    role: RoleOut | None
    creator_user: UserOut | None
    creator_subuser: UserOut | None

    class Config:
        orm_mode = True


class PublisherCreate(BaseModel):
    pubcode: str
    pub_country_id: int
    pub_status_id: int
    pub_state_id: int
    pub_timezone_id: int
    token: Optional[str]
    email: EmailStr



class PublisherUpdate(PublisherBase):
    pubcode: Optional[str]
    pub_country_id: Optional[int]
    pub_status_id: Optional[int]
    pub_state_id: Optional[int]
    pub_timezone_id: Optional[int]
    email: Optional[EmailStr]
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    currency: Optional[str]
    address: Optional[str]
    active_state: Optional[bool]


class PublisherResponse(PublisherBase):
    id: int
    company_code: str
    created_by: Optional[str]

    class Config:
        orm_mode = True


class Publisher(PublisherBase):
    id: int

    class Config:
        orm_mode = True


class PublisherOut(BaseModel):
    id: int
    pubcode: str | None
    email: str | None
    contact_person: str | None
    contact_number: str | None
    token: str | None
    currency: str | None
    address: str | None
    active_state: bool

    pub_country: CountryOut
    pub_state: StateOut
    pub_status: StatusOut
    pub_timezone: TimezoneOut
    company: CompanyOut
    role: RoleOut | None
    creator_user: UserOut | None
    creator_subuser: UserOut | None

    class Config:
        orm_mode = True