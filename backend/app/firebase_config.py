import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

# Get the Firebase credentials path from environment
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")

if not FIREBASE_CREDENTIALS_PATH:
    raise ValueError("FIREBASE_CREDENTIALS_PATH not set")

CRED_PATH = FIREBASE_CREDENTIALS_PATH

# Fix for Production(Render) vs Local
if not os.path.isabs(CRED_PATH):
    CRED_PATH = os.path.join(BASE_DIR, CRED_PATH)

# Load Firebase Admin SDK
cred = credentials.Certificate(CRED_PATH)
firebase_admin.initialize_app(cred)

# Firestore database reference
db = firestore.client()