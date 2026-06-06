const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI provided via environment variables.
 * Exits the process on a fatal connection error so the container/host
 * orchestrator can restart the service.
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
