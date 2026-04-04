# Deploy Your Appointment System Online Using AWS

## Option 1: AWS S3 + CloudFront (Recommended for Cost-Effective Hosting)

### Prerequisites:
1. AWS Account (free tier available)
2. AWS CLI installed
3. Your frontend built and ready

---

## Step 1: Build Your React Application

```bash
# Navigate to frontend directory
cd frontend

# Create an optimized production build
npm run build
```

This creates a `build/` folder with optimized files ready for deployment.

---

## Step 2: Create AWS S3 Bucket

### Via AWS Console:
1. Go to https://s3.console.aws.amazon.com
2. Click **"Create bucket"**
3. **Bucket name**: `appointment-booking-app` (must be globally unique)
4. **Region**: Select your closest region (e.g., us-east-1)
5. **Block Public Access**: Keep unchecked (need it public)
6. Click **"Create bucket"**

### Via AWS CLI:
```bash
aws s3 mb s3://appointment-booking-app --region us-east-1
```

---

## Step 3: Configure Bucket for Web Hosting

### Via AWS Console:
1. Go to your S3 bucket
2. Click **Properties** tab
3. Scroll to **Static website hosting**
4. Click **Edit**
5. Enable **Static website hosting**
6. **Index document**: `index.html`
7. **Error document**: `index.html` (for React routing)
8. Click **Save changes**

### Via AWS CLI:
```bash
aws s3 website s3://appointment-booking-app \
    --index-document index.html \
    --error-document index.html
```

---

## Step 4: Create Bucket Policy (Make It Public)

### Via AWS Console:
1. Go to **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste this policy (replace with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::appointment-booking-app/*"
        }
    ]
}
```

5. Click **Save changes**

### Via AWS CLI:
```bash
aws s3api put-bucket-policy --bucket appointment-booking-app \
    --policy file://bucket-policy.json
```

---

## Step 5: Upload Your Build Files to S3

### Via AWS Console:
1. Click **Upload** button
2. Click **Add files**
3. Navigate to `frontend/build/` folder
4. Select all files and folders
5. Click **Upload**

### Via AWS CLI (Faster):
```bash
# Navigate to build folder
cd frontend/build

# Sync all files to S3
aws s3 sync . s3://appointment-booking-app/ \
    --delete \
    --cache-control max-age=31536000

# Update index.html to not cache
aws s3 cp index.html s3://appointment-booking-app/index.html \
    --cache-control no-cache
```

---

## Step 6: Enable CloudFront (Optional but Recommended)

CloudFront makes your app faster globally and provides HTTPS.

### Via AWS Console:
1. Go to CloudFront console: https://console.aws.amazon.com/cloudfront
2. Click **Create distribution**
3. **Origin domain**: Select your S3 bucket
4. **Viewer protocol policy**: Redirect HTTP to HTTPS
5. **Cache policy**: CachingOptimized
6. **Origin request policy**: CORS-S3Origin
7. Create custom error response:
   - HTTP error code: **404**
   - Error caching minimum TTL: **0**
   - Customize error response: Yes
   - Response page path: `/index.html`
   - HTTP response code: **200**
8. Repeat for error code **403**
9. Click **Create distribution**

This takes 5-10 minutes to deploy.

---

## Step 7: Configure Backend URL

Your React app needs to communicate with your backend API.

### Update your API configuration:

**frontend/src/services/api.js** - Change your API base URL:

```javascript
const API_BASE_URL = 'https://your-backend-domain.com';
// Or if backend is on same domain:
const API_BASE_URL = '/api';
```

If backend is separate, build again:
```bash
npm run build
aws s3 sync build/ s3://appointment-booking-app/ --delete
```

---

## Access Your App

Once deployed:
- **S3 Website URL**: `http://appointment-booking-app.s3-website-us-east-1.amazonaws.com`
- **CloudFront URL**: `https://d123abcdef.cloudfront.net` (check CloudFront console)

---

## Step 8: (Optional) Add Custom Domain

### Using Route 53:
1. Buy domain via Route 53 or connect existing domain
2. Create alias record pointing to CloudFront distribution
3. Enable SSL certificate (AWS Certificate Manager - free!)

---

## Deployment Commands (Quick Reference)

```bash
# Build frontend
cd frontend && npm run build

# Configure AWS CLI with credentials
aws configure

# Upload to S3
aws s3 sync build/ s3://appointment-booking-app/ --delete

# Invalidate CloudFront cache (if using CloudFront)
aws cloudfront create-invalidation \
    --distribution-id YOUR_DISTRIBUTION_ID \
    --paths "/*"
```

---

## Cost Estimate (AWS Free Tier)

- **S3 Storage**: 5GB free per month
- **CloudFront**: 50GB free data transfer per month
- **Total**: **FREE** for first year if within free tier limits

---

## Environment Configuration for Production

Create a `.env.production` file:

```bash
REACT_APP_API_URL=https://your-backend-api.com
REACT_APP_ENVIRONMENT=production
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Access Denied" | Check bucket policy is correctly set |
| Index.html returns 404 | Make sure S3 static website hosting is enabled |
| CORS errors | Configure CORS in backend or S3 bucket CORS settings |
| App won't load | Check CloudFront cache settings, may need invalidation |
| Broken frontend after update | Run invalidation command above |

---

## Alternative: Simpler Platforms

If AWS is too complex, use:

### **Vercel** (Easiest)
```bash
npm i -g vercel
vercel
```
- Deploy in 30 seconds
- Free tier available
- Automatic HTTPS & CDN

### **Netlify**
- Drag & drop deploy
- Free tier
- GitHub integration

### **GitHub Pages**
- Completely free
- No backend support though

---

## Next Steps
1. Set up AWS account
2. Follow steps 1-5 above
3. Test your deployed app
4. Configure your backend URL in frontend
5. Deploy backend separately (DigitalOcean App Platform recommended - $5/month)

Would you like help with any specific step?
