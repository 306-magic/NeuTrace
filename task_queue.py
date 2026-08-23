import json
import os
import redis
from dotenv import load_dotenv

# Load variables from .env
load_dotenv()

# Connect to Redis
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

try:
    # Attempt to connect to the Redis server
    redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    # Ping to verify the connection is actually alive
    redis_client.ping()
except Exception as e:
    # Graceful fallback for Windows/Local development without Redis installed
    redis_client = None
    print(f"[Warning] Redis server not detected at {REDIS_URL}.")
    print("[Warning] Spectra CI will simulate background queuing until Phase 2 Cloud Setup.")

class TaskQueue:
    """
    Pushes Pull Request analysis jobs to a background queue 
    to prevent GitHub Webhook timeouts.
    """
    
    @staticmethod
    def enqueue_pr_analysis(pr_data: dict) -> bool:
        if not redis_client:
            print(f"[Simulated Queue] Successfully buffered PR #{pr_data.get('pr_number')} for background analysis.")
            return True
            
        try:
            payload = json.dumps(pr_data)
            # Push the data to the right side of the Redis list (Queue)
            redis_client.rpush("spectra:pr_queue", payload)
            print(f"[Queue] Successfully pushed PR #{pr_data.get('pr_number')} to Redis.")
            return True
        except Exception as e:
            print(f"[Queue Error] Failed to push task: {e}")
            return False

# Quick test execution block
if __name__ == "__main__":
    test_payload = {"pr_number": 99, "repo": "developer/spectra-test"}
    TaskQueue.enqueue_pr_analysis(test_payload)