import time
import sys
import os
import traceback
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler
from config import Config
from database import Database
from processor import process_task

class DummyHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"Worker is running")

def start_dummy_server():
    port = int(os.environ.get("PORT", 10000))
    server = HTTPServer(('0.0.0.0', port), DummyHandler)
    server.serve_forever()

def main():
    print("Starting AI Task Processing Worker...")
    
    # Start the dummy web server in a background thread to satisfy Render's free tier
    threading.Thread(target=start_dummy_server, daemon=True).start()
    print("Started dummy web server for Render health checks.")

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
