from fastapi import APIRouter, Request, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from subuser.models import SubUser
from .. import database, models
from ..auth import get_current_user
from pydantic import BaseModel, EmailStr
import random
import string

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")

# === Dependency for DB session ===
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === Utility: Generate OTP ===
def generate_otp(length=6):
    return ''.join(random.choices(string.digits, k=length))

# === Utility: Set OTP for User/SubUser ===
def set_user_otp(db: Session, email: str):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        user = db.query(SubUser).filter(SubUser.email == email).first()
        if not user:
            return None
    otp_code = generate_otp()
    user.otp = otp_code
    db.commit()
    db.refresh(user)
    return otp_code

# === Utility: Authenticate User/SubUser ===
def authenticate_user(email: str, password: str, db: Session):
    # Assuming password is already hashed before being passed here
    user = db.query(models.User).filter(models.User.email == email).first()
    if user and password == user.hashed_password:
        return {
            "email": user.email,
            "name": user.name,
            "user_code": user.user_code,
            "company_code": user.company_code,
            "role_code": user.role_code,
        }

    subuser = db.query(SubUser).filter(SubUser.email == email).first()
    if subuser and password == subuser.hashed_password:
        return {
            "email": subuser.email,
            "name": subuser.name,
            "user_code": subuser.user_code,
            "company_code": subuser.company_code,
            "role_code": subuser.role_code,
        }

    return None

# === Utility: Create user session and cookie ===
def create_user_session(request: Request, user_data: dict):
    request.session["user"] = user_data
    response = JSONResponse(content=user_data, status_code=200)
    response.set_cookie(
        key="session",
        value=request.session.get("user"),
        httponly=True,
        samesite="None",
        secure=False
    )
    return response

# === Route: Login Page ===
@router.get("/api/")
def login_page(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

# === Route: Login ===
@router.post("/api/login")
def login(
    request: Request,
    db: Session = Depends(get_db),
    email: str = Form(...),
    password: str = Form(...),
):
    try:
        user_data = authenticate_user(email, password, db)
        if not user_data:
            return JSONResponse(content={"error": "Invalid Email or Password"}, status_code=401)
        return create_user_session(request, user_data)
    except Exception as e:
        print(f"Error in /login: {e}")
        return JSONResponse(content={"error": f"Internal server error: {e}"}, status_code=500)

# === Route: Dashboard (Role-Based Data) ===
@router.get("/api/dashboard")
async def dashboard(request: Request, db: Session = Depends(get_db)):
    try:
        user = get_current_user(request)
        if not user:
            return JSONResponse(content={"error": "Unauthorized"}, status_code=401)

        role_code = user.get("role_code")

        if role_code == "SUPER_ADMIN":
            data = {"dashboard": "SUPER_ADMIN view", "companies": db.query(models.Company).count()}
        elif role_code == "ADMIN":
            data = {
                "dashboard": "ADMIN view",
                "company_code": user["company_code"],
                "advertiser_count": db.query(models.Advertiser).filter_by(company_code=user["company_code"]).count()
            }
        elif role_code == "SUB_ADMIN":
            data = {"dashboard": "SUB_ADMIN view", "message": "Limited access to advertiser and publisher data."}
        elif role_code == "ADV_MANAGER":
            data = {"dashboard": "ADV_MANAGER view", "message": "Advertiser reports and leads."}
        elif role_code == "PUB_MANAGER":
            data = {"dashboard": "PUB_MANAGER view", "message": "Publisher performance and metrics."}
        else:
            data = {"dashboard": "Generic view", "message": f"No specific dashboard for role {role_code}"}

        return JSONResponse(content=data)

    except Exception as e:
        print(f"Error in /dashboard: {e}")
        return JSONResponse(content={"error": f"Internal server error: {e}"}, status_code=500)

# === Route: Logout ===
@router.post("/api/logout")
async def logout(request: Request):
    try:
        if "user" in request.session:
            del request.session["user"]
        return JSONResponse(content={"message": "Successfully logged out"})
    except Exception as e:
        print(f"Error in /logout: {e}")
        return JSONResponse(content={"error": f"Internal server error: {e}"}, status_code=500)

# === Route: Forgot Password (OTP Generation) ===
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

@router.post("/api/forgot-password")
def forgot_password(request_data: ForgotPasswordRequest, db: Session = Depends(get_db)):
    otp = set_user_otp(db, request_data.email)
    if not otp:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔐 Note: Do not return OTP in production
    return JSONResponse(content={"message": "OTP generated successfully", "otp": otp})



from app import auth
from app.schemas import ResetPasswordRequest


@router.post("/api/reset-password")
def reset_password_api(
    request_data: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == request_data.email).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.otp != request_data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")

    if request_data.new_password != request_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Hash and update password
    user.hashed_password = auth.pwd_context.hash(request_data.new_password)
    user.otp = None  # Clear OTP
    db.commit()

    return JSONResponse(content={"message": "Password reset successful. Please log in."}, status_code=200)