from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query
from typing import Optional
from firebase_admin import firestore
from google.cloud.firestore_v1 import FieldFilter
import uuid
from app.firebase_config import db
from app.dependencies.auth import get_current_user, optional_user
from app.drive_service import build_book_folder_path, build_cover_folder_path, drive_file_base_name, get_extension, move_and_rename_drive_file, upload_to_drive, drive_file_name
from app.routes.admin.books import delete_book, incrementBookCount


router = APIRouter(prefix="/books", tags=["User Books"])


#---------------------------------------------------Home / General-------------------------------------------------------

# Get All books
@router.get("/")
def get_books( limit: int = Query(20, le=30), cursor: Optional[float] = None, user=Depends(get_current_user) ):
    
    books_ref = (
        db.collection("books")
        .where(filter=FieldFilter("isVisible", "==", True))
        .where(filter=FieldFilter("privacy", "==", "public"))
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    if cursor:
        books_ref = books_ref.start_after({"createdAt": cursor})

    book_docs = list(books_ref.stream())

    if not book_docs:
        return {"books": [], "nextCursor": None}

    fav_docs = db.collection("users").document(user["uid"]).collection("favourites").stream()
    favourite_ids = {doc.id for doc in fav_docs}

    books = []

    for doc in book_docs:
        book_data = doc.to_dict()
        book_data["isFavourite"] = book_data["bookId"] in favourite_ids
        books.append(book_data)

    next_cursor = ( book_docs[-1].to_dict()["createdAt"] if len(book_docs) == limit else None )
    return { "books": books, "nextCursor": next_cursor }



@router.post("/{book_id}/rate")
def rate_book( book_id: str, rating: int = Query(gt=0, le=5), user=Depends(get_current_user) ):
    book_ref = db.collection("books").document(book_id)
    rating_ref = db.collection("users").document(user["uid"]).collection("ratings").document(book_id)
    transaction = db.transaction()

    @firestore.transactional
    def update_rating(transaction):
        book_doc = book_ref.get(transaction=transaction)
        rating_doc = rating_ref.get(transaction=transaction)

        if not book_doc.exists:
            raise HTTPException(status_code=404, detail="Book not found")
        
        book_data = book_doc.to_dict() or {}
        rating_sum = book_data.get("ratingSum", 0)
        rating_count = book_data.get("ratingCount", 0)

        if rating_doc.exists:                                       # Update case
            old_rating = rating_doc.to_dict().get("rating", 0)
            diff = rating - old_rating
            if diff == 0:
                return {"message": "Rating submitted successfully"}
            new_sum = rating_sum + diff
            new_avg = new_sum / rating_count if rating_count > 0 else 0
            transaction.update(rating_ref, { "rating": rating, "createdAt": firestore.SERVER_TIMESTAMP })
            transaction.update(book_ref, { "ratingSum": new_sum, "ratingAvg": new_avg })

        else:                                                       # First time rating
            new_sum = rating_sum + rating
            new_count = rating_count + 1
            new_avg = new_sum / new_count
            transaction.set(rating_ref, { "bookId": book_id, "rating": rating, "createdAt": firestore.SERVER_TIMESTAMP })
            transaction.update(book_ref, { "ratingCount": new_count, "ratingSum": new_sum, "ratingAvg": new_avg })

    update_rating(transaction)
    return {"message": "Rating submitted successfully"}



@router.get("/{book_id}/rating")
def get_user_rating(book_id: str, user=Depends(get_current_user)):
    rating_ref = db.collection("users").document(user["uid"]).collection("ratings").document(book_id)
    rating_doc = rating_ref.get()
    if rating_doc.exists:
        data = rating_doc.to_dict()
        return { "bookId": book_id, "rating": data.get("rating", 0) }
    return { "bookId": book_id, "rating": 0 }



#---------------------------------------------------favourites-------------------------------------------------------


# Get User Favourite books
@router.get("/my-favourites")
def get_favourites(limit: int = Query(20, le=30), cursor: Optional[float] = None, user=Depends(get_current_user)):

    fav_ref = (
        db.collection("users")
        .document(user["uid"])
        .collection("favourites")
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    if cursor:
        fav_ref = fav_ref.start_after({"createdAt": cursor})

    fav_docs = list(fav_ref.stream())

    if not fav_docs:
        return {"books": [], "nextCursor": None}

    book_ids = [doc.to_dict()["bookId"] for doc in fav_docs]
    book_refs = [db.collection("books").document(book_id) for book_id in book_ids]
    book_docs = db.get_all(book_refs)
    book_map = {doc.id: doc.to_dict() for doc in book_docs if doc.exists}

    books = []

    for doc in fav_docs:
        fav_data = doc.to_dict()
        book_id = fav_data["bookId"]
        if book_id in book_map:
            book_data = book_map[book_id]
            if ((book_data.get("privacy") == "public" and book_data.get("isVisible") == True)
                    or (book_data.get("privacy") == "private" and book_data.get("uploaderId") == user["uid"])):
                book_data["isFavourite"] = True
                books.append(book_data)

    next_cursor = ( fav_docs[-1].to_dict()["createdAt"] if len(fav_docs) == limit else None )
    return {"books": books, "nextCursor": next_cursor}



# Add book to favourites
@router.post("/{book_id}/favourite")
def add_to_favourites(book_id: str, user=Depends(get_current_user)):
    fav_ref = ( db.collection("users").document(user["uid"]).collection("favourites").document(book_id) )
    if fav_ref.get().exists:
        return {"message": "Already in favourites"}
    fav_ref.set({ "bookId": book_id, "createdAt": firestore.SERVER_TIMESTAMP })
    return {"message": "Book added to favourites"}



# Remove book from favourites
@router.delete("/{book_id}/favourite")
def remove_from_favourites(book_id: str, user=Depends(get_current_user)):
    fav_ref = ( db.collection("users").document(user["uid"]).collection("favourites").document(book_id) )
    fav_ref.delete()
    return {"message": "Book removed from favourites"}



# is favorite book
@router.get("/{book_id}/is-favourite")
def is_favourite(book_id: str, user=Depends(get_current_user)):
    fav_doc = ( db.collection("users").document(user["uid"]).collection("favourites").document(book_id).get() )
    return {"isFavourite": fav_doc.exists}



#---------------------------------------------------readings-------------------------------------------------------


# Readings progress
@router.get("/my-readings")
def get_readings(limit: int = Query(20, le=30), cursor: Optional[str] = None, user=Depends(get_current_user)):

    ref = (
        db.collection("users")
        .document(user["uid"])
        .collection("readings")
        .order_by("lastReadAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    if cursor:
        last_doc = ( db.collection("users").document(user["uid"]).collection("readings").document(cursor).get() )
        ref = ref.start_after(last_doc)

    reading_snapshots = list(ref.stream())

    if not reading_snapshots:
        return {"books": [], "nextCursor": None}

    reading_docs = [doc.to_dict() for doc in reading_snapshots]
    book_ids = [r["bookId"] for r in reading_docs]
    book_refs = [db.collection("books").document(book_id) for book_id in book_ids]
    book_docs = db.get_all(book_refs)
    book_map = {doc.id: doc.to_dict() for doc in book_docs if doc.exists}

    fav_docs = ( db.collection("users").document(user["uid"]).collection("favourites").stream())
    favourite_ids = {doc.id for doc in fav_docs}

    books = []

    for r in reading_docs:
        book_id = r["bookId"]
        if book_id in book_map:
            book_data = book_map[book_id]
            if ((book_data.get("privacy") == "public" and book_data.get("isVisible") == True)
                    or (book_data.get("privacy") == "private" and book_data.get("uploaderId") == user["uid"])):
                books.append({ **book_data, "isFavourite": book_id in favourite_ids, "readingStatus": r })

    next_cursor = ( reading_snapshots[-1].id if len(reading_snapshots) == limit else None )
    return {"books": books, "nextCursor": next_cursor}



# Add book  to Readings / start reading a book for the first time
@router.post("/{book_id}/reading/start")
def start_reading(book_id: str, data: dict, user=Depends(get_current_user)):

    total_pages = data.get("totalPages")

    ref = ( db.collection("users").document(user["uid"]).collection("readings").document(book_id) )
    doc = ref.get()

    if doc.exists:
        return {"message": "Already exists"}  # avoid overwrite
    
    if not total_pages:
        book_doc = db.collection("books").document(book_id).get()
        if not book_doc.exists:
            return {"message": f"{book_id} book not found"}
        total_pages = book_doc.to_dict().get("totalPages", 0)

    ref.set({
        "bookId": book_id,
        "currentPage": 1,
        "totalPages": total_pages,
        "status": "reading",
        "repetitionCount": 0,                       # repetitionCount = number of times user completed the book 
        "startedAt": firestore.SERVER_TIMESTAMP,
        "lastReadAt": firestore.SERVER_TIMESTAMP,
        "completedAt": None
    })

    return {"message": "Reading started"}



# Re-read a book
@router.post("/{book_id}/reading/reread")
def reread(book_id: str, user=Depends(get_current_user)):

    ref = ( db.collection("users").document(user["uid"]).collection("readings").document(book_id) )

    doc = ref.get()
    if not doc.exists:
        return start_reading(book_id=book_id, data={}, user=user )          # Start reading first time

    existing = doc.to_dict()
    repetition = existing.get("repetitionCount", 0)

    ref.set({
        "currentPage": 0,
        "status": "reading",
        "repetitionCount": repetition + 1,
        "startedAt": firestore.SERVER_TIMESTAMP,
        "lastReadAt": firestore.SERVER_TIMESTAMP,
        "completedAt": None
    }, merge=True)

    return {"message": "Re-read started"}



# Update book to Readings
@router.post("/{book_id}/reading/update")
def update_reading(book_id: str, data: dict, user=Depends(optional_user)):
    current_page = data.get("currentPage", 0)
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")

    ref = ( db.collection("users").document(user["uid"]).collection("readings").document(book_id) )
    doc = ref.get()
    if not doc.exists:
        return start_reading(book_id=book_id, data={}, user=user )          # Start reading first time

    existing = doc.to_dict()
    total_pages = existing.get("totalPages", 0)
    prev_page = existing.get("currentPage", 0)

    # skip small / backward updates
    if current_page <= prev_page:
        return {"message": "Ignored"}

    if abs(current_page - prev_page) < 2:
        return {"message": "Skipped minor update"}

    update = {
        "currentPage": current_page,
        "lastReadAt": firestore.SERVER_TIMESTAMP
    }

    # completed
    if current_page >= total_pages:
        update["status"] = "completed"
        update["completedAt"] = firestore.SERVER_TIMESTAMP
    else:
        update["status"] = "reading"

    ref.set(update, merge=True)
    return {"message": "Progress updated"}



# Get reading status of a book
@router.get("/{book_id}/reading/status")
def get_reading_status(book_id: str, user=Depends(get_current_user)):
    ref = ( db.collection("users").document(user["uid"]).collection("readings").document(book_id) )
    doc = ref.get()
    if not doc.exists:
        return {"readingStatus": None}
    return {"readingStatus": doc.to_dict()}



# Remove book from Readings
@router.delete("/{book_id}/reading")
def remove_from_readings(book_id: str, user=Depends(get_current_user)):
    readings_ref = ( db.collection("users").document(user["uid"]).collection("readings").document(book_id) )
    readings_ref.delete()
    return {"message": "Book removed from readings"}



#---------------------------------------------------uploads-------------------------------------------------------


# User uploaded books
@router.get("/my-uploads")
def get_uploads(limit: int = Query(20, le=30), cursor: Optional[float] = None, user=Depends(get_current_user)):

    uploads_ref = (
        db.collection("users")
        .document(user["uid"])
        .collection("uploads")
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    if cursor:
        uploads_ref = uploads_ref.start_after({"createdAt": cursor})

    uploaded_docs = list(uploads_ref.stream())

    if not uploaded_docs:
        return {"books": [], "nextCursor": None}

    fav_docs = db.collection("users").document(user["uid"]).collection("favourites").stream()
    favourite_ids = {doc.id for doc in fav_docs}

    book_ids = [doc.to_dict()["bookId"] for doc in uploaded_docs]
    book_refs = [db.collection("books").document(book_id) for book_id in book_ids]
    book_docs = db.get_all(book_refs)
    book_map = {doc.id: doc.to_dict() for doc in book_docs if doc.exists}

    books = []

    for doc in uploaded_docs:
        uploaded_data = doc.to_dict()
        book_id = uploaded_data["bookId"]
        if book_id in book_map:
            book_data = book_map[book_id]
            book_data["isFavourite"] = book_id in favourite_ids
            book_data["uploadStatus"] = uploaded_data
            books.append(book_data)
        else:
            # Book deleted but upload exists (admin removed case)
            books.append({
                "bookId": book_id,
                "title": uploaded_data.get("title", "Unknown"),
                "authors": uploaded_data.get("authors", []),
                "isFavourite": False,
                "uploadStatus": uploaded_data
            })

    next_cursor = ( uploaded_docs[-1].to_dict()["createdAt"] if len(uploaded_docs) == limit else None )
    return {"books": books, "nextCursor": next_cursor}



# Add book to uploads
@router.post("/upload")
async def upload_book(
    file: UploadFile = File(...),
    cover: UploadFile = File(...),
    title: str = Form(...),
    ISBN: str = Form(""),
    description: str = Form(""),
    authors: str = Form(""),
    category: str = Form(...),
    subcategory: str = Form(""),
    language: str = Form("en"),
    publisher: str = Form(""),
    publishedYear: Optional[int] = Form(None),
    totalPages: Optional[int] = Form(None),
    privacy: str = Form("public"),
    user=Depends(get_current_user)
):
    MAX_FILE_SIZE = 100 * 1024 * 1024  # 100MB
    MAX_COVER_SIZE = 2 * 1024 * 1024  # 2MB
    if file.size > MAX_FILE_SIZE:
        return {"message": "book file size is too large"}
    if cover.size > MAX_COVER_SIZE:
        return {"message": "cover file size is too large"}
    
    book_id = str(uuid.uuid4())
    authors_list = [a.strip() for a in authors.split(",") if a.strip()]

    # file extensions
    book_ext = get_extension(filename=file.filename)
    cover_ext = get_extension(filename=cover.filename)

    file_base_name = drive_file_base_name( category=category, subcategory=subcategory, title=title, authors_list=authors_list,
                                          publishedYear=publishedYear, language=language )
    # filenames
    drivefilename = drive_file_name(base_name=file_base_name, ext=book_ext)
    drivecovername = drive_file_name(base_name=file_base_name, ext=cover_ext)

    # Decide Drive folder + status based on user type and Book privacy type
    
    if user["role"] == "admin":                                         # Admin upload → directly live
        book_folder = build_book_folder_path(category=category, subcategory=subcategory)
        cover_folder = build_cover_folder_path(category=category)
        status = "published"
        is_visible = True
        privacy = "public"
        reason = ""

    elif privacy == "private":                                          # Private user upload → only visible to uploader
        book_folder = "books/PRIVATE"
        cover_folder = "covers/PRIVATE"
        status = "published"
        is_visible = False
        reason = "only visible for you"

    else:                                                               # Public user upload → needs approval
        book_folder = "books/PENDING"
        cover_folder = "covers/PENDING"
        status = "pending"
        is_visible = False
        privacy = "public"
        reason = "under review"

    # Reset file pointers
    file.file.seek(0)
    cover.file.seek(0)

    # Upload to Drive
    try:
        book_drive = upload_to_drive( file=file, filename=drivefilename, folder_key=book_folder )
        cover_drive = upload_to_drive( file=cover, filename=drivecovername, folder_key=cover_folder )
    except Exception as e:
        print(e)
        return {"message" : "upload failed"}
    #book_drive = { "fileId": "book1", "downloadUrl": "download", "previewUrl": "preview", "viewUrl": "view" }
    #cover_drive = { "fileId": "cover1", "downloadUrl": "download", "previewUrl": "preview", "viewUrl": "https://www.google.com/imgres?q=online%20images&imgurl=https%3A%2F%2Fimg.freepik.com%2Ffree-photo%2Fshowing-cart-trolley-shopping-online-sign-graphic_53876-133967.jpg%3Fsemt%3Dais_incoming%26w%3D740%26q%3D80&imgrefurl=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fonline-store&docid=JmtzRDl1FuV7vM&tbnid=7_FibInW-pT_3M&vet=12ahUKEwiQpYy0gNeTAxXUTGwGHWAzJ-QQnPAOegQIGhAB..i&w=740&h=494&hcb=2&ved=2ahUKEwiQpYy0gNeTAxXUTGwGHWAzJ-QQnPAOegQIGhAB" }

    # keywords
    keywords = list(set( title.lower().split() + [a.lower() for a in authors_list] + [category.lower()] + ([subcategory.lower()] if subcategory else [])))
    categories_arr = [category] if not subcategory else [category, subcategory]         # categories array (clean)

    book_doc = {
        "bookId": book_id,
        "ISBN": ISBN,
        "title": title,
        "description": description,
        "authors": authors_list,
        "publisher": publisher,
        "publishedYear": publishedYear,
        "categories": categories_arr,
        "language": language,
        "totalPages": totalPages,
        "coverUrl": cover_drive["viewUrl"],
        "coverDriveFileId": cover_drive["fileId"],
        "previewUrl": book_drive["previewUrl"],
        "downloadUrl": book_drive["downloadUrl"],
        "driveFileId": book_drive["fileId"],
        "bookExt": book_ext,
        "coverExt": cover_ext,
        "bookFileType": file.content_type,
        "coverFileType": cover.content_type,
        "ratingCount": 0,
        "ratingSum": 0,
        "ratingAvg": 0,
        "readingCount": 0,
        "addedBy": user["role"],
        "uploaderId": user["uid"],
        "privacy": privacy,
        "createdAt": firestore.SERVER_TIMESTAMP,
        "searchKeywords": keywords,
        "isVisible": is_visible
    }

    db.collection("books").document(book_id).set(book_doc)

    # increment count (only valid cases)
    if user["role"] == "admin" and privacy == "public":
        incrementBookCount( category=category, subcategory=subcategory, language=language, incValue=1 )

    # upload doc () statu : published | pending | rejected | removed )
    upload_doc = { "bookId": book_id, "status": status, "reason": reason, "createdAt": firestore.SERVER_TIMESTAMP }
    db.collection("users").document(user["uid"]).collection("uploads").document(book_id).set(upload_doc)

    bookdoc = db.collection("books").document(book_id).get().to_dict()
    uploaddoc = db.collection("users").document(user["uid"]).collection("uploads").document(book_id).get().to_dict()
    
    return { "book": { **bookdoc, "uploadStatus": uploaddoc }, "message": "uploaded" }



# Remove book from uploads
@router.delete("/{book_id}/upload")
def remove_from_uploads(book_id: str, user=Depends(get_current_user)):
    book_ref = db.collection("books").document(book_id)
    snap = book_ref.get()

    if snap.exists:
        delete_book(book_id=book_id, reason="", user=user)

    upload_ref = ( db.collection("users").document(user["uid"]).collection("uploads").document(book_id) )
    upload_snap = upload_ref.get()
    if upload_snap.exists:
        upload_ref.delete()

    return {"message": "Book removed from uploads"}



@router.put("/{book_id}/edit")
def edit_book(book_id: str, data: dict, user=Depends(get_current_user)):

    book_ref = db.collection("books").document(book_id)
    snap = book_ref.get()

    if not snap.exists:
        raise HTTPException(404, "Book not found")

    book = snap.to_dict()

    # permission
    if book["uploaderId"] != user["uid"]:
        raise HTTPException(403, "Not allowed")

    edited = data.get("editedBook", {})
    new_privacy = edited.get("privacy", book.get("privacy"))

    upload_ref = db.collection("users").document(user["uid"]).collection("uploads").document(book_id)

    # CASE 1: PUBLIC → PRIVATE (NO APPROVAL)
    if book["privacy"] == "public" and new_privacy == "private":

        # update main book
        book_ref.update({ **{k: v for k, v in edited.items() if k != "privacy"}, "privacy": "private", "isVisible": False })

        # move to PRIVATE folder
        move_and_rename_drive_file( file_id=book["driveFileId"], new_folder_key=build_book_folder_path(category="PRIVATE") )
        move_and_rename_drive_file( file_id=book["coverDriveFileId"], new_folder_key=build_cover_folder_path(category="PRIVATE") )

        # Dicrement category, language count of public books in config
        categories = book.get("categories", [])
        category = categories[0] if len(categories) > 0 else None
        subcategory = categories[1] if len(categories) > 1 else None
        incrementBookCount( category=category, subcategory=subcategory, language=book.get("language"), incValue= -1 )

        upload_ref.update({ "status": "published", "reason": "Changed to private" })
        return {"success": True, "requiresApproval": False}

    # CASE 2: NEED APPROVAL (public edit OR private → public)
    requires_approval = ((book["privacy"] == "public") or (book["privacy"] == "private" and new_privacy == "public"))

    if requires_approval:
        upload_ref.set({
            "bookId": book_id,
            "status": "pending_edit",
            "editType": "private_to_public" if book["privacy"] == "private" else "metadata",
            "editData": edited,
            "reason": "Changes under review",
            "createdAt": firestore.SERVER_TIMESTAMP
        }, merge=True)
        return {"success": True, "requiresApproval": True}

    # CASE 3: PRIVATE EDIT (NO APPROVAL)
    update_data = {}
    allowed_fields = [ "ISBN", "title", "authors", "description", "publisher", "publishedYear" ]

    for key in allowed_fields:
        if key in edited:
            update_data[key] = edited[key]

    update_data["isVisible"] = False  # private always hidden
    book_ref.update(update_data)
    upload_ref.update({ "status": "published", "reason": "Updated successfully" })
    return {"success": True, "requiresApproval": False}