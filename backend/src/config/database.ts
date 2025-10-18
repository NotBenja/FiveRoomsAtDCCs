import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using Mongoose.
 * The connection URI is retrieved from the MONGODB_URI environment variable.
 * If the variable is not set, it defaults to 'mongodb://localhost:27017/reservasalasdcc'.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/reservasalasdcc';

    await mongoose.connect(mongoUri);

    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error while connecting to MongoDB:', error);
    process.exit(1);
  }
};


/**
 * Event listener for successful connection to MongoDB
 */
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

/**
 * Event listener for successful connection to MongoDB
 */
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

/**
 * Event listener for errors in MongoDB connection
 */
mongoose.connection.on('error', (err) => {
  console.error('Error in MongoDB:', err);
});

