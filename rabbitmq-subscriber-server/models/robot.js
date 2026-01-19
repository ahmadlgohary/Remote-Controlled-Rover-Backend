const mongoose = require("mongoose");

/**
 * Mongoose Schema for storing the rover's telemetry data for each session
 * Each session is identified by a unique session_id, which is a constant timestamp of when
 * the rover was powered on.
 * The scope for this project was a single rover, however for more than 1 rover, the session_id
 * could include a constant rover_id dynamically created and stored on the eeprom and concatenate 
 * with a timestamp  
 */
const robot_data_schema = new mongoose.Schema({
  session_id: { type: String, required: true, unique: true }, // Timestamp as key
  front_right_wheel: { type: [Number], default: [] },
  front_left_wheel: { type: [Number], default: [] },
  back_right_wheel: { type: [Number], default: [] },
  back_left_wheel: { type: [Number], default: [] },
  average_rpm: { type: [Number], default: [] },
  robot_speed: { type: [Number], default: [] },
  temperature: { type: [Number], default: [] },
  pressure: { type: [Number], default: [] },
  battery_voltage: { type: [Number], default: [] },
  time: { type: [Date], default: [] }, // Assuming timestamps for each data entry
  gps_latitude: { type: [String], default: [] },
  gps_longitude: { type: [String], default: [] },
  gps_altitude: { type: [Number], default: [] }
});

const RobotModel = mongoose.model("robot", robot_data_schema);

module.exports = RobotModel;

