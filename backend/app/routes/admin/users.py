from fastapi import APIRouter, Depends
from firebase_admin import firestore
from firebase_admin import auth as firebase_auth
from app.dependencies.auth import admin_required
from app.firebase_config import db


router = APIRouter(prefix="/admin/users", tags=["Admin Users"])

# method for creating dummy users by admin
@router.post("/create")
async def create_user(payload: dict, admin=Depends(admin_required)):

    email=payload["email"]
    username = payload.get("username", str(email).split("@")[0])
    displayName = payload.get("displayName", username)
    picture = payload.get("picture", "")

    user = firebase_auth.create_user(
        email=payload["email"],
        password=payload["password"]
    )

    db.collection("users").document(user.uid).set({
        "userId": user.uid,
        "email": email,
        "username": username,
        "displayName": displayName,
        "picture": picture,
        "role": "user",
        "hasPassword": True,
        "createdAt": firestore.SERVER_TIMESTAMP
    })

    return {"message": "User created"}
