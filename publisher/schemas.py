# publisher/schemas.py --


from pydantic import BaseModel, EmailStr
from typing import Optional


class PublisherBase(BaseModel):
    advcode: str
    pub_country_id: int
    pub_status_id: int
    pub_state_id: int
    pub_timezone_id: int
    email: EmailStr
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    currency: Optional[str]
    address: Optional[str]
    active_state: Optional[bool] = True


class PublisherCreate(BaseModel):
    advcode: str
    pub_country_id: int
    pub_status_id: int
    pub_state_id: int
    pub_timezone_id: int
    token: Optional[str]
    email: EmailStr



class PublisherUpdate(BaseModel):
    advcode: Optional[str]
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
