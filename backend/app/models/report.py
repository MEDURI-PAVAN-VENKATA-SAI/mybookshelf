from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ReportBase(BaseModel):
    bookId: str
    reason: str            # e.g. "Copyright", "Inappropriate", "Spam"
    message: Optional[str] = None


class ReportCreate(ReportBase):
    userId: str


class ReportResponse(ReportBase):
    reportId: str
    userId: str
    status: str = "pending"   # pending | reviewed | rejected | resolved
    createdAt: datetime

    class Config:
        from_attributes = True
