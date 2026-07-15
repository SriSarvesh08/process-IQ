import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/test")
    DB_NAME = "test" # Mongoose defaults to "test" if no database is specified in URI
    
    # Alternatively parse DB_NAME from MONGO_URI
    if MONGO_URI.rsplit('/', 1)[-1]:
        parsed_db = MONGO_URI.rsplit('/', 1)[-1].split('?')[0]
        if parsed_db:
            DB_NAME = parsed_db

    POLL_INTERVAL = int(os.getenv("POLL_INTERVAL", 3)) # seconds
