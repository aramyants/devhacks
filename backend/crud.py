
from sqlalchemy.orm import Session
from models import Company
from schemas import CompanyCreate, CompanyUpdate
from typing import List, Optional

def get_companies(db: Session, skip: int = 0, limit: int = 100) -> List[Company]:
    return db.query(Company).offset(skip).limit(limit).all()

def get_company(db: Session, company_id: int) -> Optional[Company]:
    return db.query(Company).filter(Company.id == company_id).first()

def create_company(db: Session, company: CompanyCreate) -> Company:
    db_company = Company(name=company.name, details=company.details)
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    return db_company

def update_company(db: Session, company_id: int, company: CompanyUpdate) -> Optional[Company]:
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if db_company:
        db_company.name = company.name
        db_company.details = company.details
        db.commit()
        db.refresh(db_company)
    return db_company

def delete_company(db: Session, company_id: int) -> bool:
    db_company = db.query(Company).filter(Company.id == company_id).first()
    if db_company:
        db.delete(db_company)
        db.commit()
        return True
    return False
