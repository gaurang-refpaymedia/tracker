# subuser/models.py --

from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
from app.models import StampBaseModel


class SubUser(StampBaseModel):
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

    user_code = Column(String(50), unique=True, nullable=True)
    
    company_code = Column(String(50), ForeignKey("companies.code"), nullable=False)
    
    active_state = Column(Boolean, default=True)
    
    role = relationship("Role", back_populates="subusers")
    company = relationship("Company", back_populates="subusers")
    
    creator_user = relationship("User", primaryjoin="foreign(SubUser.created_by) == User.user_code", viewonly=True)
    creator_subuser = relationship("SubUser", primaryjoin="foreign(SubUser.created_by) == SubUser.user_code", viewonly=True)
    
    updater_user = relationship("User", primaryjoin="foreign(SubUser.updated_by) == User.user_code", viewonly=True)
    updater_subuser = relationship("SubUser", primaryjoin="foreign(SubUser.updated_by) == SubUser.user_code", viewonly=True)

    @property
    def creator(self):
        """Returns the User or SubUser object who created this record."""
        return self.creator_user or self.creator_subuser

    @property
    def updater(self):
        """Returns the User or SubUser object who last updated this record."""
        return self.updater_user or self.updater_subuser
