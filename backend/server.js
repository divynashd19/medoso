const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://agent-6a4a54bbecb69e8fc66fa485--medoso.netlify.app',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const isAllowed = allowedOrigins.includes(origin) ||
      /https:\/\/.*\.netlify\.app$/i.test(origin) ||
      /https:\/\/.*\.vercel\.app$/i.test(origin) ||
      /http:\/\/localhost(:\d+)?$/i.test(origin) ||
      /http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin);

    if (isAllowed) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const reminderRoutes = require('./routes/reminderRoutes');

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running', database: 'mongodb' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Appointment Booking System API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/reminders', reminderRoutes);

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

let isConnected = false;
const handler = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }
  return app(req, res);
};

module.exports = handler;
module.exports.app = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  const HOST = '0.0.0.0';
  connectDB()
    .then(() => {
      app.listen(PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`);
      });
    })
    .catch((error) => {
      console.error('Failed to connect to database:', error.message);
      process.exit(1);
    });
}
