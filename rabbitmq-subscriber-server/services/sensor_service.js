const RobotModel = require("../models/robot");

/**
 * Helper function to format the time received from the rover
 * 
 * @param {string} time - Time in HH:MM:SS format
 * @returns {Date} A Date object representing today's date with the specified time
 */
function parseTime(time) {
  const date = new Date();
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  let formattedTime = `${year}-${month}-${day}T${time}Z`
  return new Date(formattedTime)
}


/**
 * This function parses the sensor data and saves it to the database
 * Each session is identified by session_id, if a session_id doesn't exist,
 * a new entry is created and the sensor values are added as the first value in 
 * their respective arrays to initialize the entry.
 * If the session_id exits, the sensor values are appended to their respective arrays.
 * @param {Array} request_from_robot 
 */
async function parseAndSaveSensorData(request_from_robot) {
  try {
    // parse the incoming sensor array into a structured object
    const sensorData = {
      front_right_wheel: parseFloat(request_from_robot[1]),
      front_left_wheel: parseFloat(request_from_robot[2]),
      back_right_wheel: parseFloat(request_from_robot[3]),
      back_left_wheel: parseFloat(request_from_robot[4]),
      average_rpm: parseFloat(request_from_robot[5]),
      robot_speed: parseFloat(request_from_robot[6]),
      temperature: parseFloat(request_from_robot[7]),
      pressure: parseFloat(request_from_robot[8]),
      battery_voltage: parseFloat(request_from_robot[9]),
      time: parseTime(request_from_robot[10]),
      gps_latitude: request_from_robot[11].toString(),
      gps_longitude: request_from_robot[11].toString(),
      gps_altitude: parseFloat(request_from_robot[13]),
    };

    // push the new sensor data to their database entry based on their session_id
    await RobotModel.findOneAndUpdate(
      // Find by session_id
      { session_id: request_from_robot[0] },
      {
        $push: {
          front_right_wheel: sensorData.front_right_wheel,
          front_left_wheel: sensorData.front_left_wheel,
          back_right_wheel: sensorData.back_right_wheel,
          back_left_wheel: sensorData.back_left_wheel,
          average_rpm: sensorData.average_rpm,
          robot_speed: sensorData.robot_speed,
          temperature: sensorData.temperature,
          pressure: sensorData.pressure,
          battery_voltage: sensorData.battery_voltage,
          time: sensorData.time,
          gps_latitude: sensorData.gps_latitude,
          gps_longitude: sensorData.gps_longitude,
          gps_altitude: sensorData.gps_altitude,
        },
      },

      {
        upsert: true,             // create a new document if no document exists
        new: true,                // return updated document instead of the original
        setDefaultsOnInsert: true // apply schema defaults when creating the new document
      }                           // this creates an array where the pushed value becomes the first element

    );

    console.log("Committed to MongoDB");
  } catch (err) {
    console.error("Error processing JSON:", err);
  }
}

module.exports = {
  parseAndSaveSensorData
};
