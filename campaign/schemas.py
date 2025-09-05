from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import date, datetime

# Import ALL Enums directly from your models file
from .models import (
    CampaignObjectiveEnum, CampaignVisibilityEnum, CampaignStatusEnum,
    DeviceEnum, OSEnum, GoalTypeEnum, GoalPayoutTypeEnum,
    TrackMultipleConversionsEnum, TargetingVariableEnum, LogicEnum, ConditionEnum
)

# ===================================================================
# Base Stamp Schema
# ===================================================================

class StampBaseSchema(BaseModel):
    created_at: datetime
    updated_at: datetime
    created_by: str
    updated_by: str

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

# ===================================================================
# Schemas for CampaignCategory
# ===================================================================

class CampaignCategoryBase(BaseModel):
    category_name: str = Field(..., max_length=255)
    category_slug: str = Field(..., max_length=255)

class CampaignCategoryCreate(CampaignCategoryBase):
    pass

class CampaignCategoryOut(StampBaseSchema, CampaignCategoryBase):
    id: int

# ===================================================================
# Schemas for Campaign
# ===================================================================

class CampaignBase(BaseModel):
    title: str = Field(..., max_length=255)
    objective: CampaignObjectiveEnum = CampaignObjectiveEnum.CONVERSIONS
    visibility: CampaignVisibilityEnum = CampaignVisibilityEnum.PRIVATE
    status: CampaignStatusEnum = CampaignStatusEnum.PENDING
    advertiser_id: int
    publishers_assigned_ids: List[int] = Field(default_factory=list)
    blocked_publishers_ids: List[int] = Field(default_factory=list)
    preview_url: Optional[HttpUrl] = None
    url: HttpUrl
    devices: DeviceEnum = DeviceEnum.ALL
    os: OSEnum = OSEnum.ALL
    activation_date: Optional[date] = None
    unique_id: str = Field(..., max_length=20)
    description: Optional[str] = None
    notes: Optional[str] = None
    
    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    title: Optional[str] = None
    objective: Optional[CampaignObjectiveEnum] = None
    visibility: Optional[CampaignVisibilityEnum] = None
    status: Optional[CampaignStatusEnum] = None
    advertiser_id: Optional[int] = None
    publishers_assigned_ids: Optional[List[int]] = None
    blocked_publishers_ids: Optional[List[int]] = None
    preview_url: Optional[HttpUrl] = None
    url: Optional[HttpUrl] = None
    devices: Optional[DeviceEnum] = None
    os: Optional[OSEnum] = None
    activation_date: Optional[date] = None
    description: Optional[str] = None
    notes: Optional[str] = None

class CampaignOut(StampBaseSchema, CampaignBase):
    id: int
    company_id: int
    currency_id: int
    category_id: int

# ===================================================================
# Schemas for CampaignPayout
# ===================================================================

class CampaignPayoutBase(BaseModel):
    # The campaign_id will be taken from the URL path, so it's not needed here
    publisher_ids: List[int] = Field(default_factory=list)
    currency_id: int
    payout: str
    revenue: str
    country_ids: Optional[str] = None
    # UPDATED: Use the Enums for validation
    device_types: Optional[DeviceEnum] = None
    os_types: Optional[OSEnum] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class CampaignPayoutCreate(CampaignPayoutBase):
    pass

class CampaignPayoutUpdate(BaseModel):
    publisher_ids: Optional[List[int]] = None
    currency_id: Optional[int] = None
    payout: Optional[str] = None
    revenue: Optional[str] = None
    country_ids: Optional[str] = None
    device_types: Optional[DeviceEnum] = None
    os_types: Optional[OSEnum] = None

class CampaignPayoutOut(StampBaseSchema, CampaignPayoutBase):
    id: int
    campaign_id: int

# ===================================================================
# Schemas for CampaignGoal
# ===================================================================

class CampaignGoalBase(BaseModel):
    goal_title: str
    goal_value: Optional[str] = None
    hide_payout_from_publisher: bool = False
    payout_and_revenue_coverage_country_ids: Optional[str] = None
    revenue: Optional[str] = None
    payout: Optional[str] = None
    # UPDATED: Use the Enums for validation
    goal_type: Optional[GoalTypeEnum] = None
    goal_payout_type: Optional[GoalPayoutTypeEnum] = None
    track_multiple_conversions: Optional[TrackMultipleConversionsEnum] = None

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class CampaignGoalCreate(CampaignGoalBase):
    pass

class CampaignGoalUpdate(BaseModel):
    goal_title: Optional[str] = None
    goal_value: Optional[str] = None
    hide_payout_from_publisher: Optional[bool] = None
    payout_and_revenue_coverage_country_ids: Optional[str] = None
    revenue: Optional[str] = None
    payout: Optional[str] = None
    goal_type: Optional[GoalTypeEnum] = None
    goal_payout_type: Optional[GoalPayoutTypeEnum] = None
    track_multiple_conversions: Optional[TrackMultipleConversionsEnum] = None

class CampaignGoalOut(StampBaseSchema, CampaignGoalBase):
    id: int
    campaign_id: int

# ===================================================================
# Schemas for CampaignTargetingRule
# ===================================================================

class CampaignTargetingRuleBase(BaseModel):
    rule_block_name: Optional[str] = None
    # UPDATED: Use the Enums for validation
    targeting_variable: TargetingVariableEnum
    logic: LogicEnum
    condition: ConditionEnum

    class Config:
        from_attributes = True
        arbitrary_types_allowed = True

class CampaignTargetingRuleCreate(CampaignTargetingRuleBase):
    pass

class CampaignTargetingRuleUpdate(BaseModel):
    rule_block_name: Optional[str] = None
    targeting_variable: Optional[TargetingVariableEnum] = None
    logic: Optional[LogicEnum] = None
    condition: Optional[ConditionEnum] = None

class CampaignTargetingRuleOut(StampBaseSchema, CampaignTargetingRuleBase):
    id: int
    campaign_id: int
