# app/models.py 

from sqlalchemy import (
    Column, String, Integer, ForeignKey, Boolean, DateTime, func
)
from sqlalchemy.orm import relationship, declarative_base
from .database import Base 

class StampBaseModel(Base): 
    """
    An abstract base model that provides timestamp and user-stamping fields.
    - created_at: Timestamp of object creation.
    - updated_at: Timestamp of last object update.
    - created_by: The 'user_code' of the user/subuser who created the object.
    - updated_by: The 'user_code' of the user/subuser who last updated the object.
    """
    __abstract__ = True

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    
    created_by = Column(String(50), nullable=False)
    updated_by = Column(String(50), nullable=False)
    
    
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
    
    users = relationship("User", back_populates="company", cascade="all, delete")
    subusers = relationship("SubUser", back_populates="company")
    

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100), unique=True)
    password = Column(String(200))
    company_code = Column(String(50), ForeignKey("companies.code"))
    user_code = Column(String(50), unique=True)
    role_code = Column(String(50), ForeignKey("roles.code"))
    otp = Column(String(6))

    company = relationship("Company", back_populates="users")
    created_subusers = relationship("SubUser", primaryjoin="foreign(SubUser.created_by) == User.user_code", viewonly=True)
    

class Country(Base):
    __tablename__ = "countries"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)


class State(Base):
    __tablename__ = "states"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)


class Status(Base):
    __tablename__ = "statuses"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(100), unique=True, nullable=False)


class Timezone(Base):
    __tablename__ = "timezones"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, nullable=False)

    
class Currency(Base):
    __tablename__ = "currencies"
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(5), unique=True, nullable=False)
