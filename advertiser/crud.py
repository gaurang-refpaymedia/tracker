# advertiser/crud.py --


from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from sqlalchemy.orm import joinedload



def create_advertiser(db: Session, advertiser: schemas.AdvertiserCreate, company_code: str, created_by: str):
    existing = db.query(models.Advertiser).filter_by(email=advertiser.email, company_code=company_code).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Advertiser with this email already exists for the company")
    
    if advertiser.token:
        token_exists = db.query(models.Advertiser).filter_by(token=advertiser.token).first()
        if token_exists:
            raise HTTPException(status_code=400, detail="Token already exists")
    
    # Exclude fields that are passed manually to avoid conflict
    data = advertiser.model_dump(exclude={"company_code", "created_by"})
    
    db_adv = models.Advertiser(
        **data,
        company_code=company_code,
        created_by=created_by,
    )

    db.add(db_adv)
    try:
        db.commit()
        db.refresh(db_adv)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create advertiser due to a uniqueness conflict")
    
    return db_adv



def get_advertisers_for_company(db: Session, company_code: str):
    return db.query(models.Advertiser).filter_by(company_code=company_code).all()



def get_advertiser(db: Session, advertiser_id: int, company_code: str):
    return (
        db.query(models.Advertiser)
        .options(
            joinedload(models.Advertiser.adv_country),
            joinedload(models.Advertiser.adv_state),
            joinedload(models.Advertiser.adv_status),
            joinedload(models.Advertiser.adv_timezone),
            joinedload(models.Advertiser.company),
            joinedload(models.Advertiser.role),
            joinedload(models.Advertiser.creator_user),
            joinedload(models.Advertiser.creator_subuser),
        )
        .filter_by(id=advertiser_id, company_code=company_code)
        .first()
    )


def update_advertiser(db: Session, advertiser_id: int, updated_data: schemas.AdvertiserUpdate, company_code: str):
    advertiser = get_advertiser(db, advertiser_id, company_code)

    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")

    if advertiser.company_code != company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in updated_data.dict(exclude_unset=True).items():
        setattr(advertiser, field, value)

    try:
        db.commit()
        db.refresh(advertiser)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed due to a uniqueness conflict")
    return advertiser


def delete_advertiser(db: Session, advertiser_id: int, company_code: str):
    advertiser = get_advertiser(db, advertiser_id, company_code)

    if not advertiser:
        raise HTTPException(status_code=404, detail="Advertiser not found")

    if advertiser.company_code != company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(advertiser)
    db.commit()
    return {"detail": "Advertiser deleted successfully"}
