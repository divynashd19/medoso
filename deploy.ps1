# AWS S3 Deployment Script for Windows PowerShell
# Deployment script for Appointment Booking System to AWS S3

# Configuration
$BucketName = "appointment-booking-app"
$Region = "us-east-1"
$FrontendDir = "frontend"
$BuildDir = "$FrontendDir\build"

# Colors for output
function Write-Info {
    Write-Host "✓ $args" -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host "✗ $args" -ForegroundColor Red
}

function Write-Warning-Custom {
    Write-Host "! $args" -ForegroundColor Yellow
}

# Start deployment
Write-Host "================================" -ForegroundColor Cyan
Write-Host "AWS S3 Deployment Script (Windows)" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if AWS CLI is installed
Write-Info "Checking AWS CLI installation..."
try {
    $null = aws --version
    Write-Info "AWS CLI is installed"
} catch {
    Write-Error-Custom "AWS CLI is not installed."
    Write-Host "Download from: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}

# Step 2: Check AWS credentials
Write-Info "Checking AWS credentials..."
try {
    $null = aws sts get-caller-identity
    Write-Info "AWS credentials verified"
} catch {
    Write-Warning-Custom "AWS credentials not found. Running 'aws configure'..."
    aws configure
}

# Step 3: Build React app
Write-Info "Building React application..."
Set-Location $FrontendDir
npm install
npm run build
Set-Location ..
Write-Info "React app built successfully"

# Step 4: Check if bucket exists
Write-Info "Checking if S3 bucket exists..."
try {
    $null = aws s3 ls "s3://$BucketName" 2>$null
    Write-Info "Bucket '$BucketName' already exists"
} catch {
    Write-Warning-Custom "Bucket '$BucketName' does not exist. Creating..."
    aws s3 mb "s3://$BucketName" --region $Region
    Write-Info "Bucket created successfully"
}

# Step 5: Configure bucket for static website hosting
Write-Info "Configuring S3 bucket for static website hosting..."
aws s3 website "s3://$BucketName" `
    --index-document index.html `
    --error-document index.html

# Step 6: Upload files to S3
Write-Info "Uploading files to S3..."
aws s3 sync "$BuildDir\" "s3://$BucketName/" `
    --delete `
    --cache-control max-age=31536000

# Update index.html to not cache
aws s3 cp "$BuildDir\index.html" "s3://$BucketName/index.html" `
    --cache-control no-cache

Write-Info "Files uploaded to S3"

# Step 7: Display S3 website URL
$S3Url = "http://$BucketName.s3-website-$Region.amazonaws.com"
Write-Host ""
Write-Info "Deployment completed!"
Write-Host ""
Write-Host "📌 Your app is now available at:" -ForegroundColor Cyan
Write-Host "   $S3Url" -ForegroundColor Yellow
Write-Host ""
Write-Warning-Custom "Note: This URL is HTTP. For HTTPS and better performance, set up CloudFront."
Write-Host ""

# Next steps
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test your app at the URL above" -ForegroundColor Gray
Write-Host "   2. Configure backend API URL in frontend\.env" -ForegroundColor Gray
Write-Host "   3. (Optional) Set up CloudFront for HTTPS" -ForegroundColor Gray
Write-Host "   4. (Optional) Connect custom domain via Route 53" -ForegroundColor Gray
Write-Host ""
