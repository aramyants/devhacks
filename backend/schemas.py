
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CompanyBase(BaseModel):
    name: str
    details: Optional[str] = None

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(CompanyBase):
    pass

class Company(CompanyBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
