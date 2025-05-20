from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
import os
from app.database import Base, engine
from app.routes import auth_routes, company_routes, subscription_routes
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware

# Load environment variables from .env
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
origins = [
    "http://localhost",
    "http://localhost:3000",  # Or your React dev server port
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(subscription_routes.router)
