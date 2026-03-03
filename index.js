const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

// Load env vars
dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5000',
  'https://smart-doctor-app-1.onrender.com'
].filter(Boolean); // Remove null/undefined

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      // In development, we can be more lenient, but let's stick to the list for safety.
      // If we are in dev, maybe log it.
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Socket.io setup for WebRTC signaling
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  },
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/hospitals', require('./routes/hospitalRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-camps', require('./routes/medicalCampRoutes'));
app.use('/api/health-records', require('./routes/healthRecordRoutes'));
app.use('/api/videos', require('./routes/videoRoutes'));
app.use('/api/sos', require('./routes/sosRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/symptom-checker', require('./routes/symptomRoutes'));
app.use('/api/blood', require('./routes/bloodRoutes'));
app.use('/api/family', require('./routes/familyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Smart Doctor API is running', timestamp: new Date() }));

// Error handling middleware
app.use(require('./middleware/errorMiddleware'));

// Static files for production (Serving React Frontend)
const buildPath = path.join(__dirname, '../client/build');
app.use(express.static(buildPath));

// Catch-all route to serve the frontend for any non-API routes
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API route not found' });
  }
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      res.status(404).send('Frontend build not found. Please run "npm run build" in the client folder.');
    }
  });
});

// ──────────────────────────────────────────────
//  WebRTC Signaling via Socket.io
// ──────────────────────────────────────────────
const rooms = {}; // roomId -> [participants]

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join-room', ({ roomId, userId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = [];
    rooms[roomId].push({ socketId: socket.id, userId, role });
    socket.to(roomId).emit('user-joined', { socketId: socket.id, userId, role });
    console.log(`${role} ${userId} joined room ${roomId}`);
  });

  socket.on('offer', ({ roomId, offer, to }) => {
    io.to(to).emit('offer', { offer, from: socket.id });
  });

  socket.on('answer', ({ answer, to }) => {
    io.to(to).emit('answer', { answer, from: socket.id });
  });

  socket.on('ice-candidate', ({ candidate, to }) => {
    io.to(to).emit('ice-candidate', { candidate, from: socket.id });
  });

  socket.on('end-call', ({ roomId }) => {
    socket.to(roomId).emit('call-ended');
    if (rooms[roomId]) delete rooms[roomId];
  });

  socket.on('sos-alert', (data) => {
    io.emit('sos-received', data);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter((r) => r.socketId !== socket.id);
      if (rooms[roomId].length === 0) delete rooms[roomId];
      else socket.to(roomId).emit('user-left', { socketId: socket.id });
    }
    console.log('Socket disconnected:', socket.id);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart-doctor-db';

mongoose
  .connect(DB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message.includes('SSL') || err.message.includes('alert 80')) {
      console.error('\n📢 TROUBLESHOOTING TIP: This usually means your IP is not whitelisted in MongoDB Atlas.\n');
    }
    process.exit(1);
  });

module.exports = { app, io };
