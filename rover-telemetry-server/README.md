# Rover Telemetry Server

> Backend server responsible for receiving rover telemetry and routing it through RabbitMQ.
> 
> It exposes REST API endpoints for querying and managing telemetry sessions stored in MongoDB. 

---

## Table of Contents

1. [Overview](#overview)
2. [Responsibilities](#responsibilities)
3. [Features](#features)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Usage](#usage)
7. [API Endpoints](#api-endpoints)

---

## Overview

This server is the main API layer for handling rover sensor data.
It exposes REST API endpoints used to query and manage telemetry sessions stored in MongoDB.

This server is decoupled from direct database writes to prevent race conditions. 

For more details, see **Purpose** in the RabbitMQ Subscriber Server [README](../rabbitmq-subscriber-server/README.md#purpose)


---

## Responsibilities
- Accept telemetry data from the rover
- Forward telemetry messages to RabbitMQ
- Expose REST APIs for querying telemetry data
- Manage telemetry sessions in MongoDB

## Features

- CRUD operations for rover telemetry sessions
- Decoupling database writes using RabbitMQ
- REST API for reading, deleting, and listing sessions
    - Get all session IDS
    - Get latest telemetry values for:
        - The most recent session
        - A specific session by `session_id`
    - Get full telemetry history for:
        - The most recent session
        - A specific session by `session_id`
    - Delete session by `session_id`
- Designed to handle high-frequency telemetry without database overload

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
3. Start the [RabbitMQ Subscriber Server](../rabbitmq-subscriber-server/)
4. Start this server `node main.js`

    

---

## API Endpoints

| Method | Endpoint                     | Description                                |
| ------ | ---------------------------- | ------------------------------------------ |
| GET    | /telemetry/sessions          | List all session IDs                       |
| GET    | /telemetry/latest            | Get latest values from the latest session  |
| GET    | /telemetry/latest/full       | Get all data from latest session telemetry |
| GET    | /telemetry/:sessionId        | Get all data for a specific session        |
| GET    | /telemetry/:sessionId/latest | Get latest values for a specific session   |
| DELETE | /telemetry/:sessionId        | Delete a session by ID                     |
| POST   | /telemetry                   | Publish sensor data to RabbitMQ            |



