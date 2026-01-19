require("dotenv").config();
const { connectMongo } = require("./config/db");
const { startConsumer } = require("./queues/consumer");

// Connect MongoDB
connectMongo();

// Start RabbitMQ consumer
startConsumer();
