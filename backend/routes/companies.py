from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Company
from schemas import Company as CompanySchema, CompanyCreate, CompanyUpdate
from database import get_db

router = APIRouter(tags=["companies"])

@router.get("/", response_model=List[CompanySchema])
def read_companies(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return db.query(Company).offset(skip).limit(limit).all()

@router.get("/{company_id}", response_model=CompanySchema)
def read_company(company_id: int, db: Session = Depends(get_db)):
    db_company = db.get(Company, company_id)
    if db_company is None:
        raise HTTPException(status_code=404, detail="Company not found")
    return db_company

@router.post("/", response_model=CompanySchema, status_code=201)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    obj = Company(**company.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/{company_id}", response_model=CompanySchema)
def update_company(
    company_id: int,
    company: CompanyUpdate,
    db: Session = Depends(get_db),
):
    obj = db.get(Company, company_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Company not found")
    for field, value in company.dict(exclude_unset=True).items():
        setattr(obj, field, value)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/{company_id}", status_code=204)
def delete_company(company_id: int, db: Session = Depends(get_db)):
    obj = db.get(Company, company_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="Company not found")
    db.delete(obj)
    db.commit()
