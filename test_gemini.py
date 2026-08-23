from dotenv import load_dotenv
from google import genai

# 1. Load the hidden .env file
load_dotenv()

# 2. Initialize the official Google Gen AI framework
# It automatically finds the GEMINI_API_KEY we saved
client = genai.Client()

# 3. Test the connection to Gemini 3.5
print("Sending ping to Gemini...")
response = client.models.generate_content(
    model="gemini-3.5-flash",
    contents="NeuTrace test ping. Reply with 'Connection successful. NeuTrace is online.'"
)

print(f"Gemini says: {response.text}")