# database.py
from __future__ import annotations  # optional: enables modern typing
import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# 1) Load variables from .env (if the file exists in the cwd or its parents)
load_dotenv()

# 2) Read DATABASE_URL from the environment
DATABASE_URL: str | None = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL env var not set. "
        "Create a .env file or `export DATABASE_URL=...` before starting the app."
    )

# 3) Build engine — `future=True` enables the SQLAlchemy-2 style
engine = create_engine(DATABASE_URL, echo=False, future=True)

# 4) Session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)

# 5) Base class for declarative models
Base = declarative_base()

# 6) FastAPI dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
