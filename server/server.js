const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectToMongo = require('./db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Database Connection
connectToMongo().then(() => {
  const autoSeedIfEmpty = require('./initSeed');
  autoSeedIfEmpty();
});

// Middlewares
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoute = require('./routes/authRoute');
const roomRoute = require('./routes/roomRoute');
const bookingRoute = require('./routes/bookingRoute');
const paymentRoute = require('./routes/paymentRoute');

app.use('/api/users', authRoute);
app.use('/api/rooms', roomRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/payments', paymentRoute);

// Root healthcheck route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    system: 'HotelPro Hotel Management API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/users',
      rooms: '/api/rooms',
      bookings: '/api/bookings',
      payments: '/api/payments',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[HotelPro Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Express Server
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🏨 HotelPro Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive requests from React Client`);
  console.log(`===============================================`);
});

module.exports = { app, server };
