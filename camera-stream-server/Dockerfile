FROM python:3.10-slim

# working dir
WORKDIR /camera-stream-server

# dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# FastAPI port
EXPOSE 3001

# start the server (module:variable)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
