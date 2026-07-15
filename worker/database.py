from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from config import Config

class Database:
    def __init__(self):
        self.client = MongoClient(Config.MONGO_URI)
        self.db = self.client[Config.DB_NAME]
        self.tasks_collection = self.db['tasks']
        print(f"Connected to MongoDB: {Config.MONGO_URI}")

    def get_pending_task(self):
        """Find the oldest Pending task and atomically update to Processing"""
        task = self.tasks_collection.find_one_and_update(
            {"status": "Pending"},
            {
                "$set": {
                    "status": "Processing",
                    "updatedAt": datetime.utcnow()
                }
            },
            sort=[("createdAt", 1)],
            return_document=True
        )
        return task

    def mark_completed(self, task_id, result):
        """Update task to Completed and store result"""
        self.tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "Completed",
                    "result": result,
                    "updatedAt": datetime.utcnow()
                }
            }
        )

    def mark_failed(self, task_id, error_message):
        """Update task to Failed and store error"""
        self.tasks_collection.update_one(
            {"_id": ObjectId(task_id)},
            {
                "$set": {
                    "status": "Failed",
                    "error": str(error_message),
                    "updatedAt": datetime.utcnow()
                }
            }
        )
