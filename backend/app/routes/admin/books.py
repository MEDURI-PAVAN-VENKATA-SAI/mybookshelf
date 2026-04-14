from fastapi import APIRouter, Depends
from firebase_admin import auth as firebase_auth
from firebase_admin import firestore
from google.cloud.firestore_v1 import FieldFilter
from app.dependencies.auth import admin_required, get_current_user
from app.firebase_config import db
from app.routes.config import refresh_languages_cache, refresh_categories_cache
from app.drive_service import build_book_folder_path, build_cover_folder_path, drive_file_base_name, get_drive_filename, get_extension, move_and_rename_drive_file, drive_file_name, delete_drive_file


router = APIRouter(prefix="/admin/books", tags=["Admin Books"])



def incrementBookCount(category: str, subcategory: str = None, language: str = None, incValue: int =0):
    cat_ref = db.collection("config").document("categories")
    lang_ref = db.collection("config").document("languages")
    updates = { f"categories.{category}.bookCount": firestore.Increment(incValue), "updatedAt": firestore.SERVER_TIMESTAMP }
    if subcategory:             # only update subcategory if exists
        updates[f"categories.{category}.subcategories.{subcategory}.bookCount"] = firestore.Increment(incValue)
    cat_ref.update(updates)
    refresh_categories_cache()
    if language:
        lang_ref.update({ f"languages.{language}.bookCount": firestore.Increment(incValue), "updatedAt": firestore.SERVER_TIMESTAMP })
        refresh_languages_cache()


# approve book uploaded by user
@router.post("/{book_id}/approve")
def approve_book(book_id: str, data: dict, admin=Depends(admin_required)):

    edited_book = data.get("editedBook", {})
    reason = data.get("reason", "")

    book_ref = db.collection("books").document(book_id)
    snap = book_ref.get()

    if not snap.exists:
        return {"message": f"{book_id} book not found"}

    book = snap.to_dict()

    categories = book.get("categories", [])
    category = categories[0] if len(categories) > 0 else None
    subcategory = categories[1] if len(categories) > 1 else None

    # Final values (fallback to old if not edited)
    final_category = edited_book.get("category") or category
    if not final_category:
        return { "message": "Category required" }
    final_subcategory = edited_book.get("subcategory") or subcategory
    final_language = edited_book.get("language") or book.get("language")
    final_title = edited_book.get("title", book["title"])
    final_authors = edited_book.get("authors", book["authors"])
    final_publishedYear = edited_book.get("publishedYear", book.get("publishedYear"))

    # Drive folders
    book_folder = build_book_folder_path(category=final_category, subcategory=final_subcategory)
    cover_folder = build_cover_folder_path(category=final_category)

    # Rebuild filenames
    file_base_name = drive_file_base_name(
        category=final_category,
        subcategory=final_subcategory,
        title=final_title,
        authors_list=final_authors,
        publishedYear=final_publishedYear,
        language=final_language
    )
    book_ext= book.get("bookExt") if book.get("bookExt") else get_extension(filename=get_drive_filename(book["driveFileId"]))
    cover_ext = book.get("coverExt") if book.get("coverExt") else get_extension(filename=get_drive_filename(book["coverDriveFileId"]))

    book_filename = drive_file_name(base_name=file_base_name, ext=book_ext)
    cover_filename = drive_file_name(base_name=file_base_name, ext=cover_ext)

    # Move + Rename
    move_and_rename_drive_file( file_id=book["driveFileId"], new_folder_key=book_folder, new_name=book_filename )
    move_and_rename_drive_file( file_id=book["coverDriveFileId"], new_folder_key=cover_folder, new_name=cover_filename )

    update_data = { "categories": [final_category, final_subcategory], "language": final_language, "isVisible": True }

    # Merge all editable fields (except restricted ones)
    restricted_fields = { "bookId", "driveFileId", "coverDriveFileId", "uploaderId", "createdAt", "ratingCount", "ratingSum", "ratingAvg" }

    for key, value in edited_book.items():
        if key not in restricted_fields:
            update_data[key] = value

    # regenerate searchKeywords if important fields changed
    authors_list = update_data.get("authors", book["authors"])
    title = update_data.get("title", book["title"])

    update_data["searchKeywords"] = list(set(
        title.lower().split() +
        [a.lower() for a in authors_list] +
        [final_category.lower()] +
        ([final_subcategory.lower()] if final_subcategory else [])
    ))

    book_ref.update(update_data)

    # Update counts (only public)
    if not book.get("isVisible") and book.get("privacy") == "public":
        incrementBookCount( category=final_category, subcategory=final_subcategory, language=final_language, incValue=1 )

    # Update uploads
    db.collection("users").document(book["uploaderId"]).collection("uploads").document(book_id).update({"status": "published", "reason": reason})
    return {"message": f"{title} approved"}



