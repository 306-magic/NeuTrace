# Use official lightweight Python image
FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered output for real-time logs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy project dependency manifest
COPY requirements.txt .

# Install dependencies cleanly
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code
COPY . .

# Google Cloud Run injects the PORT environment variable (defaults to 8080)
ENV PORT=8080

# Run FastAPI via Uvicorn listening on 0.0.0.0 and the container port
CMD exec uvicorn server:app --host 0.0.0.0 --port ${PORT}