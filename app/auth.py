from passlib.context import CryptContext
from fastapi import Request

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_user(request: Request):
    return request.session.get("user")


# superadmin password - QvPNqUg4XRqf
