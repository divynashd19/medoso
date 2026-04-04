# Online Appointment Booking System

A full-stack web application for managing appointments with support for multiple user roles (patients and doctors), availability management, and reminder systems.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)

## Features

### Patient Features
- User registration and authentication
- Browse available doctors
- Book appointments with doctors
- View appointment history
- Cancel appointments
- Receive appointment reminders

### Doctor Features
- User registration and authentication
- Manage availability schedule
- View scheduled appointments
- Update appointment status
- Add notes and meeting links for appointments

### Admin Features
- Manage users
- Monitor system health

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

### Frontend
- **Library**: React 18+
- **Router**: react-router-dom
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Create React App

## Project Structure

```
Online Appointment Booking System/
├── backend/
│   ├── models/
│   │   ├── User.js           # User schema (patient, doctor, admin)
│   │   ├── Appointment.js    # Appointment schema
│   │   ├── Availability.js   # Doctor availability schema
│   │   └── Reminder.js       # Reminder schema
│   ├── controllers/
│   │   ├── authController.js          # Authentication logic
│   │   ├── appointmentController.js   # Appointment management
│   │   ├── availabilityController.js  # Availability management
│   │   └── reminderController.js      # Reminder management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── availabilityRoutes.js
│   │   └── reminderRoutes.js
│   ├── middleware/
│   │   └── auth.js           # JWT authentication middleware
│   ├── server.js             # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Navigation component
│   │   │   └── ProtectedRoute.js  # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Dashboard.js       # User dashboard
│   │   │   └── BookAppointment.js # Appointment booking page
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # Styling
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles
│   ├── package.json
│   └── .env
│
├── .github/
│   └── copilot-instructions.md  # Project guidelines
├── .gitignore
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your MongoDB URI and other configurations

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. The `.env` file is already configured with default API URL

## Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/appointment_booking

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_very_secure_secret_key_change_this
JWT_EXPIRE=7d

# Email Configuration (for reminders)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

The `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Running the Application

### Start MongoDB
1. If using local MongoDB, ensure it's running:
   ```bash
   # On Windows (if installed as service)
   net start MongoDB
   
   # Or run MongoDB manually
   mongod
   ```

2. For cloud MongoDB (Atlas), ensure your connection string is in `.env`

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend Application

In a new terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `GET /api/auth/doctors` - Get all active doctors

### Appointments
- `POST /api/appointments` - Create appointment (Protected)
- `GET /api/appointments/patient/appointments` - Get patient appointments (Protected)
- `GET /api/appointments/doctor/appointments` - Get doctor appointments (Protected)
- `GET /api/appointments/:appointmentId` - Get specific appointment (Protected)
- `PUT /api/appointments/:appointmentId/status` - Update appointment status (Protected)
- `PATCH /api/appointments/:appointmentId/cancel` - Cancel appointment (Protected)

### Availability
- `POST /api/availability` - Set doctor availability (Doctor only)
- `GET /api/availability/:doctorId` - Get doctor availability
- `PUT /api/availability/:availabilityId` - Update availability (Doctor only)
- `DELETE /api/availability/:availabilityId` - Delete availability (Doctor only)

### Reminders
- `GET /api/reminders` - Get user reminders (Protected)
- `GET /api/reminders/pending` - Get pending reminders
- `PATCH /api/reminders/:reminderId/sent` - Mark reminder as sent (Protected)
- `DELETE /api/reminders/:reminderId` - Delete reminder (Protected)

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['patient', 'doctor', 'admin']),
  phone: String,
  specialization: String (for doctors),
  bio: String,
  profilePicture: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Collection
```javascript
{
  _id: ObjectId,
  patientId: ObjectId (ref: User),
  doctorId: ObjectId (ref: User),
  title: String,
  description: String,
  appointmentDate: Date,
  startTime: String (HH:mm),
  endTime: String (HH:mm),
  duration: Number (minutes),
  status: String (enum: ['scheduled', 'completed', 'cancelled', 'no-show']),
  notes: String,
  reminderSent: Boolean,
  meetingLink: String,
  location: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Availability Collection
```javascript
{
  _id: ObjectId,
  doctorId: ObjectId (ref: User),
  dayOfWeek: Number (0-6: Sunday-Saturday),
  startTime: String (HH:mm),
  endTime: String (HH:mm),
  isAvailable: Boolean,
  breaks: [
    {
      startTime: String,
      endTime: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Reminder Collection
```javascript
{
  _id: ObjectId,
  appointmentId: ObjectId (ref: Appointment),
  userId: ObjectId (ref: User),
  reminderTime: Date,
  appointmentTime: Date,
  reminderType: String (enum: ['email', 'sms', 'in-app']),
  message: String,
  status: String (enum: ['pending', 'sent', 'failed']),
  deliveredAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Development Guidelines

### Code Style
- Use ES6+ syntax
- Follow consistent naming conventions
- Comment complex logic
- Use meaningful variable names

### Frontend Guidelines
- Use functional components with hooks
- Keep components focused and reusable
- Handle loading and error states
- Use React Router for navigation
- Store sensitive data (tokens) securely

### Backend Guidelines
- Follow MVC (Model-View-Controller) pattern
- Use async/await for asynchronous operations
- Implement proper error handling
- Validate all user inputs
- Use MongoDB indexes for frequently queried fields

### Security Best Practices
- Never commit `.env` files
- Hash passwords with bcryptjs
- Use JWT for authentication
- Implement CORS properly
- Validate and sanitize all inputs
- Use HTTPS in production
- Implement rate limiting

## Next Steps

1. **Email Notifications**: Implement email service for appointment reminders
2. **Video Consultations**: Add support for online consultations with video links
3. **Payment Integration**: Add payment processing for paid consultations
4. **Analytics Dashboard**: Add analytics for doctors and admins
5. **Mobile App**: Develop mobile applications for iOS and Android
6. **Calendar Integration**: Sync with Google Calendar and Outlook
7. **Notification System**: Implement real-time notifications using WebSockets

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB is accessible on `localhost:27017`

### Port Already in Use
- Backend: Change PORT in `.env` or kill process using port 5000
- Frontend: React usually uses port 3000, change with `PORT=3001 npm start`

### CORS Errors
- Ensure FRONTEND_URL in backend `.env` matches your frontend URL
- Check CORS configuration in `server.js`

### Dependencies Issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## License

This project is open source and available under the ISC License.

## Support

For issues, questions, or suggestions, please create an issue in the repository.

---

**Happy Coding! 🚀**
