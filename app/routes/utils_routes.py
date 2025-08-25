# app/routes/utils_routes.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Subscription, Country, State, Status, Timezone # Import all necessary models

router = APIRouter()

# Endpoint to get all subscription options
@router.get("/api/subscriptions")
def get_subscriptions(db: Session = Depends(get_db)):
    """
    Retrieves all subscription records from the database.
    """
    subscriptions = db.query(Subscription).all()
    return subscriptions

# --- New Endpoints ---

@router.get("/api/countries")
def get_countries(db: Session = Depends(get_db)):
    """
    Retrieves all country records from the database.
    """
    countries = db.query(Country).all()
    return countries

@router.get("/api/states")
def get_states(db: Session = Depends(get_db)):
    """
    Retrieves all state records from the database.
    """
    states = db.query(State).all()
    return states

@router.get("/api/statuses")
def get_statuses(db: Session = Depends(get_db)):
    """
    Retrieves all status records from the database.
    """
    statuses = db.query(Status).all()
    return statuses

@router.get("/api/timezones")
def get_timezones(db: Session = Depends(get_db)):
    """
    Retrieves all timezone records from the database.
    """
    timezones = db.query(Timezone).all()
    return timezones
