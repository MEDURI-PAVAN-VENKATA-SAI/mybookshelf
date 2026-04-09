from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.routes.auth_login import router as auth_login_router
from app.routes.admin import books, users, reports
from app.routes.user import profile
from app.routes.user.books import router as userbooks_router
from app.routes.config import router as config_router

app = FastAPI(title="MyBookShelf")

API_PREFIX = "/api/v1"

origins = [ origin.strip() for origin in os.getenv("CORS_ORIGINS", "").split(",") if origin.strip() ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Routes
app.include_router(auth_login_router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)
app.include_router(books.router, prefix=API_PREFIX)
app.include_router(reports.router, prefix=API_PREFIX)
app.include_router(userbooks_router, prefix=API_PREFIX)
app.include_router(profile.router, prefix=API_PREFIX)
app.include_router(config_router, prefix=API_PREFIX)

@app.get("/")
def root():
    return {"message": "MyBookShelf Backend is running"}
