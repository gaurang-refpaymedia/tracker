# publisher/crud.py --


from sqlalchemy.orm import Session
from . import models, schemas
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.models import Company, User
from sqlalchemy.orm import joinedload


def create_publisher(db: Session, publisher: schemas.PublisherCreate, company_code: str, created_by: str):
    existing = db.query(models.Publisher).filter_by(email=publisher.email, company_code=company_code).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Publisher with this email already exists for the company")
    
    if publisher.token:
        token_exists = db.query(models.Publisher).filter_by(token=publisher.token).first()
        if token_exists:
            raise HTTPException(status_code=400, detail="Token already exists")
    
    # Exclude fields that are passed manually to avoid conflict
    data = publisher.model_dump(exclude={"company_code", "created_by"})
    
    db_pub = models.Publisher(
        **data,
        company_code=company_code,
        created_by=created_by,
    )

    db.add(db_pub)
    try:
        db.commit()
        db.refresh(db_pub)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Failed to create publisher due to a uniqueness conflict")
    
    return db_pub



def get_publishers_for_company(db: Session, company_code: str):
    return db.query(models.Publisher).filter_by(company_code=company_code).all()


def get_publisher(db: Session, publisher_id: int, company_code: str):
    return (
        db.query(models.Publisher)
        .options(
            joinedload(models.Publisher.pub_country),
            joinedload(models.Publisher.pub_state),
            joinedload(models.Publisher.pub_status),
            joinedload(models.Publisher.pub_timezone),
            joinedload(models.Publisher.company),
            joinedload(models.Publisher.role),
            joinedload(models.Publisher.creator_user),
            joinedload(models.Publisher.creator_subuser),
        )
        .filter_by(id=publisher_id, company_code=company_code)
        .first()
    )


def update_publisher(db: Session, publisher_id: int, updated_data: schemas.PublisherUpdate, company_code: str):
    publisher = get_publisher(db, publisher_id, company_code)

    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")

    if publisher.company_code != company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    for field, value in updated_data.model_dump(exclude_unset=True).items():
        if hasattr(publisher, field):
            setattr(publisher, field, value)

    try:
        db.commit()
        db.refresh(publisher)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Update failed due to a uniqueness conflict")
    return publisher


def delete_publisher(db: Session, publisher_id: int, company_code: str):
    publisher = get_publisher(db, publisher_id, company_code)

    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")

    if publisher.company_code != company_code:
        raise HTTPException(status_code=403, detail="Access denied")

    db.delete(publisher)
    db.commit()
    return {"detail": "Publisher deleted successfully"}
