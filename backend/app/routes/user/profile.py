from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import auth as firebase_auth
from app.firebase_config import db
from firebase_admin import firestore
from app.dependencies.auth import get_current_user 
from app.dependencies.security import hash_password, verify_password
from app.models.user import DisplayNameUpdate, PasswordUpdate
from app.routes.admin.reserved_names import is_reserved_display_name


router = APIRouter(prefix="/account", tags=["Profile"])


@router.put("/displayname")
def update_display_name( payload: DisplayNameUpdate, user=Depends(get_current_user) ):
    new_name = payload.displayName.lower()

    # Reserved name check
    if is_reserved_display_name(new_name):
        raise HTTPException( status_code=400, detail="Display name already taken" )

    # Uniqueness check
    existing_users = ( db.collection("users").where("displayName", "==", new_name).limit(1).get() )

    if existing_users:
        raise HTTPException( status_code=400, detail="Display name already taken" )

    # Update
    db.collection("users").document(user["uid"]).update({ "displayName": new_name })
    return {"message": "Display name updated successfully"}



@router.put("/password")
def update_or_set_password( payload: PasswordUpdate, user=Depends(get_current_user) ):
    user_ref = db.collection("users").document(user["uid"])
    user_doc = user_ref.get()

    if not user_doc.exists:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_doc.to_dict()

    has_password = user_data.get("hasPassword", False)
    stored_hash = user_data.get("passwordHash")

    # Change password (has password + NOT reset)
    if has_password and not payload.isReset:
        if not payload.currentPassword:
            raise HTTPException( status_code=400, detail="Current password required" )

        if not stored_hash or not verify_password( payload.currentPassword, stored_hash ):
            raise HTTPException( status_code=401, detail="Incorrect current password" )

    # Set password first time OR reset password (Firebase already re-authenticated the user)
    user_ref.update({ "passwordHash": hash_password(payload.newPassword), "hasPassword": True })
    return { "message": "Password updated successfully" }