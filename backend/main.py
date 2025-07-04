from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.companies import router as companies_router
from database import engine
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Company Admin API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ToDo: secure origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(companies_router, prefix="/api/companies")
