from fastapi import APIRouter, Request, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .. import database, models, auth  # Make sure these imports are correct
from fastapi.templating import Jinja2Templates
from ..auth import get_current_user

router = APIRouter()
templates = Jinja2Templates(directory="app/templates")  # Adjust directory if needed


def get_db():
    """
    Dependency function to get a database session.

    Yields:
        Session: A SQLAlchemy database session.
    """
    db = database.SessionLocal()  # Create a new database session
    try:
        yield db  # Yield the session to the route that needs it
    finally:
        db.close()  # Ensure the session is closed after it's used
        # This is crucial to prevent database connection leaks


@router.get("/api/")
def login_page(request: Request):
    """
    Route for displaying the login page.

    Args:
        request (Request): The incoming request object.

    Returns:
        TemplateResponse: Renders the login.html template.
    """
    return templates.TemplateResponse("login.html", {"request": request})  # Render the login page

@router.post("/api/login")
def login(request: Request, db: Session = Depends(get_db), email: str = Form(...), password: str = Form(...)):
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            if auth.verify_password(password, user.hashed_password):
                user_data = {
                    "email": user.email,
                    "name": user.name,
                    "user_code": user.user_code,
                    "company_code": user.company_code,
                    "role_code": user.role_code,
                }

                # Store in session
                request.session["user"] = user_data

                # Create a custom response and set cookie properly
                response = JSONResponse(content=user_data, status_code=200)
                response.set_cookie(
                    key="session",
                    value=request.session.get("user"),  # usually a session id if using session backend
                    httponly=True,
                    samesite="None",  # Required for cross-origin cookie
                    secure=False      # Set to True in production with HTTPS
                )
                return response

            else:
                return JSONResponse(content={"error": "Invalid Password"}, status_code=401)
        else:
            return JSONResponse(content={"error": "Email does not Exist"}, status_code=401)

    except Exception as e:
        print(f"Error in /login: {e}")
        return JSONResponse(
            content={"error": f"Internal server error: {e}"},
            status_code=500,
        )

@router.get("/api/dashboard")
async def dashboard(request: Request):
    """
    Route for displaying the dashboard.  Requires a logged-in user.

    Args:
        request (Request): The incoming request object.

    Returns:
        JSONResponse:
            - On success: Returns the user data as JSON.
            - On unauthorized: Returns a JSON response with a 401 status code.
            - On internal server error: Returns a JSON response with a 500 status.
    """
    try:
        user = auth.get_current_user(request)  # Get the current user from the request (session)
        if not user:
            return JSONResponse(content={"error": "Unauthorized"}, status_code=401)  # Return JSON if not logged in
        return JSONResponse(content={"user": user})  # Return user data as JSON
    except Exception as e:
        print(f"Error in /dashboard: {e}")  # Log the error
        return JSONResponse(
            content={"error": f"Internal server error: {e}"},  # Include error details
            status_code=500,  # Set status to 500
        )

@router.post("/api/logout")
async def logout(request: Request):
    """
    Route for handling user logout.

    Args:
        request (Request): The incoming request object.

    Returns:
        JSONResponse: Returns a JSON response indicating the result of the logout attempt.
            - On success: Returns a success message.
            - On internal server error: Returns a JSON response with a 500 status and error details.
    """
    try:
        if "user" in request.session:
            del request.session["user"]  # Remove user data from the session
        return JSONResponse(content={"message": "Successfully logged out"})
    except Exception as e:
        print(f"Error in /logout: {e}")  # Log the error
        return JSONResponse(
            content={"error": f"Internal server error: {e}"},
            status_code=500,
        )