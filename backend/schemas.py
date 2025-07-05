from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Dict, Any

class CompanyBase(BaseModel):
    name: str
    details: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    logo: Optional[str] = None
    tagline: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    values: Optional[str] = None
    founded_year: Optional[int] = None
    size: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    social_links: Optional[Dict[str, str]] = None
    extra: Optional[Dict[str, Any]] = None

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

class ChatMessageBase(BaseModel):
    message: str
    sender: str

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessage(ChatMessageBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
