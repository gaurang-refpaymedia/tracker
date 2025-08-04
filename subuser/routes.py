# subuser/routes.py --


from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from . import schemas, crud
from app import database
from app.models import User
from subuser.models import SubUser
from passlib.context import CryptContext

router = APIRouter(prefix="/subusers", tags=["SubUsers"])

get_db = database.get_db
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_identity(request: Request, db: Session = Depends(get_db)):
    user_data = request.session.get("user")
    if not user_data:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_type = user_data.get("user_type")
    user_code = user_data.get("user_code")

    if user_type == "super_admin":
        user = db.query(User).filter(User.user_code == user_code).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    else:
        subuser = db.query(SubUser).filter(SubUser.user_code == user_code).first()
        if not subuser:
            raise HTTPException(status_code=401, detail="Sub-user not found")
        return subuser


@router.get("/", response_model=List[schemas.SubUserResponse])
def get_subusers(
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    return crud.get_all_subusers_for_company(db, current_identity.company_code)


@router.get("/{subuser_id}", response_model=schemas.SubUserResponse)
def get_subuser(
    subuser_id: int,
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    subuser = crud.get_subuser_by_id(db, subuser_id)
    if not subuser or subuser.company_code != current_identity.company_code:
        raise HTTPException(status_code=404, detail="Sub-user not found or access denied")
    return subuser


@router.post("/", response_model=schemas.SubUserResponse)
def create_subuser(
    subuser: schemas.SubUserCreate,
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    # Only SUPER_ADMIN can create sub-users
    if current_identity.role_code != "SUPER_ADMIN":
        raise HTTPException(status_code=403, detail="Only SUPER_ADMIN can create sub-users")

    # Check email uniqueness across both tables
    existing_user = db.query(User).filter(User.email == subuser.email).first()
    existing_subuser = db.query(SubUser).filter(SubUser.email == subuser.email).first()
    if existing_user or existing_subuser:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Hash password before storing
    subuser.password = pwd_context.hash(subuser.password)

    return crud.create_subuser(db, subuser, current_identity.company_code, current_identity.user_code)


@router.put("/{subuser_id}", response_model=schemas.SubUserResponse)
def update_subuser(
    subuser_id: int,
    updates: schemas.SubUserUpdate,
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    target = crud.get_subuser_by_id(db, subuser_id)
    if not target or target.company_code != current_identity.company_code:
        raise HTTPException(status_code=404, detail="Sub-user not found or access denied")

    # Only SUPER_ADMIN and ADMIN can update any subuser, others can update only self
    if target.user_code != current_identity.user_code and current_identity.role_code not in ["SUPER_ADMIN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="You can only update your own sub-user profile")

    # Optional: hash password if it's being updated
    if updates.password:
        updates.password = pwd_context.hash(updates.password)

    return crud.update_subuser(db, subuser_id, updates, current_identity)


@router.patch("/{subuser_id}/deactivate", response_model=schemas.SubUserResponse)
def deactivate_subuser(
    subuser_id: int,
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    if current_identity.role_code not in ["SUPER_ADMIN", "ADMIN", "SUB_ADMIN"]:
        raise HTTPException(status_code=403, detail="You are not allowed to deactivate sub-users")

    target = crud.get_subuser_by_id(db, subuser_id)
    if not target or target.company_code != current_identity.company_code:
        raise HTTPException(status_code=404, detail="Sub-user not found or access denied")

    return crud.deactivate_subuser(db, subuser_id, current_identity)


@router.delete("/{subuser_id}")
def delete_subuser(
    subuser_id: int,
    db: Session = Depends(get_db),
    current_identity=Depends(get_current_identity),
):
    if current_identity.role_code not in ["SUPER_ADMIN", "ADMIN"]:
        raise HTTPException(status_code=403, detail="You are not allowed to delete sub-users")

    target = crud.get_subuser_by_id(db, subuser_id)
    if not target or target.company_code != current_identity.company_code:
        raise HTTPException(status_code=404, detail="Sub-user not found or access denied")

    return crud.delete_subuser(db, subuser_id, current_identity)


@router.post("/login")
def subuser_login(credentials: schemas.SubUserLogin, request: Request, db: Session = Depends(get_db)):
    subuser = crud.get_subuser_by_email(db, credentials.email)
    if not subuser or not pwd_context.verify(credentials.password, subuser.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not subuser.active_state:
        raise HTTPException(status_code=403, detail="Sub-user is deactivated")

    # Set user info in session cookie for session-based auth
    request.session["user"] = {
        "user_code": subuser.user_code,
        "user_type": "subuser",
        "company_code": subuser.company_code,
        "role_code": subuser.role_code,
        "email": subuser.email,
    }

    return {"message": "Login successful"}
