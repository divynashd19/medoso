# Online Appointment Booking System - Project Guidelines

## Project Overview
This is a full-stack appointment booking system with:
- **Backend**: Node.js/Express REST API
- **Frontend**: React single-page application
- **Database**: MongoDB with Mongoose ODM
- **Features**: User authentication, appointment scheduling, availability management, reminders

## Tech Stack
- Node.js & Express (Backend)
- React 18+ (Frontend)
- MongoDB & Mongoose (Database)
- JWT authentication
- Axios for API calls

## Project Structure
```
├── backend/          # Express server and API routes
├── frontend/         # React application
├── README.md         # Main documentation
└── .github/          # GitHub configuration
```

## Key Development Guidelines
1. Backend uses MVC pattern with controllers, models, routes
2. Frontend uses component-based architecture with hooks
3. Environment variables must be stored in .env files
4. API endpoints follow RESTful conventions
5. Database collections: Users, Appointments, Availability, Reminders

## Dependencies to Install
- Backend: express, mongoose, dotenv, bcryptjs, jsonwebtoken, cors, nodemon
- Frontend: react, axios, react-router-dom, date-fns

## Getting Started
1. Run `npm install` in both backend and frontend directories
2. Create .env files in backend with MongoDB connection string
3. Start backend: `npm run dev`
4. Start frontend: `npm start`
