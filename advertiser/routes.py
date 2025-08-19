# advertiser/routes.py --


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas
from app import database
from app.models import User
from subuser.models import SubUser
from typing import Union

router = APIRouter(prefix="/api/advertisers", tags=["Advertisers"])

get_db = database.get_db

def get_current_identity(request, db: Session = Depends(get_db)) -> Union[User, SubUser]:
    user_data = request.session.get("user")
    if not user_data:
        raise HTTPException(status_code=401, detail="Not authenticated")

    role_code = user_data.get("role_code")
    user_code = user_data.get("user_code")

    if role_code == "SUPER_ADMIN":
        user = db.query(User).filter(User.user_code == user_code).first()
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    else:
        subuser = db.query(SubUser).filter(SubUser.user_code == user_code).first()
        if not subuser:
            raise HTTPException(status_code=401, detail="Sub-user not found")
        return subuser


@router.post("/", response_model=schemas.AdvertiserResponse)
def create_advertiser(
    advertiser: schemas.AdvertiserCreate,
    db: Session = Depends(get_db),
    current_identity = Depends(get_current_identity),
):
    return crud.create_advertiser(
        db=db,
        advertiser=advertiser,
        company_code=current_identity.company_code,
        created_by=current_identity.user_code,
    )


@router.get("/", response_model=List[schemas.AdvertiserResponse])
def get_advertisers(
    db: Session = Depends(get_db),
    current_identity = Depends(get_current_identity),
):
    return crud.get_advertisers_for_company(db, current_identity.company_code)


@router.get("/{advertiser_id}", response_model=schemas.AdvertiserResponse)
def get_advertiser_by_id(
    advertiser_id: int,
    db: Session = Depends(get_db),
    current_identity = Depends(get_current_identity),
):
    advertiser = crud.get_advertiser(db, advertiser_id, current_identity.company_code)
    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")
    return advertiser


@router.put("/{advertiser_id}", response_model=schemas.AdvertiserResponse)
def update_advertiser(
    advertiser_id: int,
    advertiser_update: schemas.AdvertiserUpdate,
    db: Session = Depends(get_db),
    current_identity = Depends(get_current_identity),
):
    advertiser = crud.update_advertiser(
        db, advertiser_id, advertiser_update, current_identity.company_code
    )
    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")
    return advertiser


@router.delete("/{advertiser_id}")
def delete_advertiser(
    advertiser_id: int,
    db: Session = Depends(get_db),
    current_identity = Depends(get_current_identity),
):
    success = crud.delete_advertiser(db, advertiser_id, current_identity.company_code)
    if not success:
        raise HTTPException(status_code=404, detail="Advertiser not found or already deleted")
    return {"message": "Advertiser deleted successfully"}
