# AWS Deployment Setup Guide

This guide will help you deploy the StudentLogger React app to AWS for free using S3 + CloudFront.

## Prerequisites

- AWS Account (free tier)
- GitHub account
- AWS CLI installed locally (optional)

## Step 1: Create an S3 Bucket

1. Go to [AWS S3 Console](https://s3.console.aws.amazon.com/)
2. Click "Create bucket"
3. Enter bucket name: `studentlogger-domain` (must be globally unique)
4. Choose region: `us-east-1`
5. Uncheck "Block all public access"
6. Acknowledge the warning and create bucket

## Step 2: Configure S3 Bucket for Static Website Hosting

1. Go to the bucket settings
2. Click "Properties" tab
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable "Static website hosting"
6. Set index document: `index.html`
7. Set error document: `index.html`
8. Save

## Step 3: Create CloudFront Distribution (Optional but Recommended)

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Click "Create distribution"
3. Origin domain: Select your S3 bucket
4. Origin access: Select "Origin access control (recommended)"
5. Create a new OAC for S3
6. Default cache behavior:
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Compress objects automatically: Yes
7. Create distribution
8. Copy the **Distribution ID** - you'll need this later

## Step 4: Create IAM User for GitHub Actions

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click "Users" → "Create user"
3. Username: `github-actions-student-logger`
4. Click "Next"
5. Attach policies:
   - `AmazonS3FullAccess` (or custom policy below)
   - `CloudFrontFullAccess` (if using CloudFront)
6. Create user

### Custom S3 Policy (Recommended for Security)

Create a custom policy with this JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::studentlogger-domain/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::studentlogger-domain"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

## Step 5: Create Access Keys for IAM User

1. Go to the new IAM user
2. Click "Security credentials" tab
3. Click "Create access key"
4. Choose "Application running outside AWS"
5. Create access key
6. Copy the **Access Key ID** and **Secret Access Key** - save these securely!

## Step 6: Add GitHub Secrets

1. Go to your GitHub repo settings
2. Click "Secrets and variables" → "Actions"
3. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your IAM access key ID |
| `AWS_SECRET_ACCESS_KEY` | Your IAM secret access key |
| `AWS_S3_BUCKET` | `studentlogger-domain` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID (optional) |

## Step 7: Deploy!

1. Push changes to the `main` branch
2. GitHub Actions will automatically:
   - Build your React app
   - Upload to S3
   - Invalidate CloudFront cache
3. Your site will be live at the CloudFront URL!

## Getting Your CloudFront URL

1. Go to [CloudFront Console](https://console.aws.amazon.com/cloudfront/)
2. Find your distribution
3. Copy the **Domain name** - this is your public URL

## Cost

This setup is completely FREE on AWS free tier:
- S3: 5 GB storage free
- CloudFront: 1 TB data transfer free per month
- Total cost: $0/month

## Troubleshooting

### Deployment fails with "Access Denied"

- Verify IAM user has S3 and CloudFront permissions
- Check that AWS credentials in GitHub secrets are correct

### Site shows old version

- CloudFront caches for 24 hours
- To force update: Go to CloudFront → Invalidations → Create invalidation → Enter `/*`

### S3 bucket access denied

- Ensure bucket policy allows public read access
- Or configure CloudFront to access via Origin Access Control (OAC)

## Manual Deployment

If you want to deploy manually:

```bash
# Build the app
npm run build

# Install AWS CLI (if not already installed)
# pip install awscli

# Deploy to S3
aws s3 sync dist/ s3://studentlogger-domain/ --delete

# Clear CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Alternative: Deploy to EC2 (Advanced)

If you prefer an EC2 instance:

1. Launch a free tier t2.micro EC2 instance
2. SSH into the instance
3. Install Node.js and npm
4. Clone the GitHub repo
5. Run `npm install && npm run build`
6. Serve the `dist/` folder with a web server (nginx, Apache, or Node.js)

See EC2_DEPLOYMENT.md for detailed steps.
