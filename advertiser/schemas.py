# advertiser/schemas.py --


from pydantic import BaseModel, EmailStr
from typing import Optional


class AdvertiserBase(BaseModel):
    advcode: str
    adv_country_id: int
    adv_status_id: int
    adv_state_id: int
    adv_timezone_id: int
    email: EmailStr
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    currency: Optional[str]
    address: Optional[str]
    active_state: Optional[bool] = True


class AdvertiserCreate(BaseModel):
    advcode: str
    adv_country_id: int
    adv_status_id: int
    adv_state_id: int
    adv_timezone_id: int
    token: Optional[str]
    email: EmailStr



class AdvertiserUpdate(BaseModel):
    advcode: Optional[str]
    adv_country_id: Optional[int]
    adv_status_id: Optional[int]
    adv_state_id: Optional[int]
    adv_timezone_id: Optional[int]
    email: Optional[EmailStr]
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    currency: Optional[str]
    address: Optional[str]
    active_state: Optional[bool]


class AdvertiserResponse(AdvertiserBase):
    id: int
    company_code: str
    created_by: Optional[str]

    class Config:
        orm_mode = True


class Advertiser(AdvertiserBase):
    id: int

    class Config:
        orm_mode = True


from pydantic import BaseModel

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


class AdvertiserOut(BaseModel):
    id: int
    advcode: str | None
    email: str | None
    contact_person: str | None
    contact_number: str | None
    token: str | None
    currency: str | None
    address: str | None
    active_state: bool

    adv_country: CountryOut
    adv_state: StateOut
    adv_status: StatusOut
    adv_timezone: TimezoneOut
    company: CompanyOut
    role: RoleOut | None
    creator_user: UserOut | None
    creator_subuser: UserOut | None

    class Config:
        orm_mode = True
