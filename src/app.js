// Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database'); // Database connection
const authRoutes = require('./routes/auth.routes'); // Authentication routes

// Load environment variables
dotenv.config();

// Initialize Express application
const app = express();

// Connect to MongoDB
connectDB();

// Middleware setup
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(helmet()); // Add security headers
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(morgan('dev')); // Log HTTP requests in development mode

// Static file serving for uploaded resumes
app.use('/resumes', express.static(path.join(__dirname, 'public/resumes')));

// API Routes
app.use('/api/v1/auth', authRoutes); // Authentication routes

// Health check endpoint (optional)
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is running...' });
});

// Error handling middleware (must be last)


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
