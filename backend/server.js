const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
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

module.exports = app;
