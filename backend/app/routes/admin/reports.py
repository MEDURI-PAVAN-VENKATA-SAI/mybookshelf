from fastapi import APIRouter, Depends, Query
from app.firebase_config import db
from firebase_admin import firestore
from google.cloud.firestore_v1 import FieldFilter
from typing import Optional
from app.dependencies.auth import admin_required, get_current_user


router = APIRouter(prefix="/reports", tags=["Admin Reports"])


# common method for getting reports
def get_reports(reports_ref, user, limit: int = Query(20, le=30), cursor: Optional[float] = None ):
    
    if cursor:
        reports_ref = reports_ref.start_after({"createdAt": cursor})

    report_snapshots = list(reports_ref.stream())

    if not report_snapshots:
        return {"books": [], "nextCursor": None}

    report_docs = [doc.to_dict() for doc in report_snapshots]

    book_ids = [r["targetId"] for r in report_docs]
    book_refs = [db.collection("books").document(book_id) for book_id in book_ids]
    book_docs = db.get_all(book_refs)
    book_map = {doc.id: doc.to_dict() for doc in book_docs if doc.exists}

    fav_docs = ( db.collection("users").document(user["uid"]).collection("favourites").stream() )
    favourite_ids = {doc.id for doc in fav_docs}

    books = []

    for r in report_docs:
        book_id = r["targetId"]
        if book_id in book_map:
            book_data = book_map[book_id]
            if book_data.get("isVisible", True):
                books.append({ **book_data, "isFavourite": book_id in favourite_ids, "reportStatus": r })

    next_cursor = ( report_snapshots[-1].to_dict()["createdAt"] if len(report_snapshots) == limit else None )
    return {"books": books, "nextCursor": next_cursor}



@router.post("/")
async def create_report(data: dict, current_user=Depends(get_current_user)):

    report_ref = db.collection("reports").document()

    report_data = {
        "reportId": report_ref.id,
        "reporterId": current_user["uid"],
        "targetId": data["targetId"],
        "issues": data["issues"],
        "details": data.get("details", ""),
        "status": "pending",
        "reason": "",              # this field updated by admin
        "createdAt": firestore.SERVER_TIMESTAMP
    }

    report_ref.set(report_data)
    report = report_ref.get().to_dict()
    return { "message": "Reported", "report": report }



@router.get("/my")
def get_my_reports( limit: int = Query(20, le=30), cursor: Optional[float] = None, user=Depends(get_current_user) ):

    reports_ref = (
        db.collection("reports")
        .where(filter=FieldFilter("reporterId", "==", user["uid"]))
        .order_by("createdAt", direction=firestore.Query.DESCENDING)
        .limit(limit)
    )

    return get_reports(reports_ref=reports_ref, limit=limit, cursor= cursor, user=user)



@router.delete("/{report_id}")
async def delete_report(report_id: str, current_user=Depends(get_current_user)):

    doc_ref = db.collection("reports").document(report_id)
    doc = doc_ref.get()

    if not doc.exists:
        return {"message": "Report not found"}

    if doc.to_dict()["reporterId"] != current_user["uid"] and current_user["role"] != "admin" :
        return {"message": "Not allowed"}

    doc_ref.delete()
    return {"message": "Report deleted"}



@router.get("/admin")
def get_all_reports( limit: int = Query(20, le=30), cursor: Optional[float] = None, admin=Depends(admin_required) ):
    reports_ref = ( db.collection("reports").order_by("createdAt", direction=firestore.Query.DESCENDING).limit(limit) )
    return get_reports(reports_ref=reports_ref, limit=limit, cursor= cursor, user=admin)



@router.put("/admin/{report_id}")
async def update_report_status( report_id: str, data: dict, admin=Depends(admin_required) ):
    doc_ref = db.collection("reports").document(report_id)

    if not doc_ref.get().exists:
        return {"message": "Report not found"}

    doc_ref.update({ "status": data["status"], "reason": data["reason"] })
    return {"message": "Report updated"}