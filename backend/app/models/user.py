from pydantic import BaseModel, ConfigDict, EmailStr, model_validator, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    displayName: Optional[str] = None
    picture: Optional[str] = None

    @model_validator(mode="after")
    def set_defaults(self):
        base = self.email.split("@")[0]

        if not self.username:
            self.username = base

        if not self.displayName:
            self.displayName = base.lower()

        return self


class UserCreate(UserBase):
    uid: str
    role: str = "user"
    hasPassword: bool = False
    passwordHash: Optional[str] = None  


class UserResponse(UserBase):
    userId: str
    role: str
    hasPassword: bool
    createdAt: Optional[datetime] = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="ignore"  # ignores passwordHash if present
    )


class DisplayNameUpdate(BaseModel):
    displayName: str = Field(min_length=3, max_length=30, pattern=r"^[a-z0-9_.]+$")


class PasswordUpdate(BaseModel):
    currentPassword: Optional[str] = None
    newPassword: str = Field(min_length=6)
    isReset: bool = False
