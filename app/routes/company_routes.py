import secrets
import string
from fastapi import APIRouter, Request, Form, Depends, HTTPException
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from .. import database, models, auth
from ..roles_reference import USER_ROLES
from fastapi.templating import Jinja2Templates
from app.models import Company, User
import logging

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



# Helper function to generate a random password
def generate_random_password(length=12):
    """Generate a random alphanumeric password."""
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for i in range(length))


@router.post("/register-company")
def register_company(request: Request,
                    company_name: str = Form(...),
                    company_code: str = Form(...),
                    subscription_code: str = Form(...),
                    super_user_name: str = Form(...),
                    super_user_email: str = Form(...),
                    db: Session = Depends(get_db)):
    
    # Normalize the company code to uppercase
    company_unique_code = company_code.upper()

    # 1. Check if Company Code already exists
    existing_company = db.query(models.Company).filter(models.Company.code == company_unique_code).first()
    if existing_company:
        # Handle error: redirect back with message or return JSON error
        # For now, an HTTP Exception. In a real app, you might redirect with an error query param.
        raise JSONResponse(status_code=500, content={"success": False, "detail": f"Company code '{company_unique_code}' already exists."})

    # 2. Check if Super User Email already exists
    existing_user_by_email = db.query(models.User).filter(models.User.email == super_user_email).first()
    if existing_user_by_email:
        raise JSONResponse(status_code=500, content={"success": False, "detail":f"Email '{super_user_email}' is already registered."})
        # raise HTTPException(status_code=400, detail=f"Email '{super_user_email}' is already registered.")

     # 3. Generate the Super User password and code
    generated_password = generate_random_password() # <--- Generate password here
    hashed_user_password = auth.get_password_hash(generated_password) # <--- Hash the generated password

    super_user_code = f"{company_unique_code}-000"
    
    # 4. Check if this generated user_code already exists (important due to unique constraint)
    existing_user_by_code = db.query(models.User).filter(models.User.user_code == super_user_code).first()
    if existing_user_by_code:
        # This scenario should be rare if company_unique_code is unique, but good to handle.
        # You might need a more robust user_code generation strategy (e.g., UUID).
        raise JSONResponse(status_code=500, content={"success": False, "detail": "Failed to generate a unique user code. Please try again."})
        # raise HTTPException(status_code=500, detail="Failed to generate a unique user code. Please try again.")

    # 5. Define the role for the super user
    super_admin_role_code = USER_ROLES["Super Admin"] # As per your requirement
    
    
    # Create Company instance
    db_company = Company(
        name=company_name,
        code=company_unique_code, # Use the normalized company code
        subscription_code=subscription_code.upper() # Assuming subscription codes are also stored uppercase
    )
    
    # Create User instance (Super User)
    db_user = User(
        name=super_user_name,            # Correct field name
        email=super_user_email,          # Correct field name
        hashed_password=hashed_user_password, # Store the HASHED password
        company_code=db_company.code,    # Link to the company's code
        user_code=super_user_code,       # Generated unique user code
        role_code=super_admin_role_code  # Assigned role code
    )
    
    try:
        db.add(db_company)
        db.add(db_user)
        db.commit()
        
        # Return success JSON response including the generated password
        return JSONResponse(status_code=200, content={
            "success": True,
            "message": "Company registered successfully!",
            "generated_password": generated_password,
            "redirect_url": "/"
        })
        
    except Exception as e:
        db.rollback()
        logger.error(f"Error during company registration: {e}") # Log the actual error
        return JSONResponse(status_code=500, content={"success": False, "detail": "An error occurred while registering the company."})
    
    return RedirectResponse(url="/", status_code=302)

# Endpoint to check if company code already exists
@router.get("/check-company-code/{company_code}")
def check_company_code(company_code: str, db: Session = Depends(get_db)):
    # Query the database to check if the company code exists
    company = db.query(Company).filter(Company.code == company_code).first()
    if company:
        return {"exists": True}
    return {"exists": False}

