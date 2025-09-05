from sqlalchemy import (
    Column, String, Integer, ForeignKey, Boolean, UniqueConstraint
)
from sqlalchemy.orm import relationship
# Base is still needed by SQLAlchemy's internals even if not directly inherited
from app.database import Base 
from app.models import StampBaseModel

class Advertiser(StampBaseModel):
    __tablename__ = "advertisers"
    __table_args__ = (
        UniqueConstraint("company_code", "email", name="uq_company_email_advertiser"),
    )

    id = Column(Integer, primary_key=True, index=True)
    advcode = Column(String(25), index=True, nullable=True)

    adv_country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    adv_country = relationship("Country")

    adv_status_id = Column(Integer, ForeignKey("statuses.id"), nullable=False)
    adv_status = relationship("Status")

    adv_state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    adv_state = relationship("State")

    adv_timezone_id = Column(Integer, ForeignKey("timezones.id"), nullable=False)
    adv_timezone = relationship("Timezone")

    company_code = Column(String(50), ForeignKey("companies.code"), nullable=False)
    company = relationship("Company")

    role_code = Column(String(50), ForeignKey("roles.code"), nullable=True)
    role = relationship("Role")

    # The 'created_by' and 'updated_by' fields are now inherited from StampBaseModel.

    # Relationships for 'created_by'
    creator_user = relationship("User", primaryjoin="foreign(Advertiser.created_by) == User.user_code", viewonly=True)
    creator_subuser = relationship("SubUser", primaryjoin="foreign(Advertiser.created_by) == SubUser.user_code", viewonly=True)

    # Relationships for 'updated_by'
    updater_user = relationship("User", primaryjoin="foreign(Advertiser.updated_by) == User.user_code", viewonly=True)
    updater_subuser = relationship("SubUser", primaryjoin="foreign(Advertiser.updated_by) == SubUser.user_code", viewonly=True)

    email = Column(String(127), nullable=True)
    contact_person = Column(String(255), nullable=True)
    contact_number = Column(String(15), nullable=True)
    token = Column(String(255), unique=True, nullable=True)
    address = Column(String(255), nullable=True)
    active_state = Column(Boolean, default=True)

    # Convenience properties to get the creator/updater object easily
    @property
    def creator(self):
        """Returns the User or SubUser object who created this record."""
        return self.creator_user or self.creator_subuser

    @property
    def updater(self):
        """Returns the User or SubUser object who last updated this record."""
        return self.updater_user or self.updater_subuser

