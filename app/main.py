# app/main.py --

from fastapi import FastAPI
from starlette.middleware.sessions import SessionMiddleware
from starlette.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
import os
from app.database import Base, engine
from app.routes import auth_routes, company_routes, subscription_routes, user_routes
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware
from advertiser import routes as advertiser_routes
from subuser import routes as subuser_routes

# Load environment variables from .env
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY, same_site="lax", https_only=False)

# Add CORS middleware to allow cross-origin requests
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # match your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="app/templates")

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router)
app.include_router(company_routes.router)
app.include_router(subscription_routes.router)
app.include_router(user_routes.router)
app.include_router(advertiser_routes.router)
app.include_router(subuser_routes.router)
