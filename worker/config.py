import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/shoppilot_auth")
    DB_NAME = "shoppilot_auth" # We extract the db name from URI or just hardcode if standard
    
    # Alternatively parse DB_NAME from MONGO_URI
    if MONGO_URI.rsplit('/', 1)[-1]:
        DB_NAME = MONGO_URI.rsplit('/', 1)[-1].split('?')[0]

    POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", 3)) # seconds
