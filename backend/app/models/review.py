from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ReviewBase(BaseModel):
    bookId: str
    reviewText: Optional[str] = None
    rating: Optional[int] = Field(None, ge=1, le=5)


class ReviewCreate(ReviewBase):
    userId: str


class ReviewResponse(ReviewBase):
    reviewId: str
    userId: str
    createdAt: datetime

    class Config:
        from_attributes = True
