from pydantic import BaseModel

class CompanyCreate(BaseModel):
    name: str
    code: str
    subscription_code: str

class UserLogin(BaseModel):
    email: str
    password: str
