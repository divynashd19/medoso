# Complete AWS Deployment Guide (Step-by-Step with Screenshots)

## Quick Summary
Deploy your React app to AWS S3 + optionally CloudFront for a live, secure URL that's accessible worldwide.

---

## 📋 Prerequisites Checklist

- [ ] AWS Account created (free tier available at: https://aws.amazon.com)
- [ ] Your React app built locally
- [ ] (Optional) AWS CLI installed for faster deployment
- [ ] (Optional) Custom domain (if you want your own URL)

---

## 🚀 Method 1: Easy Deployment via AWS Console (No Command Line)

### Step 1: Build Your App

Open PowerShell in your project folder and run:

```powershell
cd frontend
npm run build
```

A `build` folder will be created with ready-to-upload files.

---

### Step 2: Create AWS S3 Bucket

1. Go to https://s3.console.aws.amazon.com
2. Click **"Create bucket"** button
3. **Bucket name**: Enter a unique name
   - Example: `myapptookingbooking-2024`
   - Must be lowercase, no special characters
   - Must be globally unique (no one else can use same name)
4. **AWS Region**: Select closest to your users
   - US: `us-east-1` (Virginia)
   - EU: `eu-west-1` (Ireland)
   - Asia: `ap-southeast-1` (Singapore)
5. Block Public Access settings:
   - **Uncheck**: Block all public access
   - **Check**: "I understand the risks"
6. Click **"Create bucket"** at bottom

✅ Bucket created!

---

### Step 3: Enable Static Website Hosting

1. Click on your newly created bucket
2. Go to **"Properties"** tab (rightmost tab)
3. Scroll down to **"Static website hosting"**
4. Click **"Edit"** button
5. Select **"Enable"**
6. Index document: `index.html`
7. Error document: `index.html` (important for React routing!)
8. Click **"Save changes"**

✅ Website hosting enabled!

---

### Step 4: Make Bucket Public

1. Go to **"Permissions"** tab
2. Scroll to **"Bucket policy"**
3. Click **"Edit"**
4. Copy and paste this policy (replace `myappbooking-2024` with YOUR bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::myappbooking-2024/*"
        }
    ]
}
```

5. Click **"Save changes"**

✅ Bucket is now public!

---

### Step 5: Upload Your App Files

1. Go to **"Objects"** tab (second tab)
2. Click **"Upload"** button
3. Click **"Add files"**
4. Navigate to your `frontend/build/` folder
5. **Select ALL files and folders** (Ctrl+A)
6. Click **"Upload"** button at bottom right
7. Wait for upload to complete (usually 30 seconds - 2 minutes)

✅ Files uploaded!

---

### Step 6: Get Your Live URL

1. Go back to Properties tab
2. Scroll to "Static website hosting"
3. Copy the **"Bucket website endpoint"**
   - Format: `http://myappbooking-2024.s3-website-us-east-1.amazonaws.com`

🎉 **Your app is LIVE!** Open that URL in browser.

---

## ⚡ Method 2: Fast Deployment via AWS CLI (Advanced)

### Prerequisites:
1. AWS CLI installed: https://aws.amazon.com/cli/
2. AWS credentials configured: Run `aws configure` in terminal

### Run deployment:

Open PowerShell in your project folder:

```powershell
# Option 1: Use automated script (Windows)
.\deploy.ps1

# Option 2: Manual commands
cd frontend
npm run build
cd ..

# Upload to S3
aws s3 sync frontend/build/ s3://myappbooking-2024/ --delete

# Make index.html not cache (so users get latest version)
aws s3 cp frontend/build/index.html s3://myappbooking-2024/index.html --cache-control no-cache
```

---

## 🌍 Step 7: Configure Backend API URL (Important!)

Your React app needs to know where your backend is.

### Option A: Backend on Same Server (Recommended for Security)

Update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-domain.com/api';
```

Then rebuild and redeploy:
```powershell
cd frontend
npm run build
aws s3 sync build/ s3://your-bucket-name/ --delete
```

### Option B: Backend on Different Server

1. Create `.env.production` file in frontend folder:

```
REACT_APP_API_URL=https://your-backend-api.example.com
```

2. Update `api.js` to use it:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

---

## 🔒 Optional: Add HTTPS with CloudFront

CloudFront provides:
- ✅ HTTPS (secure connection)
- ✅ Faster loading worldwide (CDN)
- ✅ Better performance
- ✅ Free SSL certificate
- ✅ 50GB data transfer free per month

### Setup CloudFront:

1. Go to https://console.aws.amazon.com/cloudfront
2. Click **"Create distribution"**
3. **Origin domain**: Select your S3 bucket
4. **Default root object**: `index.html`
5. **Viewer protocol policy**: "Redirect HTTP to HTTPS"
6. Click **"Create distribution"** button

⏳ Wait 5-10 minutes for deployment...

Once ready:
- Go to **Distributions** tab
- Copy **"Domain name"** (format: `d123abc.cloudfront.net`)
- Use that URL instead of S3 URL

---

## 🎯 Optional: Use Custom Domain

### Steps:
1. Buy a domain (Route 53, GoDaddy, Namecheap, etc.)
2. In Route 53:
   - Create **Alias record** pointing to CloudFront distribution
3. AWS Certificate Manager:
   - Create free SSL certificate for your domain
   - Attach to CloudFront

Now your app has: `https://yourappname.com` ✨

---

## 📱 How to Update Your App

Whenever you update code:

```powershell
# 1. Build updated app
cd frontend
npm run build

# 2. Upload to S3 (replace your bucket name)
aws s3 sync build/ s3://your-bucket-name/ --delete

# 3. If using CloudFront, clear cache (optional but recommended)
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 💰 Estimated Costs

### AWS Free Tier (First 12 months):
- **S3 Storage**: 5GB free
- **Data transfer**: 1GB free per month
- **CloudFront**: 50GB free per month
- **Total**: **$0** if under limits

### After free tier:
- S3 storage: $0.023 per GB
- CloudFront: $0.085 per GB
- **Estimated monthly**: $0-5 for small app

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Access Denied" error | Make sure bucket policy is correctly set (Step 4) |
| Shows 404 on main URL | Ensure error document is set to `index.html` (Step 3) |
| Changes not reflecting | CloudFront caching - create invalidation or clear cache |
| CORS errors from backend | Configure CORS in backend or S3 CORS settings |
| App won't load | Check browser console for errors, verify API URL |

---

## 🚀 Final Checklist

- [ ] AWS account created
- [ ] S3 bucket created
- [ ] Static website hosting enabled
- [ ] Bucket made public (bucket policy added)
- [ ] Build files uploaded
- [ ] App is accessible at S3 URL
- [ ] Backend API URL configured
- [ ] (Optional) CloudFront set up for HTTPS
- [ ] (Optional) Custom domain configured
- [ ] Tested app in browser

---

## ✅ Success!

Your appointment booking system is now **LIVE and accessible online!**

### Your URLs:
- **S3 Bucket URL** (HTTP): `http://your-bucket.s3-website-region.amazonaws.com`
- **CloudFront URL** (HTTPS): `https://d123abc.cloudfront.net`
- **Custom Domain** (HTTPS): `https://yourdomain.com`

---

## Next Steps

1. **Deploy Backend**: 
   - DigitalOcean App Platform ($5/month)
   - AWS EC2 ($7-12/month)
   - Heroku ($7/month)

2. **Monitor Performance**:
   - Use AWS CloudWatch
   - Monitor errors and traffic

3. **Custom Domain**:
   - Point to CloudFront distribution
   - Add SSL certificate

4. **Database**:
   - MongoDB Atlas (cloud MongoDB, free tier available)
   - AWS RDS

Need help with backend deployment or database setup?
