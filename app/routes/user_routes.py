# app/routes/user_routes.py

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from fastapi.responses import JSONResponse

from .. import models, schemas, auth # Ensure these imports are correct based on your project structure
from ..database import get_db # Assuming get_db is in app/database.py

router = APIRouter(
    prefix="/users", # Optional: prefix all routes in this router with /users
    tags=["users"]    # Optional: for OpenAPI documentation
)

@router.post("/api/change-password")
async def change_password(
    request_data: schemas.PasswordChangeRequest,
    db: Session = Depends(get_db),
    # The auth.get_current_user dependency should handle unauthorized access.
    # It's assumed this function retrieves user info (e.g., from session)
    # and raises HTTPException if the user is not authenticated.
    # It's also assumed it returns a dictionary or an object with user's identifying info.
    current_user_session_data: dict = Depends(auth.get_current_user)
):
    """
    Allows a logged-in user to change their password.
    Requires the old password and a new password.
    """
    # Ensure current_user_session_data contains an identifier like 'user_code' or 'email'
    # Let's assume 'user_code' is available from the session data as per your login route.
    user_identifier = current_user_session_data.get("user_code")
    if not user_identifier:
        # This case should ideally be caught by auth.get_current_user if session data is malformed
        raise HTTPException(status_code=401, detail="Could not identify user from session.")

    # Fetch the user from the database
    user_in_db = db.query(models.User).filter(models.User.user_code == user_identifier).first()

    if not user_in_db:
        # This would be unusual if the session is valid and user_code is correct
        raise HTTPException(status_code=404, detail="User not found.")

    # Verify the old password
    if not auth.verify_password(request_data.old_password, user_in_db.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect old password.")

    # Hash the new password
    new_hashed_password = auth.get_password_hash(request_data.new_password)

    # Update the user's password in the database
    user_in_db.hashed_password = new_hashed_password
    try:
        db.add(user_in_db)
        db.commit()
        db.refresh(user_in_db)
    except Exception as e:
        db.rollback()
        # Log the exception e
        raise HTTPException(status_code=500, detail="Could not update password. Please try again later.")

    return JSONResponse(content={"message": "Password changed successfully."})