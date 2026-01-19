const express = require('express');
const router = express.Router();
const RobotModel = require("../models/robot");
const { updateAndPrintErrors } = require('../utils/error_tracker');

/**
 * GET /telemetry/sessions
 *
 * Retrieves all session IDs from the database, sorted by creation date descendingly
 *
 * @returns {Array<string>} An array of session IDs on success
 *   - 200: array of session IDs
 *   - 500: { error: 'Failed to fetch session IDs' }
 */
router.get('/sessions', async (req, res) => {
  try {
    // get all documents' session_id 
    const sessions = await RobotModel
      .find({}, { _id: 0, session_id: 1 })  // return only session ID
      .sort({ createdAt: -1 });             // sort by creation date descendingly 
    updateAndPrintErrors(true)

    // return only the session ids as an array
    res.status(200).json(sessions.map(s => s.session_id));
  } catch (err) {
    updateAndPrintErrors(false)
    res.status(500).json({ error: 'Failed to fetch session IDs' });
  }
});



/**
 * GET /telemetry/latest
 * 
 * Retrieves the latest values of the latest session ID
 * 
 * @returns {Object} JSON Object of the most recent session_id with the 
 *                   most recent values for all telemetry fields on success
 * - 200: JSON Object of the most recent session_id with the most recent values for all fields
 * - 404: { error: 'No sessions found' }
 * - 500: { error: 'Failed to fetch latest session telemetry' }
 * 
 */
router.get('/latest', async (req, res) => {
  try {
    // find the most recent session by sorting session_id in descending order
    const latestSession = await RobotModel
      .findOne({})              // return the first document depending on the sorting 
      .sort({ session_id: -1 }) // sort sessions by descending order 
      .select({
        // include the session id in the response
        session_id: 1,

        // Return only the most recent value from each telemetry array
        front_right_wheel: { $slice: -1 },
        front_left_wheel: { $slice: -1 },
        back_right_wheel: { $slice: -1 },
        back_left_wheel: { $slice: -1 },
        average_rpm: { $slice: -1 },
        robot_speed: { $slice: -1 },
        temperature: { $slice: -1 },
        pressure: { $slice: -1 },
        battery_voltage: { $slice: -1 },
        time: { $slice: -1 },
        gps_latitude: { $slice: -1 },
        gps_longitude: { $slice: -1 },
        gps_altitude: { $slice: -1 },
      });

    if (!latestSession) {
      return res.status(404).json({ error: 'No sessions found' });
    }

    res.status(200).json(latestSession);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest session telemetry' });
  }
});


/**
 * GET /telemetry/latest/full
 * 
 * Retrieves all values of the latest session ID
 * 
 * @returns {Object} JSON Object of the full document of the most recent session on success
 * - 200: JSON Object of the full document of the most recent session
 * - 404: { error: 'No sessions found' }
 * - 500: { error: 'Failed to fetch latest session data' }
 * 
 */
router.get('/latest/full', async (req, res) => {
  try {
    const session = await RobotModel
      .findOne({})               // return the first document depending on the sorting 
      .sort({ session_id: -1 }); // sort sessions by descending order 


    if (!session) {
      return res.status(404).json({ error: 'No sessions found' });
    }

    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest session data' });
  }
});

/**
 * GET /telemetry/:sessionId
 * 
 * Retrieves all values of a session with `session_id`
 * 
 * @returns {Object} JSON Object of the full document of a session with `session_id` on success
 * - 200: JSON Object of the full document a session with `session_id`
 * - 404: { error: 'Session not found' }
 * - 500: { error: 'Failed to fetch telemetry' }
 * 
 */
router.get('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // find session with `sessionId`
    const session = await RobotModel.findOne({ session_id: sessionId });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch telemetry' });
  }
});


/**
 * GET /telemetry/:sessionId/latest
 * 
 * Retrieves the latest values of a session with `session_id`
 * 
 * @returns {Object} JSON Object of session with `session_id` with the 
 *                   most recent values for all telemetry fields on success
 * - 200: JSON Object of session with `session_id` with the most recent values for all fields
 * - 404: { error: 'Sessions not found' }
 * - 500: { error: 'Failed to fetch latest telemetry' }
 * 
 */
router.get('/:sessionId/latest', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await RobotModel.findOne(
      // find session with `sessionId`
      { session_id: sessionId },

      // Return only the most recent value from each telemetry array
      {
        front_right_wheel: { $slice: -1 },
        front_left_wheel: { $slice: -1 },
        back_right_wheel: { $slice: -1 },
        back_left_wheel: { $slice: -1 },
        average_rpm: { $slice: -1 },
        robot_speed: { $slice: -1 },
        temperature: { $slice: -1 },
        pressure: { $slice: -1 },
        battery_voltage: { $slice: -1 },
        time: { $slice: -1 },
        gps_latitude: { $slice: -1 },
        gps_longitude: { $slice: -1 },
        gps_altitude: { $slice: -1 },
      }
    );

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch latest telemetry' });
  }
});

module.exports = router;