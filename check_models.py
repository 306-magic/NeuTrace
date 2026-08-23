import os
from dotenv import load_dotenv
from google import genai

# Load the API key from your .env file
load_dotenv()

try:
    client = genai.Client()
    print("🔍 Scanning your API Key for authorized models...\n")
    
    models = client.models.list()
    found_gemini = False
    
    for m in models:
        # Strip the 'models/' prefix to get the exact string we need
        name = m.name.replace("models/", "")
        if "gemini" in name:
            print(f"[✓] {name}")
            found_gemini = True
            
    if not found_gemini:
        print("[-] No Gemini models found for this API key.")
        
except Exception as e:
    print(f"[!] Authentication or API Error: {e}")