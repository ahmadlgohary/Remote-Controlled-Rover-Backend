const mongoose = require("mongoose");

// MongoDB API key from environment variables
const MONGO_DB_API = process.env.MONGO_DB_API;

/**
 * This function connects to the MongoDB database using mongoose
 */
function connectMongo() {
  mongoose.connect(MONGO_DB_API)
    .then(() => console.log("Connected to MongoDB")) // successful connection
    .catch(err => console.error("MongoDB connection error:", err)); // connection error
}

module.exports = {
  connectMongo
};
