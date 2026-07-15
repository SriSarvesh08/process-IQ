import time
import sys
import traceback
from config import Config
from database import Database
from processor import process_task

def main():
    print("Starting AI Task Processing Worker...")
    try:
        db = Database()
    except Exception as e:
        print(f"Failed to connect to database: {e}")
        sys.exit(1)

    print("Worker is polling for tasks...")

    while True:
        try:
            # Poll for task
            task = db.get_pending_task()
            
            if task:
                task_id = task.get('_id')
                operation = task.get('operation')
                input_data = task.get('inputData')
                
                print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Picked up Task: {task_id} ({operation})")
                
                try:
                    # Simulate some processing delay
                    time.sleep(2)
                    
                    # Execute task
                    result = process_task(operation, input_data)
                    
                    # Mark completed
                    db.mark_completed(task_id, result)
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Task {task_id} Completed Successfully.")
                    
                except Exception as process_error:
                    # Mark failed
                    error_msg = f"{str(process_error)}\n{traceback.format_exc()}"
                    db.mark_failed(task_id, error_msg)
                    print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Task {task_id} Failed: {str(process_error)}")
            
            else:
                # Sleep if no tasks
                time.sleep(Config.POLL_INTERVAL)
                
        except Exception as e:
            # Top level catch to prevent worker crash
            print(f"Critical Worker Error: {e}")
            time.sleep(Config.POLL_INTERVAL)

if __name__ == "__main__":
    main()
