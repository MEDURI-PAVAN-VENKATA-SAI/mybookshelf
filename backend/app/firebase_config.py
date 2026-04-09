import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore, auth

# Load environment variables
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(ENV_PATH)

# Get the Firebase credentials path from environment
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH")

# Make it absolute (safe for local and production)
CRED_PATH = os.path.join(BASE_DIR, FIREBASE_CREDENTIALS_PATH)

# Load Firebase Admin SDK
cred = credentials.Certificate(CRED_PATH)
firebase_admin.initialize_app(cred)

# Firestore database reference
db = firestore.client()
