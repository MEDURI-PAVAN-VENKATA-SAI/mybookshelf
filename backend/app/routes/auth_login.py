from fastapi import APIRouter, HTTPException, Header
from firebase_admin import auth as firebase_auth
from firebase_admin import firestore
from app.firebase_config import db
from app.dependencies.auth import verify_jwt
import jwt
from datetime import datetime, timedelta, timezone
import os

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", 43200))  # 30 days


# -----------------------------
# JWT Creation
# -----------------------------
def create_access_token(data: dict):
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRATION_MINUTES)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)


# -----------------------------
# Google / Firebase Login
# -----------------------------
@router.post("/auth/google")
async def google_login(payload: dict):
    try:
        google_token = payload.get("token")
        if not google_token:
            raise HTTPException(status_code=400, detail="Missing Google token")

        decoded_token = firebase_auth.verify_id_token(google_token)

        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        username = decoded_token.get("name") or email.split("@")[0]
        picture = decoded_token.get("picture", "")

        if not uid or not email:
            raise HTTPException(status_code=400, detail="Invalid Firebase token")

        user_ref = db.collection("users").document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            # NEW USER
            display_name = email.split("@")[0].lower() or username.lower() or uid.lower() or uid[:30].lower()

            user_ref.set({
                "userId": uid,
                "email": email,
                "username": username,
                "displayName": display_name,
                "picture": picture,
                "role": "user",
                "hasPassword": False,
                "passwordHash": None,
                "createdAt": firestore.SERVER_TIMESTAMP
            })

            role = "user"
            has_password = False

        else:
            # EXISTING USER
            user_data = user_doc.to_dict()

            role = user_data.get("role", "user")
            has_password = user_data.get("hasPassword", False)
            display_name = user_data.get("displayName")

            # update picture if changed
            user_ref.update({
                "picture": picture
            })

        # Backend JWT (USED EVERYWHERE)
        jwt_token = create_access_token({
            "sub": uid,
            "uid": uid,
            "email": email,
            "role": role
        })

        return {
            "access_token": jwt_token,
            "user": {
                "userId": uid,
                "email": email,
                "username": username,
                "displayName": display_name,
                "picture": picture,
                "role": role,
                "hasPassword": has_password
            }
        }

    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(status_code=401, detail="Invalid Firebase token")
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


# -----------------------------
# Session Restore (Reload)
# -----------------------------
@router.get("/auth/session")
async def get_session(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")

    token = authorization.replace("Bearer ", "")
    payload = verify_jwt(token)

    uid = payload.get("uid") or payload.get("sub")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user_doc = db.collection("users").document(uid).get(timeout=10)
    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "user": user_doc.to_dict()
    }
