# Medoso - Online Appointment Booking System

A full-stack web application for managing appointments with support for multiple user roles (patients and doctors), availability management, and reminder systems.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

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
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

### Frontend
- **Library**: React 18+
- **Router**: react-router-dom
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Build Tool**: Create React App
- **Dev Proxy**: http-proxy-middleware

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
│   ├── utils/
│   │   ├── apiFormat.js      # Response formatting utilities
│   │   ├── appointmentToken.js # Appointment token generation
│   │   └── password.js       # Password validation utilities
│   ├── tests/
│   │   └── user-fallback.test.js # Unit tests
│   ├── server.js             # Main server file
│   ├── db.js                 # Database connection
│   ├── package.json
│   └── .env.example          # Environment template
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js          # Navigation component
│   │   │   ├── ProtectedRoute.js  # Protected route wrapper
│   │   ├── pages/
│   │   │   ├── Home.js            # Landing page
│   │   │   ├── Login.js           # Login page
│   │   │   ├── Register.js        # Registration page
│   │   │   ├── Dashboard.js       # Patient dashboard
│   │   │   ├── DoctorDashboard.js # Doctor dashboard
│   │   │   ├── BookAppointment.js # Appointment booking page
│   │   │   └── ManageAvailability.js # Doctor availability management
│   │   ├── utils/
│   │   │   └── appointmentHelpers.js # Date/time/status formatting
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── styles/
│   │   │   ├── index.css         # Global design system
│   │   │   ├── App.css           # Shared layout components
│   │   │   ├── Auth.css          # Authentication pages
│   │   │   ├── Home.css          # Landing page
│   │   │   ├── DoctorViews.css   # Availability management
│   │   │   └── DoctorDashboard.css # Doctor dashboard
│   │   ├── App.js                # Main app component
│   │   ├── App.css               # App-level styles
│   │   ├── index.js              # React entry point
│   │   ├── index.css             # Global styles
│   │   └── setupProxy.js         # Development proxy to backend
│   ├── package.json
│   ├── .env.example              # Environment template
│   └── vercel.json               # Deployment config
│
├── .github/
│   └── copilot-instructions.md  # Project guidelines
├── .gitignore
├── package.json                  # Root orchestrator scripts
└── README.md
```

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

```bash
# Install all dependencies for backend and frontend
npm run install:all
```

## Configuration

### Backend Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/medoso?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
JWT_SECRET=your_very_secure_secret_key_change_this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

The `.env` file in the frontend directory uses relative paths by default:

```env
REACT_APP_API_URL=/api
```

This ensures the frontend works both locally (via proxy) and in production.

## Running the Application

### Local Development with Proxy

The recommended way to run the app locally is using the root orchestrator:

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`
- Frontend API requests to `/api/*` are automatically proxied to the backend

### Separate Terminals

Alternatively, run in separate terminals:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## API Endpoints

### Health
- `GET /api/health` - Server health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)
- `GET /api/auth/doctors` - Get all active doctors (Protected)

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
- `GET /api/availability/my` - Get my availability (Doctor only)
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
  token: String (unique),
  bookedAt: Date,
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

## Deployment

### Netlify (Frontend)
- Connect repository to Netlify
- Set build command: `npm run build --prefix frontend`
- Set publish directory: `frontend/build`
- Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com/api`

### Render / Railway (Backend)
- Connect repository
- Set root directory: `backend`
- Set start command: `npm start`
- Set environment variables from `.env.example`

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
