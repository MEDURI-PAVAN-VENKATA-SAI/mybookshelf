from fastapi import APIRouter, Depends
from app.dependencies.auth import admin_required
from app.firebase_config import db


router = APIRouter(prefix="/config", tags=["Config"])


def get_drive_folders():
    doc = db.collection("config").document("folders").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("folders",{})


def get_drive_categories():
    doc = db.collection("config").document("categories").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("categories",{})


def get_config_languages():
    doc = db.collection("config").document("languages").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("languages",{})



@router.get("/categories")
def get_categories():
    return get_drive_categories()


@router.get("/languages")
def get_languages():
    return get_config_languages()


@router.get("/folders")
def get_folders(user=Depends(admin_required)):
    return get_drive_folders()
