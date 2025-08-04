# subuser/models.py --

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base


class SubUser(Base):
    __tablename__ = "sub_users"
    __table_args__ = (
        UniqueConstraint("company_code", "email", name="uq_company_subuser_email"),
    )

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(127), nullable=False)
    role_code = Column(String(50), ForeignKey("roles.code"), nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)

    # Optional tracking fields
    user_code = Column(String(50), unique=True, nullable=True)
    
    company_code = Column(String(50), ForeignKey("companies.code"), nullable=False)

    created_by = Column(String(50), ForeignKey("users.user_code"), nullable=True)

    active_state = Column(Boolean, default=True)
    
    role = relationship("Role", back_populates="subusers")
    company = relationship("Company", back_populates="subusers")
    creator = relationship("User", back_populates="created_subusers")