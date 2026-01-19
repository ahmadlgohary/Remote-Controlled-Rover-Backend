const express = require('express');
const router = express.Router();
const RobotModel = require("../models/robot");
const { updateAndPrintErrors } = require('../utils/error_tracker');

/**
 * DELETE /telemetry/:sessionId
 * Deletes a robot telemetry session by its session ID
 * 
 * Used by the frontend dashboard
 * 
 * @param {string} sessionId - The ID of the session to delete.
 * @returns {Object} JSON response indicating success or error
 *   - 200: { message: 'Session deleted successfully' }
 *   - 404: { error: 'Session not found' }
 *   - 500: { error: 'Failed to delete session' }
 * 
 */
router.delete('/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const result = await RobotModel.findOneAndDelete({
      session_id: sessionId
    });

    if (!result) {
      return res.status(404).json({ error: 'Session not found' });
    }
    updateAndPrintErrors(true)
    res.status(200).json({ message: 'Session deleted successfully' });
  } catch (err) {
    console.error(err);
    updateAndPrintErrors(false)
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;