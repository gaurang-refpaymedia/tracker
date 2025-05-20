from fastapi import APIRouter, Request, Form, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from .. import database, models, auth  # Make sure these imports are correct
from fastapi.templating import Jinja2Templates

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


@router.get("/")
def login_page(request: Request):
    """
    Route for displaying the login page.

    Args:
        request (Request): The incoming request object.

    Returns:
        TemplateResponse: Renders the login.html template.
    """
    return templates.TemplateResponse("login.html", {"request": request})  # Render the login page


@router.post("/login")
def login(request: Request, db: Session = Depends(get_db), email: str = Form(...), password: str = Form(...)):
    """
    Route for handling user login.

    Args:
        request (Request): The incoming request object.
        db (Session, optional): A database session.  Injected by Depends(get_db).
        email (str, optional): The user's email from the form.  Required field.
        password (str, optional): The user's password from the form. Required field.

    Returns:
        JSONResponse:  Returns a JSON response indicating the result of the login attempt.
            - On success:  Returns user data as JSON.
            - On failure:  Returns a JSON response with an error message and a 401 status code.
            - On internal server error: Returns a JSON response with a 500 status and error details.
    """
    try:
        user = db.query(models.User).filter(models.User.email == email).first()  # Query the database for the user
        if user and auth.verify_password(password, user.hashed_password):  # Check if user exists and password is correct
            user_data = {
                "email": user.email,
                "name": user.name,
                "user_code": user.user_code,
                "company_code": user.company_code,
                "role_code": user.role_code,
            }
            request.session["user"] = user_data  # Store user data in the session.  Ensure session is configured!
            return JSONResponse(content=user_data)  # Return user data as JSON on successful login
        else:
            #  Return a JSONResponse for *all* failure cases
            return JSONResponse(content={"error": "Invalid credentials"}, status_code=401)  # Return JSON for invalid login
    except Exception as e:
        #  Catch *all* exceptions and return a JSONResponse
        print(f"Error in /login: {e}")  # Log the error!  Important for debugging
        return JSONResponse(
            content={"error": f"Internal server error: {e}"},  # Include the error details in the response
            status_code=500,  # Set the status code to 500 (Internal Server Error)
        )
    #  NO CODE SHOULD EXECUTE HERE (outside the try-except)
    #  This is to make sure that the function always returns a JSONResponse
    #  and doesn't fall through to an implicit None return, which would cause an error.



@router.get("/dashboard")
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
