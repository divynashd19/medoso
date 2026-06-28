const mongoose = require('mongoose');

const connectDB = async () => {
  mongoose.set('strictQuery', true);

  const options = { serverSelectionTimeoutMS: 8000 };
  const primaryUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (primaryUri) {
    try {
      await mongoose.connect(primaryUri, options);
      console.log('MongoDB connected successfully');
      return;
    } catch (error) {
      console.warn('Primary MongoDB connection failed:', error.message);
    }
  }

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/appointment_booking', options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.warn('MongoDB not available; authentication will use the built-in local fallback.', error.message);
  }
};

module.exports = connectDB;
