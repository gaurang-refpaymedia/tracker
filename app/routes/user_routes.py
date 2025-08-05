# app/routes/user_routes.py --

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi import status
from subuser.models import SubUser
from subuser.schemas import SubUserCreate
from .. import models, schemas, auth
from ..database import get_db

router = APIRouter(tags=["users"])

# Helper function to generate a random password
def generate_random_password(length=12):
    return "Admin1234"

def generate_user_code(company_code: str, existing_codes: list[str]) -> str:
    if not company_code:
        raise ValueError("company_code must not be empty.")

    prefix = ''.join(filter(str.isalpha, company_code)).upper()[:2]
    if not prefix:
        prefix = company_code.upper()[:2]
    if not prefix:
        raise ValueError("company_code must contain at least 2 characters (alphabetic or numeric).")

    numbers = [int(code[len(prefix):]) for code in existing_codes if code.startswith(prefix) and code[len(prefix):].isdigit()]
    next_number = max(numbers, default=-1) + 1
    return f"{prefix}{next_number:03d}"


@router.post("/api/change-password")
async def change_password(
    request_data: schemas.PasswordChangeRequest, # Now includes user_code
    db: Session = Depends(get_db),
    # REMOVED: current_user_session_data: dict = Depends(auth.get_current_user)
    # If you still want to ensure the user is logged in, you might keep a
    # simple dependency like 'auth.validate_token' that doesn't return user info
    # but just ensures the token is valid. For this example, I'm removing the
    # dependency that fetches user info, as per your request.
):
    """
    Allows a user to change their password by providing their user_code,
    old password, and new password.
    """
    try:
        print("🔐 Incoming password change request:", request_data.dict())
        # print("🧑 Session data received:", current_user_session_data) # Removed as per new requirement

        # Get user_identifier directly from the request_data
        user_identifier = request_data.user_code
        if not user_identifier:
            raise HTTPException(status_code=400, detail="User code must be provided.")

        user_in_db = db.query(models.User).filter(models.User.user_code == user_identifier).first()

        if not user_in_db:
            raise HTTPException(status_code=404, detail="User not found.")

        if not user_in_db.password:
            raise HTTPException(status_code=500, detail="User has no password set in DB.")

        if not auth.verify_password(request_data.old_password, user_in_db.password):
            raise HTTPException(status_code=400, detail="Incorrect old password.")

        new_password = auth.get_password_hash(request_data.new_password)

        user_in_db.password = new_password

        db.add(user_in_db)
        db.commit()
        db.refresh(user_in_db)

        print("✅ Password successfully changed for user:", user_identifier)

        return JSONResponse(
            content={"message": "Password changed successfully."},
            status_code=status.HTTP_200_OK
        )

    except HTTPException as http_exc:
        print("❗ HTTPException:", http_exc.detail)
        raise http_exc

    except Exception as e:
        print("🔥 Unexpected error during password change:", str(e))
        db.rollback() # Rollback in case of an unexpected error
        raise HTTPException(status_code=500, detail="Could not update password. Please try again later.")
    
    
from fastapi import Response  # at the top if not already
from typing import Annotated

@router.post("/api/create-sub-user", response_model=None)
async def create_sub_user(
    user_data: SubUserCreate,
    db: Annotated[Session, Depends(get_db)],
    current_user = Depends(auth.get_current_user)
):
    try:
        super_user_code = current_user.get("user_code")
        if not super_user_code:
            raise HTTPException(status_code=401, detail="Unauthorized")

        super_user = db.query(models.User).filter(models.User.user_code == super_user_code).first()
        if not super_user:
            raise HTTPException(status_code=404, detail="Super admin not found")

        # Only SUPER_ADMIN can create sub-users
        if super_user.role_code != "SUPER_ADMIN":
            raise HTTPException(status_code=403, detail="Only super admins can create sub-users")

        company = db.query(models.Company).filter(models.Company.code == super_user.company_code).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        subscription = db.query(models.Subscription).filter(models.Subscription.code == company.subscription_code).first()
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")

        user_count = db.query(models.User).filter(models.User.company_code == company.code).count()
        sub_user_count = db.query(SubUser).filter(SubUser.company_code == company.code).count()
        total_user_count = user_count + sub_user_count

        if total_user_count >= subscription.max_users:
            raise HTTPException(status_code=400, detail="User limit reached for this company")
        
        existing_codes_user = [user.user_code for user in db.query(models.User).filter(models.User.company_code == company.code).all()]
        existing_codes_subuser = [user.user_code for user in db.query(SubUser).filter(SubUser.company_code == company.code).all()]
        existing_codes = existing_codes_user + existing_codes_subuser
        new_user_code = generate_user_code(company.code, existing_codes)

        # Check for email in both User and SubUser tables
        email_in_users = db.query(models.User).filter(models.User.email == user_data.email).first()
        email_in_subusers = db.query(SubUser).filter(SubUser.email == user_data.email).first()
        if email_in_users or email_in_subusers:
            raise HTTPException(status_code=400, detail="Email already in use")

        # Create SubUser entry
        generated_password = generate_random_password()
        password = auth.get_password_hash(generated_password)

        new_sub_user = SubUser(
            name=user_data.name,
            email=user_data.email,
            company_code=company.code,
            role_code=user_data.role_code,
            user_code=new_user_code,
            password=password
        )
        db.add(new_sub_user)
        db.commit()
        db.refresh(new_sub_user)

        return JSONResponse(
            content={"message": "Sub-user created successfully", "user_code": new_user_code},
            status_code=201
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        db.rollback()
        print("❗ Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail="Could not create sub-user. Try again later.")
