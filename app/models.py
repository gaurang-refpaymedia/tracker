# app/models.py --

from sqlalchemy import Column, String, Integer, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    max_users = Column(Integer)
    

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True)
    name = Column(String(100))
    description = Column(String(255))
    is_active = Column(Boolean, default=True)
    user_rights_0 = Column(Boolean, default=True)
    user_rights_1 = Column(Boolean, default=True)
    user_rights_2 = Column(Boolean, default=True)
    user_rights_3 = Column(Boolean, default=True)
    user_rights_4 = Column(Boolean, default=True)
    user_rights_5 = Column(Boolean, default=True)
    user_rights_6 = Column(Boolean, default=True)
    user_rights_7 = Column(Boolean, default=True)
    user_rights_8 = Column(Boolean, default=True)
    user_rights_9 = Column(Boolean, default=True)
    
    subusers = relationship("SubUser", back_populates="role")



class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    code = Column(String(50), unique=True)
    subscription_code = Column(String(50), ForeignKey("subscriptions.code"))
    
     # Add these two lines below:
    users = relationship("User", back_populates="company", cascade="all, delete")
    subusers = relationship("SubUser", back_populates="company")
    

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    hashed_password = Column(String(200))
    company_code = Column(String(50), ForeignKey("companies.code"))
    user_code = Column(String(50), unique=True)
    role_code = Column(String(50), ForeignKey("roles.code"))
    otp = Column(String(6))

    company = relationship("Company", back_populates="users")
    created_subusers = relationship("SubUser", back_populates="creator")
    

class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    advertisers_by_country = relationship("Advertiser", back_populates="adv_country")


class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    advertisers_by_state = relationship("Advertiser", back_populates="adv_state")


class Status(Base):
    __tablename__ = "statuses"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), unique=True, nullable=False)
    advertisers_by_status = relationship("Advertiser", back_populates="adv_status")


class Timezone(Base):
    __tablename__ = "timezones"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)
    advertisers_by_timezone = relationship("Advertiser", back_populates="adv_timezone")
    