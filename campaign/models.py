import enum
from sqlalchemy import (
    Column, Integer, String, ForeignKey, Date, Enum as SQLAlchemyEnum, 
    Boolean, Table, Text
)
from sqlalchemy.orm import relationship
from app.database import Base
from app.models import StampBaseModel # Inherit the stamp fields

# ===================================================================
# Association Tables for Many-to-Many Relationships
# ===================================================================

# Associates campaigns with their assigned publishers
campaign_publishers_association = Table('campaign_publishers_association', Base.metadata,
    Column('campaign_id', Integer, ForeignKey('campaigns.id'), primary_key=True),
    Column('publisher_id', Integer, ForeignKey('publishers.id'), primary_key=True)
)

# Associates campaigns with their blocked publishers
campaign_blocked_publishers_association = Table('campaign_blocked_publishers_association', Base.metadata,
    Column('campaign_id', Integer, ForeignKey('campaigns.id'), primary_key=True),
    Column('publisher_id', Integer, ForeignKey('publishers.id'), primary_key=True)
)

# Associates campaign payouts with specific publishers
payout_publishers_association = Table('payout_publishers_association', Base.metadata,
    Column('payout_id', Integer, ForeignKey('campaign_payouts.id'), primary_key=True),
    Column('publisher_id', Integer, ForeignKey('publishers.id'), primary_key=True)
)

# ===================================================================
# Enums for Choice Fields
# ===================================================================

class CampaignObjectiveEnum(enum.Enum):
    CONVERSIONS = "Conversions"
    SALE = "Sale"
    APP = "App"
    INSTALLS = "Installs"
    LEADS = "Leads"
    IMPRESSIONS = "Impressions"
    CLICKS = "Clicks"

class CampaignVisibilityEnum(enum.Enum):
    PUBLIC = "Public"
    PRIVATE = "Private"
    ASK_FOR_PERMISSION = "Ask For Permission"

class CampaignStatusEnum(enum.Enum):
    ACTIVE = "Active"
    PAUSED = "Paused"
    PENDING = "Pending"
    DISABLED = "Disabled"
    SUSPENDED = "Suspended"
    EXPIRED = "Expired"
    DELETED = "Deleted"

class DeviceEnum(enum.Enum):
    ALL = "ALL"
    DESKTOP = "DESKTOP"
    MOBILE = "MOBILE"
    TABLET = "TABLET"

class OSEnum(enum.Enum):
    ALL = "ALL"
    ANDROID = "ANDROID"
    IOS = "IOS"
    WINDOWS_OS = "WINDOWS OS"
    MAC_OS = "MAC OS"

# --- NEW Enums based on your request ---

class GoalTypeEnum(enum.Enum):
    PUBLIC = "PUBLIC"
    PRIVATE = "PRIVATE"
    PUBLISHER_SPECIFIC = "PUBLISHER_SPECIFIC"

class GoalPayoutTypeEnum(enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED = "FIXED"

class TrackMultipleConversionsEnum(enum.Enum):
    YES = "YES"
    YES_WITH_TXN_ID = "YES_WITH_TXN_ID"
    NO_DISCARD = "NO_DISCARD"
    NO_CANCEL = "NO_CANCEL"

class TargetingVariableEnum(enum.Enum):
    OS = "OS"
    DEVICE = "DEVICE"

class LogicEnum(enum.Enum):
    ALLOW = "Allow"
    BLOCK = "Block"

class ConditionEnum(enum.Enum):
    MATCHES = "matches"
    EXACT_MATCH = "exact_match"

# ===================================================================
# Model Definitions
# ===================================================================

class CampaignCategory(StampBaseModel):
    __tablename__ = 'campaign_categories'
    id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(255), unique=True, nullable=False)
    category_slug = Column(String(255), unique=True, nullable=False)

class Campaign(StampBaseModel):
    __tablename__ = 'campaigns'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    objective = Column(SQLAlchemyEnum(CampaignObjectiveEnum), default=CampaignObjectiveEnum.CONVERSIONS, nullable=False)
    visibility = Column(SQLAlchemyEnum(CampaignVisibilityEnum), default=CampaignVisibilityEnum.PRIVATE, nullable=False)
    status = Column(SQLAlchemyEnum(CampaignStatusEnum), default=CampaignStatusEnum.PENDING, nullable=False)
    advertiser_id = Column(Integer, ForeignKey("advertisers.id"), nullable=False)
    advertiser = relationship("Advertiser")
    publishers_assigned = relationship("Publisher", secondary=campaign_publishers_association)
    blocked_publishers = relationship("Publisher", secondary=campaign_blocked_publishers_association)
    currency_id = Column(Integer, ForeignKey("currencies.id"), nullable=False)
    currency = relationship("Currency")
    category_id = Column(Integer, ForeignKey("campaign_categories.id"), nullable=False)
    category = relationship("CampaignCategory")
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    company = relationship("Company")
    preview_url = Column(String(2048))
    url = Column(String(2048), nullable=False)
    devices = Column(SQLAlchemyEnum(DeviceEnum), default=DeviceEnum.ALL)
    os = Column(SQLAlchemyEnum(OSEnum), default=OSEnum.ALL)
    activation_date = Column(Date)
    unique_id = Column(String(20), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

class CampaignPayout(StampBaseModel):
    __tablename__ = 'campaign_payouts'
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey('campaigns.id'), nullable=False)
    campaign = relationship("Campaign")
    publishers = relationship("Publisher", secondary=payout_publishers_association)
    currency_id = Column(Integer, ForeignKey("currencies.id"), nullable=False)
    currency = relationship("Currency")
    payout = Column(String(255), nullable=False)
    revenue = Column(String(255), nullable=False)
    country_ids = Column(Text, nullable=True)
    # UPDATED: Using Enums for device and os types
    device_types = Column(SQLAlchemyEnum(DeviceEnum), nullable=True)
    os_types = Column(SQLAlchemyEnum(OSEnum), nullable=True)

class CampaignGoal(StampBaseModel):
    __tablename__ = 'campaign_goals'
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey('campaigns.id'), nullable=False)
    campaign = relationship("Campaign")
    goal_title = Column(String(255), nullable=False)
    goal_value = Column(String(255))
    # UPDATED: Using Enums for predefined choices
    goal_type = Column(SQLAlchemyEnum(GoalTypeEnum))
    hide_payout_from_publisher = Column(Boolean, default=False)
    goal_payout_type = Column(SQLAlchemyEnum(GoalPayoutTypeEnum))
    track_multiple_conversions = Column(SQLAlchemyEnum(TrackMultipleConversionsEnum))
    payout_and_revenue_coverage_country_ids = Column(Text)
    revenue = Column(String(255))
    payout = Column(String(255))

class CampaignTargetingRule(StampBaseModel):
    __tablename__ = 'campaign_targeting_rules'
    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey('campaigns.id'), nullable=False)
    campaign = relationship("Campaign")
    # UPDATED: Using Enums for predefined choices
    targeting_variable = Column(SQLAlchemyEnum(TargetingVariableEnum), nullable=False)
    logic = Column(SQLAlchemyEnum(LogicEnum), nullable=False)
    rule_block_name = Column(String(255))
    condition = Column(SQLAlchemyEnum(ConditionEnum), nullable=False)
