from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class BookBase(BaseModel):
    title: str
    description: str
    authors: str
    categories: List[str]
    language: str
    pageCount: int


class BookCreate(BookBase):
    coverUrl: Optional[str] = None
    previewUrl: str
    driveFileId: str
    fileType: str
    addedBy: str


class BookResponse(BookBase):
    bookId: str
    coverUrl: Optional[str]
    ratingCount: int
    ratingSum: int
    createdAt: Optional[datetime] = None
