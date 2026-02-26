import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-system';

// Set mongoose connection options
mongoose.set('strictQuery', false);

// Improved MongoDB connection handler
const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI}`);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000, // Increased timeout for better reliability
      family: 4, // Use IPv4
      autoIndex: true, // Build indexes
      retryWrites: true, // Allow write retries
    };
    
    const conn = await mongoose.connect(MONGODB_URI, options);
    
    // Set up mongoose connection error handlers
    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Attempting to reconnect...');
    });
    
    // Handle Node.js process termination and close the MongoDB connection properly
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Please make sure MongoDB is running and accessible');
    throw error;
  }
};

export default connectDB; 