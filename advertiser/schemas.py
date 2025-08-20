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
    pass



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
