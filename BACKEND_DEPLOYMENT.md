# Backend Deployment Guide

Your React frontend is now deployed. Now let's deploy your backend API!

---

## Option 1: DigitalOcean App Platform (Recommended - $5-12/month)

### Pros:
- ✅ Simple deployment
- ✅ Affordable ($5/month)
- ✅ Built-in database options (MongoDB)
- ✅ Free SSL/HTTPS
- ✅ Custom domains
- ✅ Great docs

### Steps:

1. **Create DigitalOcean Account**:
   - Go to https://www.digitalocean.com
   - Sign up (get $200 free credit)

2. **Create MongoDB Database**:
   - Dashboard → Databases
   - Click "Create Database"
   - Select "MongoDB"
   - Choose region closest to you
   - Wait for creation (~5 minutes)
   - Copy connection string

3. **Update Backend .env**:
   ```
   MONGODB_URI=your-connection-string-from-step-2
   PORT=5000
   JWT_SECRET=your-secure-secret-key
   NODE_ENV=production
   ```

4. **Create App Platform Deployment**:
   - Push backend code to GitHub
   - Dashboard → Apps → Create App
   - Select GitHub repository
   - Choose "Node.js" region
   - Click "Create Resource"
   - Wait for deployment

5. **Get Your Backend URL**:
   - It will be something like: `https://your-app-abc123.ondigitalocean.app`

6. **Update Frontend**:
   - Create `.env.production`:
   ```
   REACT_APP_API_URL=https://your-app-abc123.ondigitalocean.app
   ```
   - Rebuild and redeploy frontend

---

## Option 2: Heroku (Easy but Pricey - $7/month minimum)

### Steps:

1. **Create Heroku Account**:
   - Go to https://www.heroku.com
   - Sign up and verify email

2. **Install Heroku CLI**:
   ```bash
   # Windows
   choco install heroku-cli
   # Or download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Setup MongoDB Atlas** (Free cloud database):
   - Go to https://www.mongodb.com/cloud/atlas
   - Create account
   - Create free cluster
   - Get connection string

4. **Configure Your App**:
   ```bash
   cd backend
   
   # Login to Heroku
   heroku login
   
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set NODE_ENV="production"
   ```

5. **Deploy**:
   ```bash
   # Set up Node.js buildpack
   heroku buildpacks:set heroku/nodejs
   
   # Deploy
   git push heroku main
   
   # View logs
   heroku logs --tail
   ```

6. **Get App URL**:
   ```bash
   heroku open
   ```
   - Will be something like: `https://your-app-name.herokuapp.com`

---

## Option 3: AWS EC2 (Most Control - $7-15/month)

More complex but good for full control.

1. Launch EC2 instance (Ubuntu)
2. SSH into instance
3. Install Node.js and MongoDB
4. Clone your repo
5. Install dependencies: `npm install`
6. Start with PM2: `pm2 start server.js`
7. Configure Nginx as reverse proxy
8. Get elastic IP and domain

(Guide: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/getting-started.html)

---

## Configure MongoDB Connection

### If using MongoDB Atlas (Cloud):

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`
5. Update backend `.env`: `MONGODB_URI=your-connection-string`

### If using local MongoDB (Dev only):

```
MONGODB_URI=mongodb://localhost:27017/appointment_booking
```

---

## Backend Environment Variables (Production)

Create `.env` in backend folder:

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your-long-secure-secret-key-change-this
JWT_EXPIRE=7d

# CORS (allow your frontend domain)
CORS_ORIGIN=https://yourdomain.com

# Email (optional for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
APP_URL=https://your-backend-domain.com
```

---

## Update Backend for Production

### 1. Enable CORS for your frontend:

In `backend/server.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 2. Add error handling:

```javascript
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});
```

### 3. Add process monitoring:

Install PM2:
```bash
npm install -g pm2
pm2 start server.js --name "appointment-api"
```

---

## Update Frontend Config

### 1. Create `.env.production`:

```
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_ENVIRONMENT=production
REACT_APP_DEBUG=false
```

### 2. Rebuild and deploy:

```powershell
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket/ --delete
```

---

## Cost Comparison

| Platform | Cost/Month | Setup Time | Difficulty |
|----------|-----------|-----------|-----------|
| DigitalOcean | $5-12 | 10 mins | ⭐ Easy |
| Heroku | $7+ | 15 mins | ⭐ Easy |
| AWS EC2 | $7-15 | 30 mins | ⭐⭐ Medium |
| Self-hosted VPS | $3-5 | 1 hour | ⭐⭐⭐ Hard |

---

## Recommended Stack

**For Best Value & Performance:**

- **Frontend**: AWS S3 + CloudFront ($0-5/month)
- **Backend**: DigitalOcean App Platform ($5/month)
- **Database**: MongoDB Atlas Free Tier ($0)
- **Total**: **$5-10/month**

---

## Health Check

After deployment, test your backend:

```bash
# Visit in browser or curl
https://your-backend-api.com/api/health

# Should return:
# { "message": "Server is running" }
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Update `CORS_ORIGIN` environment variable |
| Database connection errors | Check MongoDB URI or connection string |
| Slow response | Database indexing, optimize queries, use caching |
| Out of memory | Increase server size or optimize code |

---

## Next Steps

1. Choose deployment platform (recommend DigitalOcean)
2. Deploy MongoDB database
3. Set up backend API
4. Update frontend with backend URL
5. Test authentication and appointments
6. Monitor logs and performance
7. Set up backups

Need help with any specific step? Let me know!
