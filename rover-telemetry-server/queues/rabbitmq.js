require("dotenv").config();
const amqp = require('amqplib');

// If this server is running in Docker-Compose, then the RabbitMQ URL
// is from the environment variable set in the docker-compose.yml file
// otherwise it defaults to local host 
const RABBITMQ_URL = process.env.AMQP_URL || 'amqp://localhost'

/**
 * Sends the incoming sensor data message to RabbitMQ
 * 
 * @param {string} queueName 
 * @param {string} message A JSON formatted string
 */
async function sendMessage(queueName, message) {
  // Connect to RabbitMQ server
  const connection = await amqp.connect(RABBITMQ_URL);

  // Create a channel for sending messages
  const channel = await connection.createChannel();

  // ensure the queue exists and is durable
  await channel.assertQueue(queueName, { durable: true });

  // Send the message to the queue
  channel.sendToQueue(queueName, Buffer.from(message));

  console.log(`[>] Sent to ${queueName}: ${message}`);

  // Close the channel and connection
  await channel.close();
  await connection.close();
}

module.exports = {
  sendMessage
};
