from passlib.context import CryptContext
from fastapi import Request, HTTPException, status
from typing import Dict, Optional


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Dependency to get the current user from the session
async def get_current_user(request: Request) -> Dict:
    """
    Retrieves the current authenticated user's session data.
    Raises HTTPException if user data is not found in session.
    """
    user_data = request.session.get("user")
    print("==========================================================")
    print(user_data)
    print("==========================================================")
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated. Please log in.",
            headers={"WWW-Authenticate": "Session"},
        )
    return user_data

# In a real app, this would query your database
async def authenticate_user(db, username: str, password: str) -> Optional[Dict]:
    """
    Authenticates a user.
    Returns a dictionary with user data (e.g., {'user_code': '...', 'hashed_password': '...'})
    if authentication is successful, otherwise None.
    """
    # Simulate fetching user from DB (replace with actual DB query)
    # Example: In a real app, you'd fetch by username and check password
    if username == "testuser" and password == "Admin1234": # DANGER: Don't store plain passwords!
        # In a real app, you'd fetch the hashed password from DB and verify_password
        # For this example, we'll assume a known user and just return a user_code
        return {"user_code": "user123", "username": "testuser", "hashed_password": get_password_hash("Admin1234")}
    elif username == "anotheruser" and password == "SecurePass1":
        return {"user_code": "user456", "username": "anotheruser", "hashed_password": get_password_hash("SecurePass1")}
    return None


# superadmin password - QvPNqUg4XRqf
