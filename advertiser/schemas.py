from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ===================================================================
# 1. Helper Schemas for Nested Objects
# ===================================================================

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
    """Represents a User or SubUser for creator/updater fields."""
    id: int
    name: str
    user_code: str
    class Config:
        orm_mode = True

# ===================================================================
# 2. Input Schemas (for create and update operations)
# ===================================================================

class AdvertiserCreate(BaseModel):
    """Schema for creating a new advertiser."""
    advcode: str
    adv_country_id: int
    adv_status_id: int
    adv_state_id: int
    adv_timezone_id: int
    email: EmailStr
    token: Optional[str] = None
    contact_person: Optional[str] = None
    contact_number: Optional[str] = None
    address: Optional[str] = None
    active_state: Optional[bool] = True

class AdvertiserUpdate(BaseModel):
    """Schema for updating an advertiser. All fields are optional."""
    advcode: Optional[str] = None
    adv_country_id: Optional[int] = None
    adv_status_id: Optional[int] = None
    adv_state_id: Optional[int] = None
    adv_timezone_id: Optional[int] = None
    email: Optional[EmailStr] = None
    contact_person: Optional[str] = None
    contact_number: Optional[str] = None
    token: Optional[str] = None
    address: Optional[str] = None
    active_state: Optional[bool] = None

# ===================================================================
# 3. Output Schemas (for API responses)
# ===================================================================

class AdvertiserBase(BaseModel):
    """A base schema for advertiser data including all audit fields."""
    id: int
    advcode: Optional[str]
    email: Optional[str]
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    address: Optional[str]
    active_state: bool

    # Timestamps and user stamps
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str

    # Nested objects for related data
    adv_country: CountryOut
    adv_state: StateOut
    adv_status: StatusOut
    adv_timezone: TimezoneOut
    company: CompanyOut
    role: Optional[RoleOut]

    # Relationships for creator and updater
    creator_user: Optional[UserOut]
    creator_subuser: Optional[UserOut]
    updater_user: Optional[UserOut]
    updater_subuser: Optional[UserOut]

    class Config:
        orm_mode = True

class AdvertiserResponse(AdvertiserBase):
    """An advertiser response that includes company_code."""
    company_code: str
    # 'created_by' is already in AdvertiserBase, no need to redefine
    class Config:
        orm_mode = True

class Advertiser(AdvertiserBase):
    """Basic advertiser schema, inherits all fields from AdvertiserBase."""
    class Config:
        orm_mode = True

class AdvertiserOut(BaseModel):
    """A standalone, comprehensive output schema for advertisers."""
    id: int
    advcode: Optional[str]
    email: Optional[str]
    contact_person: Optional[str]
    contact_number: Optional[str]
    token: Optional[str]
    address: Optional[str]
    active_state: bool

    # Timestamps and user stamps
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str

    # Nested objects for related data
    adv_country: CountryOut
    adv_state: StateOut
    adv_status: StatusOut
    adv_timezone: TimezoneOut
    company: CompanyOut
    role: Optional[RoleOut]

    # Relationships for creator and updater
    creator_user: Optional[UserOut]
    creator_subuser: Optional[UserOut]
    updater_user: Optional[UserOut]
    updater_subuser: Optional[UserOut]

    class Config:
        orm_mode = True