@router.post("/batch-approve")
def batch_approve( data: dict, admin=Depends(admin_required) ):
    items = data.get("items", [])       # items = [{ bookId, category?, subcategory? }]
    for item in items:
        approve_book( book_id=item["bookId"], data={}, admin=admin )
    return {"message": "approved all books"}



@router.post("/{book_id}/reject")
def reject_book( book_id: str, reason: str, delete_files: bool = False, admin=Depends(admin_required) ):
    book_ref = db.collection("books").document(book_id)
    snap = book_ref.get()

    if not snap.exists:
        return {"message": f"{book_id} book not found"}

    book = snap.to_dict()

    if delete_files:
        delete_drive_file(book["driveFileId"])
        delete_drive_file(book["coverDriveFileId"])

    book_ref.update({"isVisible": False})
    db.collection("users").document(book["uploaderId"]).collection("uploads").document(book_id).update({"status": "rejected", "reason": reason})
    return {"message": f"{book.get('title', '')} rejected"}



@router.delete("/{book_id}/delete")
def delete_book(book_id: str, reason: str = "", user=Depends(get_current_user)):

    book_ref = db.collection("books").document(book_id)
    snap = book_ref.get()

    if not snap.exists:
        return {"message": f"{book_id} book not found"}

    book = snap.to_dict()

    # Permission check
    if user["role"] != "admin" and book["uploaderId"] != user["uid"]:
        return {"message": "You are not permitted to delete."}

    category, subcategory = book.get("categories", [None, None])
    language = book.get("language")

    # Delete Drive files
    try:
        delete_drive_file(book["driveFileId"])
        if "coverDriveFileId" in book:
            delete_drive_file(book["coverDriveFileId"])
    except:
        pass  # safe fail

    # Delete from uploader uploads if deleted by uploader or update reason as unavailable in uploads status
    if book["uploaderId"] == user["uid"]:
        db.collection("users").document(book["uploaderId"]).collection("uploads").document(book_id).delete()
    else:
        db.collection("users").document(book["uploaderId"]).collection("uploads").document(book_id).update({
            "title": book.get("title"),
            "authors": book.get("authors"),
            "status": "removed", 
            "reason": reason.strip() if reason.strip() else "This book was removed by MyBookShelf",
            "removedAt": firestore.SERVER_TIMESTAMP
        })

    # Update reports
    report_reason = reason.strip() or "book deleted"
    reports = db.collection("reports").where(filter=FieldFilter("targetId", "==", book_id)).stream()
    batch = db.batch()
    count = 0

    for r in reports:
        report_data = r.to_dict()
        status = report_data.get("status", "")

        if status not in ["resolved", "rejected"]:          # update only if NOT already resolved/rejected
            batch.update(r.reference, {"title":book.get("title"), "authors":book.get("authors"), "status":"resolved", "reason": report_reason})
            count += 1

            # Firestore batch limit = 500 operations
            if count == 500:
                batch.commit()
                batch = db.batch()
                count = 0

    if count > 0:           # Commit remaining report updates
        batch.commit()

    # Update category/subcategory/language counts ONLY if it was visible (public)
    if book.get("privacy")=="public" and book.get("isVisible", False):
        incrementBookCount( category=category, subcategory=subcategory, language=language, incValue = -1 )

    book_ref.delete()
    return {"message": f"{book.get('title', '')} deleted"}



@router.get("/pending")
def get_pending_books(admin=Depends(admin_required)):
    docs = (db.collection("books").where(filter=FieldFilter("isVisible","==",False)).where(filter=FieldFilter("privacy","==","public")).stream())
    return [d.to_dict() for d in docs]
