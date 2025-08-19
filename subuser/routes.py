# subuser/routes.py --


from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List, Annotated
from . import schemas, crud
from app import database
import app.models as models
from subuser.models import SubUser
from passlib.context import CryptContext
import app.auth as auth

router = APIRouter(prefix="/api/subusers", tags=["SubUsers"])

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

get_db = database.get_db
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_current_identity(request: Request, db: Session = Depends(get_db)):
    user_data = request.session.get("user")
    if not user_data:
        raise HTTPException(status_code=401, detail="Not authenticated")

    role_code = user_data.get("role_code")
    user_code = user_data.get("user_code")

    if role_code == "SUPER_ADMIN":
        user = db.query(models.User).filter(models.User.user_code == user_code).first()
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
    print(current_identity)
    return crud.get_all_subusers_for_company(db, current_identity.company_code)


@router.get("/{subuser_id}", response_model=schemas.SubUserResponse)
def get_subuser(
    subuser_id: int,
    db: Session = Depends(get_db),
    current_identity=Depends(auth.get_current_user),
):
    subuser = crud.get_subuser_by_id(db, subuser_id)
    if not subuser or subuser.company_code != current_identity.company_code:
        raise HTTPException(status_code=404, detail="Sub-user not found or access denied")
    return subuser


@router.post("/create-sub-user", response_model=schemas.SubUserResponse)
async def create_sub_user(
    user_data: schemas.SubUserCreate,
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
        # Assuming `generate_user_code` is defined and imported elsewhere
        new_user_code = generate_user_code(company.code, existing_codes)

        # Check for email in both User and SubUser tables
        email_in_users = db.query(models.User).filter(models.User.email == user_data.email).first()
        email_in_subusers = db.query(SubUser).filter(SubUser.email == user_data.email).first()
        if email_in_users or email_in_subusers:
            raise HTTPException(status_code=400, detail="Email already in use")

        # IMPORTANT CHANGE: Hash the password provided from the frontend
        # This replaces the previous logic that generated a random password
        hashed_password = auth.get_password_hash(user_data.password)

        new_sub_user = SubUser(
            name=user_data.name,
            email=user_data.email,
            company_code=company.code,
            role_code=user_data.role_code,
            user_code=new_user_code,
            # The password attribute should be set to the hashed password
            password=hashed_password
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
        print("==================================")
        print("UPDATE TIME PASSWORD")
        print(updates.password)
        print("UPDATE TIME HASH")
        print(auth.get_password_hash(updates.password))
        print("==================================")
        updates.password = auth.get_password_hash(updates.password)

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
        "company_code": subuser.company_code,
        "role_code": subuser.role_code,
        "email": subuser.email,
    }

    return {"message": "Login successful"}
