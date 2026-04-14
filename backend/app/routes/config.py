from fastapi import APIRouter, Depends
from app.dependencies.auth import admin_required
from app.firebase_config import db

router = APIRouter(prefix="/config", tags=["Config"])

# =========================
# GLOBAL CACHE
# =========================
CATEGORIES_CACHE = None
LANGUAGES_CACHE = None
FOLDERS_CACHE = None


# ================================
# GET FUNCTIONS for CONFIG from DB
# ================================
def fetch_categories_from_db():
    doc = db.collection("config").document("categories").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("categories", {})


def fetch_languages_from_db():
    doc = db.collection("config").document("languages").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("languages", {})


def fetch_folders_from_db():
    doc = db.collection("config").document("folders").get()
    if not doc.exists:
        return {}
    return doc.to_dict().get("folders", {})


# =========================================
# GET + Update FUNCTIONS for CONFIG from DB
# =========================================
def get_drive_categories():
    global CATEGORIES_CACHE
    if CATEGORIES_CACHE is None:
        CATEGORIES_CACHE = fetch_categories_from_db()
    return CATEGORIES_CACHE


def get_config_languages():
    global LANGUAGES_CACHE
    if LANGUAGES_CACHE is None:
        LANGUAGES_CACHE = fetch_languages_from_db()
    return LANGUAGES_CACHE


def get_drive_folders():
    global FOLDERS_CACHE
    if FOLDERS_CACHE is None:
        FOLDERS_CACHE = fetch_folders_from_db()
    return FOLDERS_CACHE


# ========================
# MANUAL INVALIDATION APIs
# ========================
def refresh_categories_cache():
    global CATEGORIES_CACHE
    CATEGORIES_CACHE = fetch_categories_from_db()


def refresh_languages_cache():
    global LANGUAGES_CACHE
    LANGUAGES_CACHE = fetch_languages_from_db()


def refresh_folders_cache():
    global FOLDERS_CACHE
    FOLDERS_CACHE = fetch_folders_from_db()


# ========================
# ROUTES (GET)
# ========================
@router.get("/categories")
def get_categories():
    return get_drive_categories()


@router.get("/languages")
def get_languages():
    return get_config_languages()


@router.get("/folders")
def get_folders(user=Depends(admin_required)):
    return get_drive_folders()


@router.post("/refresh/categories")
def refresh_categories(admin=Depends(admin_required)):
    refresh_categories_cache()


@router.post("/refresh/languages")
def refresh_languages(admin=Depends(admin_required)):
    refresh_languages_cache()


@router.post("/refresh/folders")
def refresh_folders(admin=Depends(admin_required)):
    refresh_folders_cache()
