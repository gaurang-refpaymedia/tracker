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