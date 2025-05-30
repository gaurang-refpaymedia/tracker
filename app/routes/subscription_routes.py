# app/routes/subscription_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db  # Adjust based on your actual db session management file
from app.models import Subscription

router = APIRouter()

# Endpoint to get all subscription options
@router.get("/subscriptions")
def get_subscriptions(db: Session = Depends(get_db)):
    subscriptions = db.query(Subscription).all()  # Get all subscriptions from the DB
    return subscriptions
