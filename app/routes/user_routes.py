# app/routes/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse
from fastapi import status

from .. import models, schemas, auth # Ensure these imports are correct based on your project structure
from ..database import get_db # Assuming get_db is in app/database.py

router = APIRouter(
    # REMOVED prefix="/users" to make the endpoint directly under /api/change-password
    tags=["users"]    # Optional: for OpenAPI documentation
)

# Helper function to generate a random password
def generate_random_password(length=12):
    """Generate a random alphanumeric password."""
    # characters = string.ascii_letters + string.digits
    # return ''.join(secrets.choice(characters) for i in range(length))
    return "Admin1234"

def generate_user_code(company_code: str, existing_codes: list[str]) -> str:
    prefix = ''.join(filter(str.isalpha, company_code)).upper()[:2]
    if not prefix:
        prefix = company_code.upper()[:2]
    numbers = [int(code[len(prefix):]) for code in existing_codes if code.startswith(prefix) and code[len(prefix):].isdigit()]
    next_number = max(numbers, default=-1) + 1
    return f"{prefix}{next_number:03d}"


@router.post("/api/change-password")
async def change_password(
    request_data: schemas.PasswordChangeRequest,
    db: Session = Depends(get_db),
    current_user_session_data: dict = Depends(auth.get_current_user)
):
    """
    Allows a logged-in user to change their password.
    Requires the old password and a new password.
    """
    try:
        print("🔐 Incoming password change request:", request_data.dict())
        print("🧑 Session data received:", current_user_session_data)

        user_identifier = current_user_session_data.get("user_code")
        if not user_identifier:
            raise HTTPException(status_code=401, detail="Could not identify user from session.")

        user_in_db = db.query(models.User).filter(models.User.user_code == user_identifier).first()

        if not user_in_db:
            raise HTTPException(status_code=404, detail="User not found.")

        if not user_in_db.hashed_password:
            raise HTTPException(status_code=500, detail="User has no password set in DB.")

        if not auth.verify_password(request_data.old_password, user_in_db.hashed_password):
            raise HTTPException(status_code=400, detail="Incorrect old password.")

        new_hashed_password = auth.get_password_hash(request_data.new_password)

        user_in_db.hashed_password = new_hashed_password

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



@router.post("/api/create-sub-user")
async def create_sub_user(
    user_data: schemas.SubUserCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(auth.get_current_user)
):
    try:
        super_user_code = current_user.get("user_code")
        if not super_user_code:
            raise HTTPException(status_code=401, detail="Unauthorized")

        super_user = db.query(models.User).filter(models.User.user_code == super_user_code).first()
        if not super_user:
            raise HTTPException(status_code=404, detail="Super admin not found")

        # Check role
        super_admin_role = db.query(models.Role).filter(models.Role.code == super_user.role_code).first()
        if not super_admin_role or super_admin_role.code != "super_admin":
            raise HTTPException(status_code=403, detail="Only super admins can create sub-users")

        # Fetch company
        company = db.query(models.Company).filter(models.Company.code == super_user.company_code).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        # Check subscription limit
        subscription = db.query(models.Subscription).filter(models.Subscription.code == company.subscription_code).first()
        if not subscription:
            raise HTTPException(status_code=404, detail="Subscription not found")

        user_count = db.query(models.User).filter(models.User.company_code == company.code).count()
        if user_count >= subscription.max_users:
            raise HTTPException(status_code=400, detail="User limit reached for this company")

        # Generate unique user code
        existing_codes = [user.user_code for user in db.query(models.User).filter(models.User.company_code == company.code).all()]
        new_user_code = generate_user_code(company.code, existing_codes)


        generated_password = generate_random_password() # <--- Generate password here
        hashed_sub_user_password = auth.get_password_hash(generated_password) # <--- Hash the generated password
        
        
        # Ensure email not already used
        if db.query(models.User).filter(models.User.email == user_data.email).first():
            raise HTTPException(status_code=400, detail="Email already in use")

        # Create user
        new_user = models.User(
            name=user_data.name,
            email=user_data.email,
            hashed_password=hashed_sub_user_password,
            company_code=company.code,
            user_code=new_user_code,
            role_code=user_data.role_code
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        return JSONResponse(
            content={"message": "Sub-user created successfully", "user_code": new_user_code},
            status_code=201
        )

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        db.rollback()
        print("❗ Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail="Could not create user. Try again later.")
