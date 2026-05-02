require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { initSocket } = require('./config/socket');
const apiLimiter = require('./middleware/rateLimit');

// Route files
const auth = require('./routes/auth');
const accommodations = require('./routes/accommodations');
const hotels = require('./routes/hotels');
const places = require('./routes/places');
const bookings = require('./routes/bookings');
const payment = require('./routes/payment');
const emergency = require('./routes/emergency');
const tripPlanner = require('./routes/tripPlanner');
const chatbot = require('./routes/chatbot');
const reviews = require('./routes/reviews');
const admin = require('./routes/admin');

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Body parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
})); 
app.use(mongoSanitize()); // Sanitize data
app.use(xss()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress responses

// Rate limiting
app.use('/api/', apiLimiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/accommodations', accommodations);
app.use('/api/hotels', hotels);
app.use('/api/places', places);
app.use('/api/bookings', bookings);
app.use('/api/payment', payment);
app.use('/api/emergency', emergency);
app.use('/api/trip-planner', tripPlanner);
app.use('/api/chatbot', chatbot);
app.use('/api/reviews', reviews);
app.use('/api/admin', admin);

// Static folder (for uploads if any)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'Kumari Horizon API',
    version: '1.0.0',
    status: 'Operational'
  });
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
