# Drive Control Server

> A websocket server acting as a real-time message relay between clients (frontend and rovers' driving module)

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Message Formats](#message-formats)
4. [Installation](#installation)
5. [Usage](#usage)

---

## Overview

This server acts as a real-time message relay between clients, mainly a frontend-controller and a rover's driving module. 

Websocket communication enables for real-time control by routing messages between connected clients based on their client IDs. 


---
## Architecture

```
Frontend Controller
        |
        | WebSocket (driving commands)
        v
WebSocket Server
        |
        | WebSocket (routed by client ID)
        v
Rover Client
```

---

## Message Formats

### 1. Client Registration

Each client must send a registration message on connection in the following format:


```json
{
    "type": "register",
    "id": "robot_1" // or "id": "frontend"
}
```
This allows the server to track and route messages correctly.

### 2. Driving Commands

Once registered, the frontend can send driving commands to the rover in the following format:

```json
{
    "type": "driving_commands",
    "to": "robot_1",
    "front_right_motor": {
        "speed": 0-255,     // PWM signal to control motor speed on the firmware
        "direction":0/1     // Digital signal to control motor direction, 1 is forward 0 is backward
        },
    "front_left_motor": {"speed": 0-255, "direction":0/1},
    "back_right_motor": {"speed": 0-255, "direction":0/1},
    "back_left_motor": {"speed": 0-255, "direction":0/1}
}


```

## Installation

### Prerequisites

* Node.js >= 18
* Docker & Docker Compose (optional, see root repository [README](../README.md))

### Steps

```bash
# Install dependencies
npm install

# Start the backend
node main.js
```

## Usage
1. Start this server `node main.js`
2. Start the frontend and rover