import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './DB/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import route files
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

// Load environment variables
dotenv.config();

// Set MongoDB URI explicitly if not in env
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hr-system';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/leaves', leaveRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('HR System API is running');
});

// Handle undefined routes
app.all('*', (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
});

// Error handling middleware
app.use(errorHandler);

// Set up MongoDB connection and start server
const PORT = process.env.PORT || 3000;

// First connect to the database, then start the server
connectDB()
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.error('Server failed to start - database connection required');
    process.exit(1); // Exit with error code
  }); 