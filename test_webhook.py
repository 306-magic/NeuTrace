import hmac
import hashlib
import json
import httpx
import asyncio

# The exact secret configured in your .env file
WEBHOOK_SECRET = "spectra_dev_secret_key_998877"
SERVER_URL = "http://127.0.0.1:8000/api/webhooks/github"

# Simulated GitHub Pull Request event payload
MOCK_PR_PAYLOAD = {
    "action": "opened",
    "number": 42,
    "repository": {
        "full_name": "developer/spectra-test-repo",
        "clone_url": "https://github.com/developer/spectra-test-repo.git"
    },
    "pull_request": {
        "head": {
            "sha": "a1b2c3d4e5f67890123456789abcdef012345678"
        }
    }
}

def generate_signature(payload_bytes: bytes, secret: str) -> str:
    """Generates an HMAC SHA-256 signature header matching GitHub's format."""
    mac = hmac.new(secret.encode("utf-8"), msg=payload_bytes, digestmod=hashlib.sha256)
    return f"sha256={mac.hexdigest()}"

async def run_tests():
    payload_bytes = json.dumps(MOCK_PR_PAYLOAD).encode("utf-8")
    
    # Test 1: Send request with VALID signature
    valid_signature = generate_signature(payload_bytes, WEBHOOK_SECRET)
    headers_valid = {
        "X-GitHub-Event": "pull_request",
        "X-Hub-Signature-256": valid_signature,
        "Content-Type": "application/json"
    }

    print("\n--- Test 1: Sending Webhook with VALID Signature ---")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SERVER_URL, content=payload_bytes, headers=headers_valid)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Connection Failed: {e}. Make sure Uvicorn server is running!")

    # Test 2: Send request with INVALID signature (Security Check)
    invalid_signature = generate_signature(payload_bytes, "WRONG_SECRET_KEY")
    headers_invalid = {
        "X-GitHub-Event": "pull_request",
        "X-Hub-Signature-256": invalid_signature,
        "Content-Type": "application/json"
    }

    print("\n--- Test 2: Sending Webhook with INVALID Signature (Security Test) ---")
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SERVER_URL, content=payload_bytes, headers=headers_invalid)
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.json()}")
        except Exception as e:
            print(f"Connection Failed: {e}")

if __name__ == "__main__":
    asyncio.run(run_tests())