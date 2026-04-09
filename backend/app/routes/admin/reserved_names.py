from fastapi import APIRouter, Depends, HTTPException
from firebase_admin import firestore
from app.firebase_config import db
from app.dependencies.auth import admin_required

router = APIRouter(prefix="/admin/reserved-names", tags=["Reserved Names"])

DOC_REF = db.collection("reserved_display_names").document("config")


# Helper: get document (auto-create if missing)
def get_reserved_doc():
    doc = DOC_REF.get()
    if not doc.exists:
        DOC_REF.set({
            "reserved_names": [],
            "updatedAt": firestore.SERVER_TIMESTAMP
        })
        return []
    return doc.to_dict().get("reserved_names", [])


# To Check a displayName is reserved or not
def is_reserved_display_name(display_name: str) -> bool:
    doc = DOC_REF.get()
    if not doc.exists:
        return False

    reserved = doc.to_dict().get("reserved_names", [])
    return display_name.lower() in reserved


# List reserved names
@router.get("/")
def list_reserved_names(admin=Depends(admin_required)):
    return {
        "reserved_names": get_reserved_doc()
    }


# Add a reserved name
@router.post("/add")
def add_reserved_name(payload: dict, admin=Depends(admin_required)):
    name = payload.get("displayName")
    if not name:
        raise HTTPException(status_code=400, detail="displayName required")

    name = name.lower().strip()
    names = get_reserved_doc()

    if name in names:
        raise HTTPException(status_code=409, detail="Name already reserved")

    names.append(name)

    DOC_REF.update({
        "reserved_names": names,
        "updatedAt": firestore.SERVER_TIMESTAMP
    })

    return {"message": f"'{name}' added to reserved names"}


# Remove a reserved name
@router.delete("/remove/{display_name}")
def remove_reserved_name(display_name: str, admin=Depends(admin_required)):
    name = display_name.lower().strip()
    names = get_reserved_doc()

    if name not in names:
        raise HTTPException(status_code=404, detail="Name not found")

    names.remove(name)

    DOC_REF.update({
        "reserved_names": names,
        "updatedAt": firestore.SERVER_TIMESTAMP
    })

    return {"message": f"'{name}' removed from reserved names"}
