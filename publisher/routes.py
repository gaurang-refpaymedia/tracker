# publisher/routes.py --


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from . import crud, schemas
from app import database
from app.models import User
from subuser.models import SubUser
from typing import Union
from app import auth

router = APIRouter(prefix="/api/publishers", tags=["Publishers"])

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


@router.post("/", response_model=schemas.PublisherResponse)
def create_publisher(
    publisher: schemas.PublisherCreate,
    db: Session = Depends(get_db),
    current_identity = Depends(auth.get_current_user),
):
    print("*****************")
    return crud.create_publisher(
        db=db,
        publisher=publisher,
        company_code=current_identity.get("company_code", ""),
        created_by=current_identity.get("user_code", ""),
    )


@router.get("/", response_model=List[schemas.PublisherResponse])
def get_publishers(
    db: Session = Depends(get_db),
    current_identity = Depends(auth.get_current_user),
):
    print("*********get publisher********")
    return crud.get_publishers_for_company(db, current_identity.get("company_code", ""))


@router.get("/{publisher_id}", response_model=schemas.PublisherResponse)
def get_publisher_by_id(
    publisher_id: int,
    db: Session = Depends(get_db),
    current_identity = Depends(auth.get_current_user),
):
    publisher = crud.get_publisher(db, publisher_id, current_identity.get("company_code", ""))
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return publisher


@router.put("/{publisher_id}", response_model=schemas.PublisherResponse)
def update_publisher(
    publisher_id: int,
    publisher_update: schemas.PublisherUpdate,
    db: Session = Depends(get_db),
    current_identity = Depends(auth.get_current_user),
):
    publisher = crud.update_publisher(
        db, publisher_id, publisher_update, current_identity.get("company_code", "")
    )
    if not publisher:
        raise HTTPException(status_code=404, detail="Publisher not found")
    return publisher


@router.delete("/{publisher_id}")
def delete_publisher(
    publisher_id: int,
    db: Session = Depends(get_db),
    current_identity = Depends(auth.get_current_user),
):
    success = crud.delete_publisher(db, publisher_id, current_identity.get("company_code", ""))
    if not success:
        raise HTTPException(status_code=404, detail="Publisher not found or already deleted")
    return {"message": "Publisher deleted successfully"}
