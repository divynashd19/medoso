# Deployment Instructions - Online Appointment Booking System

This guide walks you through deploying the full application to production using free hosting tiers.

## Overview
- **Frontend**: Hosted on Netlify (static React app)
- **Backend**: Hosted on Render (Node.js server)
- **Database**: MongoDB Atlas (cloud MongoDB, free tier)

---

## Step 1: Set Up MongoDB Atlas (Database)

1. Go to https://www.mongodb.com/cloud/atlas and sign up (free).
2. Create a new cluster (free tier available).
3. Wait for cluster to deploy (~5-10 minutes).
4. Click "Connect" and choose "Drivers" (Node.js).
5. Copy the connection string; it will look like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Update `backend/.env` with this URI:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up (free, with GitHub).
2. Click "New +" → "Web Service".
3. Connect your GitHub repo (`Online-Appointment-Booking-System`).
4. Select the repo and configure:
   - **Name**: `online-appointment-booking-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Click "Advanced" and add environment variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret (e.g., generate at https://www.uuidgenerator.net/)
   - `PORT`: `10000` (Render assigns a port; this can be anything)
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: Leave as `http://localhost:3000` for now (update after frontend deploy)
6. Click "Create Web Service".
7. Render will deploy the backend. Wait for it to complete (~2-5 minutes). Copy the URL (e.g., `https://online-appointment-booking-backend.onrender.com`).

---

## Step 3: Update Backend URL in Frontend

1. Edit `frontend/.env`:
   ```env
   REACT_APP_API_URL=https://online-appointment-booking-backend.onrender.com/api
   ```
   (Replace with your actual Render backend URL + `/api`)

2. Commit and push:
   ```bash
   git add frontend/.env
   git commit -m "Update backend API URL for production"
   git push origin main
   ```

---

## Step 4: Deploy Frontend to Netlify

1. Go to https://netlify.com and sign up (free, with GitHub).
2. Click "Add new site" → "Import an existing project".
3. Select GitHub and authorize Netlify.
4. Choose your repo (`Online-Appointment-Booking-System`).
5. Configure build settings:
   - **Build command**: `npm run build --prefix frontend`
   - **Publish directory**: `frontend/build`
6. Click "Advanced" and add environment variables:
   - `REACT_APP_API_URL`: Your Render backend URL + `/api` (e.g., `https://online-appointment-booking-backend.onrender.com/api`)
7. Click "Deploy site".
8. Netlify will build and deploy. Wait for completion. Your site URL will appear (e.g., `https://xxx.netlify.app`).

---

## Step 5: Update Backend's FRONTEND_URL (CORS)

1. Go back to Render dashboard.
2. Find your backend service (`online-appointment-booking-backend`).
3. Click "Environment" and edit `FRONTEND_URL`:
   ```
   https://xxx.netlify.app
   ```
   (Replace with your Netlify frontend URL)
4. Click "Save" — Render will auto-redeploy.

---

## Step 6: Verify Deployment

1. Open your Netlify frontend URL in a browser.
2. Try to **register** with:
   - Name: `Test User`
   - Email: `testuser@example.com`
   - Password: `TestPassword123!` (must have uppercase, lowercase, number, symbol)
   - Role: `Patient`
3. Click "Create Account".
4. If successful, you'll see a dashboard. If not, check browser console (F12 → Console) for errors and share them.
5. Try to **login** with the same credentials.

---

## Troubleshooting

### "Registration failed" or "Login failed"
- Check browser console (F12 → Console tab) for the exact error message.
- Ensure `REACT_APP_API_URL` is correct and points to your Render backend.
- Ensure backend's `MONGO_URI` is correct and the MongoDB cluster is active.

### Backend not starting on Render
- Check Render dashboard → your service → Logs.
- Common issues:
  - `MONGO_URI` is wrong or MongoDB cluster is not activated.
  - `PORT` environment variable is conflicting (Render assigns a port; you can remove `PORT` from env vars).

### CORS errors
- Ensure `FRONTEND_URL` in backend `.env` (on Render) matches your Netlify frontend URL exactly.
- Render redeploys automatically when env vars change; wait a few seconds.

---

## Summary

After completing these steps:
- Backend is live at: `https://online-appointment-booking-backend.onrender.com`
- Frontend is live at: `https://xxx.netlify.app`
- Database is live on MongoDB Atlas.

Users can register, login, book appointments, and manage their profile from your deployed app!

---

## Next Steps (Optional Enhancements)
- Set up a custom domain (Netlify and Render both offer custom domains).
- Enable email notifications for appointment reminders.
- Set up monitoring / alerts for backend uptime.

