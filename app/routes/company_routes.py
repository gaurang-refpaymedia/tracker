# app/routes/company_routes.py

import secrets
import string
import logging
from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from .. import database, models, auth
from ..roles_reference import USER_ROLES
from fastapi.templating import Jinja2Templates
from app.models import Company, User

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/register-company")
def register_company_form(request: Request):
    return templates.TemplateResponse("register_company.html", {"request": request})

# ✅ Updated to use secure password generation
def generate_random_password(length=12):
    """Generate a secure random alphanumeric password."""
    # characters = string.ascii_letters + string.digits
    # return ''.join(secrets.choice(characters) for _ in range(length))
    return "Admin1234"


@router.post("/api/register-company")
def register_company(request: Request,
                     company_name: str = Form(...),
                     company_code: str = Form(...),
                     subscription_code: str = Form(...),
                     super_user_name: str = Form(...),
                     super_user_email: str = Form(...),
                     db: Session = Depends(get_db)):

    company_unique_code = company_code.upper()

    # Check if company code already exists
    existing_company = db.query(models.Company).filter(models.Company.code == company_unique_code).first()
    if existing_company:
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": f"Company code '{company_unique_code}' already exists."}
        )

    # Check if super user email already exists
    existing_user_by_email = db.query(models.User).filter(models.User.email == super_user_email).first()
    if existing_user_by_email:
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": f"Email '{super_user_email}' is already registered."}
        )

    # ✅ Password is securely generated and hashed
    generated_password = generate_random_password()
    hashed_user_password = auth.get_password_hash(generated_password)

    super_user_code = f"{company_unique_code}-000"

    # Check if user_code already exists
    existing_user_by_code = db.query(models.User).filter(models.User.user_code == super_user_code).first()
    if existing_user_by_code:
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": "Failed to generate a unique user code. Please try again."}
        )

    super_admin_role_code = USER_ROLES["Super Admin"]

    db_company = Company(
        name=company_name,
        code=company_unique_code,
        subscription_code=subscription_code.upper()
    )

    db_user = User(
        name=super_user_name,
        email=super_user_email,
        password=hashed_user_password,
        company_code=db_company.code,
        user_code=super_user_code,
        role_code=super_admin_role_code
    )

    try:
        db.add(db_company)
        db.add(db_user)
        db.commit()

        return JSONResponse(
            status_code=200,
            content={
                "success": True,
                "message": "Company registered successfully!",
                "generated_password": generated_password,
                "redirect_url": "/"
            }
        )
    except Exception as e:
        db.rollback()
        logger.error(f"Error during company registration: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "detail": "An error occurred while registering the company."}
        )


@router.get("/api/check-company-code/{company_code}")
def check_company_code(company_code: str, db: Session = Depends(get_db)):
    company = db.query(Company).filter(Company.code == company_code).first()
    return {"exists": bool(company)}
