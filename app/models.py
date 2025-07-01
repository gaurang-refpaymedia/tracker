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

class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    code = Column(String(50), unique=True)
    subscription_code = Column(String(50), ForeignKey("subscriptions.code"))

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
