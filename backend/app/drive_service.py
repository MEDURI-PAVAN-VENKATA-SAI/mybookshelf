import os
from fastapi import HTTPException
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from dotenv import load_dotenv
import io
from app.routes.config import get_drive_folders


# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SERVICE_ACCOUNT_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")
DRIVE_SCOPES = os.getenv("DRIVE_SCOPES", "").split(",")

if not SERVICE_ACCOUNT_PATH:
    raise ValueError("FIREBASE_CREDENTIALS_PATH not set")

# Fix for Production (Render) vs Local
if not os.path.isabs(SERVICE_ACCOUNT_PATH):
    SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, SERVICE_ACCOUNT_PATH)

credentials = service_account.Credentials.from_service_account_file( SERVICE_ACCOUNT_PATH, scopes=DRIVE_SCOPES )
drive_service = build("drive", "v3", credentials=credentials)



def normalize( text: str ):
    return ( text.lower().strip().replace(" ", "-").replace("_", "-") )



def build_book_folder_path(category: str, subcategory: str = None):
    return f"books/{category}/{subcategory}" if subcategory else f"books/{category}"



def build_cover_folder_path(category: str):
    return f"covers/{category}"



def get_extension(filename: str):
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""



def drive_file_base_name(title: str, authors_list: list, language: str, category: str, subcategory: str = None, publishedYear = None) -> str:
    title_slug = normalize(title)
    author_slug = normalize(authors_list[0]) if authors_list else "unknown"
    year_str = str(publishedYear) if publishedYear else "na"
    cat = category.lower() if category else "general"
    sub = subcategory.lower() if subcategory else cat
    custom_filename = f"{sub}_{title_slug}_{author_slug}_{year_str}_{language}"
    return custom_filename



def drive_file_name(base_name: str, ext: str = None)-> str:
    ext = ext if ext else "pdf"   # to avoid crash if file is None
    return f"{base_name}.{ext}"



def get_folder_id(path: str) -> str:
    #path example: "books/BUS/CASE" or "books/REL" or "covers/BUS"
    FOLDERS = get_drive_folders()
    node = FOLDERS
    for key in path.split("/"):
        if key not in node:
            raise HTTPException(400, f"Invalid folder path: {path}")
        node = node[key]
    return node



def get_drive_filename(fileId: str) -> str:
    try:
        file = drive_service.files().get( fileId=fileId, fields="name" ).execute() 
        return file["name"]                 # file fullname (filename + extension) as it is in drive
    except Exception as e:
        raise Exception("Getting File Name from the Drive failed")



def upload_to_drive(file, filename: str, folder_key: str):
    try:
        folder_id = get_folder_id(folder_key)
        media = MediaIoBaseUpload(fd=file.file, mimetype=file.content_type, resumable=True )
        drive_file = drive_service.files().create( body={ "name": filename, "parents": [folder_id] }, media_body=media, fields="id" ).execute()
    
        file_id = drive_file["id"]

        return {
            "fileId": file_id,
            "viewUrl": f"https://drive.google.com/uc?id={file_id}",
            "previewUrl": f"https://drive.google.com/file/d/{file_id}/preview",
            "downloadUrl": f"https://drive.google.com/uc?id={file_id}&export=download"
        }
    except Exception as e:
        raise Exception(f"Drive upload failed due to {e}")



def move_and_rename_drive_file(file_id: str, new_folder_key: str, new_name: str = None):
    try:
        new_folder_id = get_folder_id(new_folder_key)
        file = drive_service.files().get( fileId=file_id, fields="parents,name" ).execute()         # get existing parents + current name
        previous_parents = ",".join(file.get("parents", []))
        current_name = file.get("name")
        final_name = new_name if new_name else current_name         # use existing name if new_name not provided

        # move + (optional) rename
        drive_service.files().update(
            fileId=file_id,
            addParents=new_folder_id,
            removeParents=previous_parents,
            body={"name": final_name},
            fields="id, parents, name"
        ).execute()
    except Exception as e:
        raise Exception("Drive Moving file, renaming failed")



def delete_drive_file(file_id: str):
    try:
        drive_service.files().delete(fileId=file_id).execute()
    except Exception as e:
        raise Exception("Drive file deletion failed")