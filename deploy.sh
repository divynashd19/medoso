#!/bin/bash

# Deployment script for Appointment Booking System to AWS S3

set -e  # Exit on error

echo "================================"
echo "AWS S3 Deployment Script"
echo "================================"
echo ""

# Configuration
BUCKET_NAME="appointment-booking-app"
REGION="us-east-1"
FRONTEND_DIR="frontend"
BUILD_DIR="$FRONTEND_DIR/build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

# Step 1: Check if AWS CLI is installed
print_info "Checking AWS CLI installation..."
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Install it from: https://aws.amazon.com/cli/"
    exit 1
fi
print_info "AWS CLI is installed"

# Step 2: Check AWS credentials
print_info "Checking AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_warning "AWS credentials not configured. Running 'aws configure'..."
    aws configure
fi
print_info "AWS credentials verified"

# Step 3: Build React app
print_info "Building React application..."
cd "$FRONTEND_DIR"
npm install
npm run build
cd ..
print_info "React app built successfully"

# Step 4: Check if bucket exists
print_info "Checking if S3 bucket exists..."
if aws s3 ls "s3://$BUCKET_NAME" 2>/dev/null; then
    print_info "Bucket '$BUCKET_NAME' already exists"
else
    print_warning "Bucket '$BUCKET_NAME' does not exist. Creating..."
    aws s3 mb "s3://$BUCKET_NAME" --region "$REGION"
    print_info "Bucket created successfully"
fi

# Step 5: Configure bucket for static website hosting
print_info "Configuring S3 bucket for static website hosting..."
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

# Step 6: Upload files to S3
print_info "Uploading files to S3..."
aws s3 sync "$BUILD_DIR/" "s3://$BUCKET_NAME/" \
    --delete \
    --cache-control max-age=31536000

# Update index.html to not cache
aws s3 cp "$BUILD_DIR/index.html" "s3://$BUCKET_NAME/index.html" \
    --cache-control no-cache

print_info "Files uploaded to S3"

# Step 7: Display S3 website URL
S3_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
print_info "Deployment completed!"
echo ""
echo "📌 Your app is now available at:"
echo "   $S3_URL"
echo ""
print_warning "Note: This URL is HTTP. For HTTPS and better performance, set up CloudFront."
echo ""

# Optional: Check for CloudFront distributions
if aws cloudfront list-distributions --query "DistributionList.Items[?contains(DomainName, '$BUCKET_NAME')]" &>/dev/null; then
    print_info "CloudFront distribution found!"
fi

echo ""
print_info "Next steps:"
echo "   1. Test your app at the URL above"
echo "   2. Configure backend API URL in frontend/.env"
echo "   3. (Optional) Set up CloudFront for HTTPS"
echo "   4. (Optional) Connect custom domain via Route 53"
echo ""
