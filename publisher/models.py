from sqlalchemy import Column, String, Integer, ForeignKey, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database import Base

class Publisher(Base):
    __tablename__ = "publishers"
    __table_args__ = (
        UniqueConstraint("company_code", "email", name="uq_company_email"),
    )

    id = Column(Integer, primary_key=True, index=True)
    advcode = Column(String(100), index=True, nullable=True)

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

    created_by = Column(String(50), nullable=True)

    creator_user = relationship("User", primaryjoin="foreign(Publisher.created_by) == User.user_code", viewonly=True)
    creator_subuser = relationship("SubUser", primaryjoin="foreign(Publisher.created_by) == SubUser.user_code", viewonly=True)

    email = Column(String(127), nullable=True)
    contact_person = Column(String(255), nullable=True)
    contact_number = Column(String(15), nullable=True)
    token = Column(String(255), unique=True, nullable=True)
    currency = Column(String(127), index=True, nullable=True)
    address = Column(String(255), nullable=True)
    active_state = Column(Boolean, default=True)
