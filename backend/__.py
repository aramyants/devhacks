
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import companies
import schemas
from database import get_db

router = APIRouter()

@router.get("/messages", response_model=List[schemas.ChatMessage])
def read_messages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    messages = companies.get_chat_messages(db, skip=skip, limit=limit)
    return messages

@router.post("/messages", response_model=schemas.ChatMessage)
def create_message(message: schemas.ChatMessageCreate, db: Session = Depends(get_db)):
    return companies.create_chat_message(db=db, message=message)
