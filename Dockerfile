FROM python:3.10-slim
WORKDIR /app
COPY . .
# Try to install your local requirements, but don't crash if they conflict
RUN pip install -r requirements.txt || true
# FORCE-INSTALL the exact core packages the AI backend needs to run
RUN pip install fastapi uvicorn google-genai pydantic
# Hardcode the exact port (8080) that Google Cloud Run expects
CMD ["uvicorn", "neutrace_dashboard_api:app", "--host", "0.0.0.0", "--port", "8080"]