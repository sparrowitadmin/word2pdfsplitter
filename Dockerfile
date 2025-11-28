# Use Python 3.11 slim image
FROM python:3.11-slim

# Install system dependencies including LibreOffice
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Create directory for temporary files
RUN mkdir -p /tmp/uploads

# Expose port
EXPOSE 5001

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=5001

# Run the application
CMD gunicorn --bind 0.0.0.0:$PORT --workers 2 --timeout 120 app:app

