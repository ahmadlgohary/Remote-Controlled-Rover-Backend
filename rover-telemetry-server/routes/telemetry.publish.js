const express = require('express');
const router = express.Router();
const { sendMessage } = require('../queues/rabbitmq');
const { updateAndPrintErrors } = require('../utils/error_tracker');

/**
 * POST /telemetry
 *
 * Receives telemetry data from the rover and publishes it to the RabbitMQ sensor_data queue.
 *
 * @param {Object} req.body - The telemetry data sent by the rover
 * @returns {Object} JSON response indicating success or error:
 *   - 200: { message: 'OK' }
 *   - 400: { error: 'Request body is missing' }
 *   - 500: { error: 'Failed to send data' }
 */
router.post('/', async (req, res) => {
  try {
    // make sure the request body exits
    if (!req.body) {
      console.warn("Request body is missing");
      updateAndPrintErrors(false);
      return res.status(400).json({ error: "Request body is missing" });
    }
    // Convert the telemetry data to JSON string
    const jsonMessage = JSON.stringify(req.body);

    // send the message to the queue
    await sendMessage('sensor_data', jsonMessage);

    console.log("Received data:", jsonMessage);
    updateAndPrintErrors(true);

    res.status(200).send('OK');
  } catch (err) {
    console.error("Failed to send JSON message:", err);
    updateAndPrintErrors(false);
    res.status(500).json({ error: "Failed to send data" });
  }
});


module.exports = router;
