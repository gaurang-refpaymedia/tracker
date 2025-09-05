# advertiser/routes.py 

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Union

from . import crud, schemas
from app import database, auth
from app.models import User
from subuser.models import SubUser



router = APIRouter(prefix="/api/advertisers", tags=["Advertisers"])

# Define a type alias for the user/subuser object for cleaner type hints
Identity = Union[User, SubUser]

@router.post("/", response_model=schemas.AdvertiserOut)
def create_advertiser(
    advertiser: schemas.AdvertiserCreate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    """
    Creates a new advertiser and stamps it with the current user's code.
    """
    return crud.create_advertiser(
        db=db,
        advertiser=advertiser,
        company_code=current_identity.get("company_code",""),
        user_code=current_identity.get("user_code",""),
    )

@router.get("/", response_model=List[schemas.AdvertiserOut])
def get_advertisers(
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    """
    Retrieves all advertisers for the current user's company.
    """
    return crud.get_advertisers_for_company(db, current_identity.get("company_code",""))

@router.get("/{advertiser_id}", response_model=schemas.AdvertiserOut)
def read_advertiser(
    advertiser_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    """
    Retrieves a single advertiser by its ID, ensuring it belongs to the correct company.
    """
    advertiser = crud.get_advertiser(db, advertiser_id, current_identity.get("company_code",""))
    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")
    return advertiser

@router.put("/{advertiser_id}", response_model=schemas.AdvertiserOut)
def update_advertiser(
    advertiser_id: int,
    advertiser_update: schemas.AdvertiserUpdate,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    """
    Updates an advertiser and stamps the change with the current user's code.
    """
    advertiser = crud.update_advertiser(
        db,
        advertiser_id=advertiser_id,
        advertiser_update=advertiser_update,
        company_code=current_identity.get("company_code",""),
        user_code=current_identity.get("user_code",""),
    )
    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")
    return advertiser

@router.delete("/{advertiser_id}")
def delete_advertiser(
    advertiser_id: int,
    db: Session = Depends(database.get_db),
    current_identity: Identity = Depends(auth.get_current_user),
):
    """
    Deletes an advertiser.
    """
    success = crud.delete_advertiser(db, advertiser_id, current_identity.get("company_code",""))
    if not success:
        raise HTTPException(
            status_code=404, detail="Advertiser not found or already deleted"
        )
    return {"message": "Advertiser deleted successfully"}
