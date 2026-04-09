from fastapi import Depends, Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt, os


strict_security = HTTPBearer()  # Strict (for protected routes)
optional_security = HTTPBearer(auto_error=False) # Optional (for sendBeacon / fallback)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def get_current_user(token=Depends(strict_security)):
    try:
        payload = jwt.decode( token.credentials, SECRET_KEY, algorithms=[ALGORITHM] )
        if not payload.get("uid"):          # basic required fields
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload  # contains uid, email, role, etc
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    

def admin_required(token=Depends(strict_security)):
    try:
        payload = jwt.decode( token.credentials, SECRET_KEY, algorithms=[ALGORITHM] )
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin only")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


async def optional_user( request: Request, token: HTTPAuthorizationCredentials = Depends(optional_security) ):
    try:
        if token:
            return verify_jwt(token.credentials)
        body = await request.json()
        raw_token = body.get("token")
        if raw_token:
            return verify_jwt(raw_token)
    except Exception:
        return None
    return None


def verify_jwt(token: str):
    try:
        payload = jwt.decode( token, SECRET_KEY, algorithms=[ALGORITHM] )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")