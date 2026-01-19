# Camera Stream Server

> This server receives and processes video streams from ESP camera and MLX90640 thermal camera via websockets, and serves them as HTTP multipart streams for frontend consumption  

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Endpoints](#endpoints)

---

## Features

* Receive real-time video streams from ESP camera and MLX90640 camera via websockets
* Generates the frames from the incoming bytes and thermal pixel matrices
* Video streams at ~ 30 fps
* Video streams over HTTP multipart streams

---

## Installation

### Prerequisites

* Python >= 3.10
* Docker & Docker Compose (optional, see root repository [README](../README.md))

### Steps

```bash
# Install dependencies
pip install -r requirements.txt

# Start the backend
python main.py
```

---

## Usage

1. Start Streaming from the ESP using websockets to either `/normal` or `/thermal`
2. Navigate to:
    - `http://localhost:3001/normal_stream` to see the normal camera video feed
    - `http://localhost:3001/thermal_stream` to see the thermal camera feed


---

## Endpoints

| Method    | Endpoint          | Description                     |
| --------- | ----------------- | ------------------------------- |
| WebSocket | /thermal          | Send thermal image pixel matrix |
| WebSocket | /normal           | Send normal video bytes         |
| GET       | /thermal_stream   | Get thermal camera video feed   |
| GET       | /normal_stream    | Get normal camera video feed    |

