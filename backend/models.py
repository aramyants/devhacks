# app/models.py  ────────────────────────────────────────────────────────────
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    JSON,
    ForeignKey,
    Enum,
    Numeric,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum

from database import Base   # ← adjust if your Base lives elsewhere

# ── Enums ──────────────────────────────────────────────────────────────────
class UserRole(str, enum.Enum):
    admin = "admin"
    user  = "user"

class OfferingType(str, enum.Enum):
    product = "product"
    service = "service"

# ── Company ───────────────────────────────────────────────────────────────
class Company(Base):
    __tablename__ = "companies"

    id   = Column(Integer, primary_key=True, index=True)

    # Relationships (optional: keep if you need them)
    users     = relationship("User", back_populates="company", cascade="all, delete-orphan", lazy="selectin")
    offerings = relationship("Offering", back_populates="company", cascade="all, delete-orphan", lazy="selectin")
    products  = relationship("Product", back_populates="company", cascade="all, delete-orphan", lazy="selectin")

    # Keep only the required columns
    name        = Column(String(255), nullable=False, index=True)
    details     = Column(Text)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


# ── ChatMessage ────────────────────────────────────────────────────────────
class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id      = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    sender  = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# ── User ───────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    company_id  = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    email         = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role          = Column(
        Enum(UserRole, native_enum=False, name="user_role_enum"),
        nullable=False,
        server_default=UserRole.user.value,
    )
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    company = relationship("Company", back_populates="users")

# ── Product table (stand-alone) ────────────────────────────────────────────
class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name        = Column(String(255), nullable=False, index=True)
    description = Column(Text)
    price       = Column(Numeric(12, 2))
    stock_qty   = Column(Integer, default=0)
    attributes  = Column(JSON)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    company = relationship("Company", back_populates="products", lazy="joined")

# ── Unified “Offering” table (product **or** service) ──────────────────────
class Offering(Base):
    __tablename__ = "offerings"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(
        Integer,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    name = Column(String(255), nullable=False, index=True)
    type = Column(
        Enum(OfferingType, native_enum=False, name="offering_type_enum"),
        nullable=False,
    )
    description = Column(Text)
    price    = Column(Numeric(12, 2))
    currency = Column(String(3))
    attributes = Column(JSON)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    company = relationship("Company", back_populates="offerings", lazy="joined")
