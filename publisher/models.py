from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base
# Import the StampBaseModel to inherit from it
from app.models import StampBaseModel


class Publisher(StampBaseModel):
    __tablename__ = "publishers"
    __table_args__ = (
        # Constraint name updated to be unique across the database
        UniqueConstraint("company_code", "email", name="uq_company_email_publisher"),
    )

    id = Column(Integer, primary_key=True, index=True)
    pubcode = Column(String(25), index=True, nullable=True)

    pub_country_id = Column(Integer, ForeignKey("countries.id"), nullable=False)
    pub_country = relationship("Country")

    pub_status_id = Column(Integer, ForeignKey("statuses.id"), nullable=False)
    pub_status = relationship("Status")

    pub_state_id = Column(Integer, ForeignKey("states.id"), nullable=False)
    pub_state = relationship("State")

    pub_timezone_id = Column(Integer, ForeignKey("timezones.id"), nullable=False)
    pub_timezone = relationship("Timezone")

    company_code = Column(String(50), ForeignKey("companies.code"), nullable=False)
    company = relationship("Company")

    role_code = Column(String(50), ForeignKey("roles.code"), nullable=True)
    role = relationship("Role")

    creator_user = relationship("User", primaryjoin="foreign(Publisher.created_by) == User.user_code", viewonly=True)
    creator_subuser = relationship("SubUser", primaryjoin="foreign(Publisher.created_by) == SubUser.user_code", viewonly=True)

    # Relationships for 'updated_by' (inherited)
    updater_user = relationship("User", primaryjoin="foreign(Publisher.updated_by) == User.user_code", viewonly=True)
    updater_subuser = relationship("SubUser", primaryjoin="foreign(Publisher.updated_by) == SubUser.user_code", viewonly=True)

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
