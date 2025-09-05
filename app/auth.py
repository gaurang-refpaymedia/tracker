# app/auth.py --
from passlib.context import CryptContext
from fastapi import Request, HTTPException, status
from typing import Dict, Optional
from sqlalchemy.orm import Session
from app.models import User, Role
from subuser.models import SubUser
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database import get_db  # or your correct import path

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password, password):
    return pwd_context.verify(plain_password, password)

def get_password_hash(password):
    return pwd_context.hash(password)


from sqlalchemy.orm import joinedload

# Dependency to get the current user from the session
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
) -> Dict:
    """
    Retrieves the current authenticated user's session data.
    Enriches with resolved foreign key IDs (company_id, role_id, etc).
    Raises HTTPException if user data is not found in session or user no longer exists.
    """
    user_data = request.session.get("user")
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in.",
            headers={"WWW-Authenticate": "Session"},
        )

    if user_data.get("role_code") == "SUPER_ADMIN":
        user = (
            db.query(User)
            .options(joinedload(User.company))
            .filter(User.user_code == user_data.get("user_code"))
            .first()
        )
    else:
        user = (
            db.query(SubUser)
            .options(
                joinedload(SubUser.company),
                joinedload(SubUser.role),
            )
            .filter(SubUser.user_code == user_data.get("user_code"))
            .first()
        )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User session invalid. Please log in again."
        )

    # Always attach IDs
    user_data["id"] = user.id

    if user.company:
        user_data["company_id"] = user.company.id

    # Role handling differs between User and SubUser
    if isinstance(user, SubUser) and user.role:
        user_data["role_id"] = user.role.id
    elif isinstance(user, User) and user.role_code:
        # fetch role id manually since User has only role_code
        role = db.query(Role).filter(Role.code == user.role_code).first()
        if role:
            user_data["role_id"] = role.id

    return user_data


# Auth function — checks User (SUPER_ADMIN) first, then SubUser (others)
async def authenticate_user(db: Session, username: str, password: str) -> Optional[Dict]:
    """
    Authenticates a user from either User (super_admin) or SubUser (all others) table.
    Returns a dictionary with user data if successful, else None.
    """
    # SUPER_ADMIN lookup from users table
    user = db.query(User).filter(User.email == username).first()
    if user and verify_password(password, user.password):
        return {
            "user_code": user.user_code,
            "username": user.email,
            "company_code": user.company_code,
            "role_code": user.role_code,
        }

    # Other roles from subusers table
    subuser = db.query(SubUser).filter(SubUser.email == username).first()
    if subuser and verify_password(password, subuser.password):
        return {
            "user_code": subuser.user_code,
            "username": subuser.email,
            "company_code": subuser.company_code,
            "role_code": subuser.role_code,
        }

    return None


# superadmin password - QvPNqUg4XRqf
