from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    details = Column(Text, nullable=True)
    industry = Column(String(128), nullable=True)
    website = Column(String(255), nullable=True)
    logo = Column(String(255), nullable=True)
    tagline = Column(String(255), nullable=True)
    mission = Column(Text, nullable=True)
    vision = Column(Text, nullable=True)
    values = Column(String(255), nullable=True)
    founded_year = Column(Integer, nullable=True)
    size = Column(String(64), nullable=True)  # e.g. '1-10', '11-50', etc.
    country = Column(String(64), nullable=True)
    city = Column(String(64), nullable=True)
    contact_email = Column(String(255), nullable=True)
    phone = Column(String(64), nullable=True)
    social_links = Column(JSON, nullable=True)  # e.g. {"linkedin": "...", "twitter": "..."}
    extra = Column(JSON, nullable=True)         # for custom fields
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    sender = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
