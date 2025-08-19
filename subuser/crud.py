# subuser/crud.py --


from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from . import models, schemas
from app.models import User, Role
from typing import Union
from subuser.models import SubUser
from passlib.context import CryptContext
import uuid


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_all_subusers_for_company(db: Session, company_code: str):
    return db.query(models.SubUser).filter_by(company_code=company_code).all()

def get_subuser_by_id(db: Session, subuser_id: int):
    return db.query(models.SubUser).filter_by(id=subuser_id).first()

def create_subuser(db: Session, subuser: schemas.SubUserCreate, company_code: str, created_by: str):
    # ✅ Check if sub-user with same email already exists in the company
    existing = db.query(models.SubUser).filter_by(email=subuser.email, company_code=company_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Sub-user with this email already exists in the company")

    # ✅ Prevent assigning SUPER_ADMIN role to subusers
    if subuser.role_code == "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Cannot assign SUPER_ADMIN role to sub-user")

    # ✅ Ensure the role exists
    role = db.query(Role).filter_by(code=subuser.role_code).first()
    if not role:
        raise HTTPException(status_code=404, detail="Invalid role code")

    # ✅ Create SubUser instance safely
    db_subuser = models.SubUser(
        name=subuser.name,
        email=subuser.email,
        phone=subuser.phone,
        role_code=subuser.role_code,
        company_code=company_code,
        created_by=created_by,
        password=subuser.password,
        active_state=True  # Assuming default active on creation
    )
    
    db_subuser.user_code = f"SUB_{uuid.uuid4().hex[:10]}"

    db.add(db_subuser)
    try:
        db.commit()
        db.refresh(db_subuser)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Sub-user creation failed due to integrity error")

    return db_subuser


def update_subuser(db: Session, subuser_id: int, updates: schemas.SubUserUpdate, current_user: Union[User, SubUser]):
    subuser = get_subuser_by_id(db, subuser_id)
    if not subuser:
        raise HTTPException(status_code=404, detail="Sub-user not found")
    if subuser.company_code != current_user.company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    # ✅ Prevent changing to SUPER_ADMIN role
    if updates.role_code == "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Cannot assign SUPER_ADMIN role to sub-user")

    for field, value in updates.dict(exclude_unset=True).items():
        setattr(subuser, field, value)

    db.commit()
    db.refresh(subuser)
    return subuser

def deactivate_subuser(db: Session, subuser_id: int, current_user: Union[User, SubUser]):
    subuser = get_subuser_by_id(db, subuser_id)
    if not subuser:
        raise HTTPException(status_code=404, detail="Sub-user not found")
    if subuser.company_code != current_user.company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    subuser.active_state = False
    db.commit()
    db.refresh(subuser)
    return subuser

def delete_subuser(db: Session, subuser_id: int, current_user: Union[User, SubUser]):
    subuser = get_subuser_by_id(db, subuser_id)
    if not subuser:
        raise HTTPException(status_code=404, detail="Sub-user not found")
    if subuser.company_code != current_user.company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    # ✅ Restrict delete permission
    if current_user.role_code not in ["SUPER_ADMIN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Only SUPER_ADMIN or ADMIN can delete sub-users")

    db.delete(subuser)
    db.commit()
    return {"detail": "Sub-user deleted successfully"}


def get_subuser_by_email(db: Session, email: str):
    return db.query(models.SubUser).filter_by(email=email).first()
