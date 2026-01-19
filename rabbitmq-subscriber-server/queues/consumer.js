require("dotenv").config();
const amqp = require("amqplib");
const { parseAndSaveSensorData } = require("../services/sensor_service");


// If this server is running in Docker-Compose, then the RabbitMQ URL
// is from the environment variable set in the docker-compose.yml file
// otherwise it defaults to local host 
const RABBITMQ_URL = process.env.AMQP_URL || 'amqp://localhost:5672'

// Name of the queue to consume messages from
const QUEUE_NAME = "sensor_data";


/**
 * This function listens for messages on the sensor_data queue
 * Each received message is parsed as a JSON and is processed by 
 * the parseAndSaveSensorData()
 */
async function startConsumer() {
  try {
    // connect to RabbitMQ server
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    // ensure the queue exists and is durable
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Waiting for messages in ${QUEUE_NAME}...`);

    // start consuming messages from the queue
    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (msg !== null) {
          // parse the json message
          const messageContent = JSON.parse(msg.content.toString());
          console.log(`[x] Received: ${messageContent}`);

          // write the sensor data to the database
          await parseAndSaveSensorData(messageContent);

          // acknowledge the message to remove it from the queue
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Error starting consumer:", err);
  }
}

module.exports = {
  startConsumer
};
