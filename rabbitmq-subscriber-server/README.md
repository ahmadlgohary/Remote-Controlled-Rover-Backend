# RabbitMQ Subscriber Server

> A backend server that consumes robot telemetry data from RabbitMQ and stores it in MongoDB

---

## Table of Contents

1. [Overview](#overview)
2. [Purpose](#purpose)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Reliability & Scalability Notes](#reliability-and-scalability-notes)

---

## Overview

This server acts as a RabbitMQ consumer, parsing incoming sensor messages, and stores them in a MongoDB database.

---

## Purpose
The rover sends telemetry every 1 second. 

Originally the [rover-telemetry-server](../rover-telemetry-server/) handled both HTTP requests and database writes; however, under high frequency telemetry, this would result in race conditions caused by concurrent database writes (A write would happen before the previous write has finished).

This resulted in ~50% of the telemetry traffic being dropped and not stored in the database.

This server was created to address this issue, by decoupling message ingestion from database writes using RabbitMQ. Telemetry is now pushed through a queue and written to the database sequentially. The system was able to handle high-frequency telemetry data, eliminating race conditions caused by concurrent writes, resulting in < 1% telemetry packet loss.


---

## Installation

### Prerequisites

* Node.js >= 18
* RabbitMQ
* MongoDB
* Docker & Docker Compose (optional, see root repository [README](../README.md))

### Steps

```bash
# Install dependencies
npm install

# Start the backend
node main.js
```
---

## Configuration
**Example (`.env`):**

```
MONGO_DB_API=
```
Note:
- `AMQP_URL` is an environment variable that defaults to `amqp://localhost` when running locally.
- When running in a container it is defined  as `amqp://rabbitmq:5672` in the `docker-compose.yml` file 

---

## Usage

1. Start MongoDB
2. Start RabbitMQ
3. Start this server `node main.js`
4. Once running the server will automatically:
    - Connect to RabbitMQ
    - Subscribe to the `sensor_data` queue
    - Consume incoming telemetry data and store them in the database
    
---

## Reliability and Scalability Notes

- Messages are acknowledged only after successful database writes
- Queue durability ensures messages survive broker restarts
- Decoupled architecture prevents database overload
- This eliminates race conditions caused by concurrent database writes  