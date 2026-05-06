# AWS EC2 Setup & Auto-Deploy Guide

Complete step-by-step guide to deploy StudentLogger on AWS EC2 with GitHub Actions auto-deploy.

---

## Part 1: Create AWS EC2 Instance

### Step 1.1: Launch EC2 Instance

1. Go to [AWS Console](https://aws.amazon.com/console/)
2. Search for **EC2** and click **Instances**
3. Click **Launch Instances** button
4. Name your instance: `studentlogger`

### Step 1.2: Choose AMI (Image)

1. Select **Ubuntu Server 24.04 LTS** (Free Tier eligible)
2. Architecture: **64-bit (x86)**
3. Click **Select**

### Step 1.3: Instance Type

1. Instance type: **t2.micro** (Free Tier)
2. Click **Next: Configure Instance Details**

### Step 1.4: Configure Instance

1. Number of instances: `1`
2. Network: `Default VPC`
3. Auto-assign public IP: **Enable**
4. Click **Next: Add Storage**

### Step 1.5: Add Storage

1. Size: **20 GB** (Free Tier: up to 30 GB)
2. Volume type: **gp3** (General Purpose)
3. Delete on termination: **Checked** ✓
4. Click **Next: Add Tags**

### Step 1.6: Add Tags

1. Add tag:
   - Key: `Name`
   - Value: `studentlogger`
2. Click **Next: Configure Security Group**

### Step 1.7: Security Group

1. Security group name: `studentlogger-sg`
2. Add these inbound rules:

| Type | Protocol | Port | Source |
|------|----------|------|--------|
| SSH | TCP | 22 | 0.0.0.0/0 (or your IP) |
| HTTP | TCP | 80 | 0.0.0.0/0 |
| HTTPS | TCP | 443 | 0.0.0.0/0 |
| Custom TCP | TCP | 5000 | 0.0.0.0/0 |
| Custom TCP | TCP | 3000 | 0.0.0.0/0 |

3. Click **Review and Launch**

### Step 1.8: Review & Launch

1. Review all settings
2. Click **Launch**
3. **Create a new key pair:**
   - Key pair name: `studentlogger-key`
   - Key pair type: `RSA`
   - Click **Download Key Pair** (saves `.pem` file)
   - Save this file securely! You'll need it to connect.

4. Click **Launch Instances**
5. Wait 1-2 minutes for instance to start (Status: `running`)

---

## Part 2: Connect to EC2 Instance

### Step 2.1: Get Instance Info

1. Go to **EC2 > Instances**
2. Select your `studentlogger` instance
3. Copy the **Public IPv4 address** (e.g., `54.123.45.67`)

### Step 2.2: Connect via SSH (Mac/Linux)

```bash
# Navigate to where you downloaded the key
cd ~/Downloads

# Set key permissions (required)
chmod 400 studentlogger-key.pem

# Connect to instance
ssh -i studentlogger-key.pem ubuntu@54.123.45.67
```

### Step 2.2b: Connect via SSH (Windows)

**Option 1: Using PowerShell (Windows 10+)**
```powershell
# Navigate to key directory
cd Downloads

# Connect
ssh -i studentlogger-key.pem ubuntu@54.123.45.67
```

**Option 2: Using PuTTY (Windows)**
1. Download [PuTTY](https://www.putty.org/)
2. Download [PuTTYgen](https://www.puttygen.com/)
3. Use PuTTYgen to convert `.pem` → `.ppk`
4. Open PuTTY, enter IP, select `.ppk` key, connect

### Step 2.3: First Login

You should see:
```
ubuntu@ip-172-31-xxx-xxx:~$
```

---

## Part 3: Set Up Server Environment

### Step 3.1: Update System

```bash
# Update package lists
sudo apt update

# Upgrade packages
sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git
```

### Step 3.2: Install Node.js

```bash
# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3.3: Install PM2 (Process Manager)

PM2 keeps your app running and auto-restarts on crashes:

```bash
# Install PM2 globally
sudo npm install -g pm2

# Enable PM2 on startup
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/local/lib/node_modules/pm2/bin/pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### Step 3.4: Install Nginx (Reverse Proxy)

Nginx will forward traffic to your Node.js app:

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify it's running
sudo systemctl status nginx
```

### Step 3.5: Install SSL Certificates (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate (you'll need a domain first)
# We'll do this in Step 5
```

---

## Part 4: Clone & Deploy Application

### Step 4.1: Clone Repository

```bash
# Clone your GitHub repo
git clone https://github.com/pjanak/studentlogger.git

# Navigate to directory
cd studentlogger

# Check what's there
ls -la
```

### Step 4.2: Set Up Frontend Environment

```bash
# Install frontend dependencies
npm install

# Build frontend
npm run build

# Check build output
ls -la dist/
```

### Step 4.3: Set Up Backend Environment

```bash
# Navigate to backend
cd backend

# Install backend dependencies
npm install

# Create .env file
nano .env
```

In the editor, paste this:
```env
PORT=5000
FRONTEND_URL=http://YOUR_IP:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=p.janak@gmail.com
NODE_ENV=production
```

Replace:
- `YOUR_IP` with your EC2 public IP
- `your-email@gmail.com` with your Gmail
- `your-app-password` with your Gmail app password

**To save:** Press `Ctrl+O`, then `Enter`, then `Ctrl+X`

### Step 4.4: Test Backend Locally

```bash
# Still in backend directory
npm run dev

# You should see: "Backend server running on port 5000"
```

**Stop it:** Press `Ctrl+C`

### Step 4.5: Start Backend with PM2

```bash
# In backend directory
pm2 start server.js --name "studentlogger-backend"

# Save PM2 configuration
pm2 save

# Check status
pm2 status
```

You should see: `online` status

---

## Part 5: Configure Nginx & HTTPS

### Step 5.1: Configure Nginx

```bash
# Go back to home
cd ~

# Create Nginx config
sudo nano /etc/nginx/sites-available/studentlogger
```

Paste this configuration:
```nginx
# Frontend and Backend Reverse Proxy
server {
    listen 80;
    server_name _;  # Replace with your domain later

    # Frontend (React build)
    location / {
        root /home/ubuntu/studentlogger/dist;
        try_files $uri /index.html;
        expires 1d;
        add_header Cache-Control "public, immutable";
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:5000;
    }
}
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

### Step 5.2: Enable Nginx Config

```bash
# Create symlink to enable site
sudo ln -s /etc/nginx/sites-available/studentlogger /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# You should see: "test is successful"

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5.3: Test Backend API

```bash
# Test the health endpoint
curl http://localhost:5000/health

# You should see: {"status":"ok"}
```

### Step 5.4: Set Up HTTPS (Optional but Recommended)

**First, point your domain to this IP:**

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Find **DNS Settings**
3. Add/Edit **A Record**:
   - Name: `@` (root domain)
   - Type: `A`
   - Value: Your EC2 public IP (e.g., `54.123.45.67`)
4. Save and wait 5-10 minutes for DNS to propagate

**Then get SSL certificate:**

```bash
# Get certificate for your domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Enter your email when prompted
# Accept terms
# Certbot auto-configures Nginx!

# Verify HTTPS works
curl https://yourdomain.com
```

---

## Part 6: Set Up GitHub Auto-Deploy

### Step 6.1: Create Deployment Key

On your EC2 instance:

```bash
# Generate SSH key for GitHub
ssh-keygen -t rsa -b 4096 -f ~/.ssh/github-deploy-key -N ""

# Display the public key
cat ~/.ssh/github-deploy-key.pub
```

Copy the output (starts with `ssh-rsa`)

### Step 6.2: Add Deploy Key to GitHub

1. Go to GitHub: **Settings > Deploy keys**
2. Click **Add deploy key**
3. Title: `EC2 Deployment`
4. Paste the public key from above
5. Check **Allow write access**
6. Click **Add key**

### Step 6.3: Configure Git on EC2

```bash
# Set git user (for commits)
git config --global user.email "noreply@github.com"
git config --global user.name "GitHub Deploy"

# Add GitHub to known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Test SSH connection
ssh -i ~/.ssh/github-deploy-key git@github.com

# Should succeed without password
```

### Step 6.4: Create Deployment Script

```bash
# Create deploy script
nano ~/deploy.sh
```

Paste this:
```bash
#!/bin/bash

# Log all output
set -e
echo "=== Starting deployment at $(date) ===" >> ~/deploy.log

cd /home/ubuntu/studentlogger

# Pull latest code
echo "Pulling latest code..." >> ~/deploy.log
git pull origin main

# Install/update dependencies
echo "Installing frontend dependencies..." >> ~/deploy.log
npm install

echo "Building frontend..." >> ~/deploy.log
npm run build

# Update backend
echo "Installing backend dependencies..." >> ~/deploy.log
cd backend
npm install

# Restart backend
echo "Restarting backend..." >> ~/deploy.log
pm2 restart studentlogger-backend

# Restart Nginx (reload frontend)
sudo systemctl reload nginx

echo "=== Deployment completed at $(date) ===" >> ~/deploy.log
```

**Save:** `Ctrl+O`, `Enter`, `Ctrl+X`

Make it executable:
```bash
chmod +x ~/deploy.sh
```

### Step 6.5: Set Up GitHub Actions Workflow

On your local machine, create this file:

`.github/workflows/deploy-to-aws.yml`

```yaml
name: Deploy to AWS EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.AWS_EC2_HOST }}
          username: ubuntu
          key: ${{ secrets.AWS_EC2_KEY }}
          script: /home/ubuntu/deploy.sh

      - name: Notify Deployment
        if: success()
        run: echo "✅ Deployment to AWS successful!"

      - name: Notify Failure
        if: failure()
        run: echo "❌ Deployment failed!"
```

Push this file to GitHub:
```bash
git add .github/workflows/deploy-to-aws.yml
git commit -m "Add GitHub Actions auto-deploy workflow"
git push origin main
```

### Step 6.6: Add GitHub Secrets

1. Go to GitHub: **Settings > Secrets and variables > Actions**
2. Click **New repository secret**
3. Add these secrets:

**Secret 1: AWS_EC2_HOST**
- Name: `AWS_EC2_HOST`
- Value: Your EC2 public IP (e.g., `54.123.45.67`)

**Secret 2: AWS_EC2_KEY**
- Name: `AWS_EC2_KEY`
- Value: Contents of `~/.ssh/github-deploy-key` from your EC2 instance

To get the key:
```bash
# On EC2
cat ~/.ssh/github-deploy-key
```

Copy the entire output (starts with `-----BEGIN` and ends with `-----END`)

---

## Part 7: Test Everything

### Step 7.1: Manual Deploy Test

On EC2:
```bash
# Run deploy script manually
~/deploy.sh

# Check logs
tail -f ~/deploy.log
```

### Step 7.2: Test Website

1. Open your browser
2. Go to `http://YOUR_IP` (or `https://yourdomain.com` if using domain)
3. You should see your StudentLogger site

### Step 7.3: Test Contact Form

1. Fill out the contact form
2. Click "Send Inquiry"
3. Check email for confirmation
4. Check your `ADMIN_EMAIL` for the inquiry notification

### Step 7.4: Test Auto-Deploy

1. Make a change to your code locally
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Test auto-deploy"
   git push origin main
   ```
3. Go to GitHub: **Actions** tab
4. Watch the workflow run
5. Check that your EC2 is updated automatically

---

## Part 8: Monitoring & Maintenance

### Step 8.1: Monitor Logs

```bash
# Backend logs
pm2 logs studentlogger-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log

# Deployment logs
tail -f ~/deploy.log
```

### Step 8.2: Check Server Health

```bash
# Backend status
curl http://localhost:5000/health

# Check processes
pm2 status

# Check disk space
df -h

# Check memory
free -h
```

### Step 8.3: Auto-Restart on Reboot

```bash
# Save PM2 process list
pm2 save

# Make PM2 startup on reboot
pm2 startup
```

### Step 8.4: Update Security Groups

If you need to restrict SSH access (recommended for production):

1. Go to **EC2 > Security Groups**
2. Select `studentlogger-sg`
3. Edit SSH rule:
   - Source: Your IP only (not 0.0.0.0/0)
   - Get your IP: `curl ifconfig.me`

---

## Part 9: Troubleshooting

### Issue: Can't connect via SSH

```bash
# Check security group allows port 22
# Check key permissions
chmod 400 studentlogger-key.pem

# Try again
ssh -i studentlogger-key.pem ubuntu@54.123.45.67
```

### Issue: Website shows blank page

```bash
# Check frontend build
ls -la /home/ubuntu/studentlogger/dist/

# Check Nginx status
sudo systemctl status nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### Issue: Form not submitting

```bash
# Check backend is running
pm2 status

# Check backend logs
pm2 logs studentlogger-backend

# Check API responds
curl http://localhost:5000/health
```

### Issue: Auto-deploy not working

1. Check GitHub Actions tab for errors
2. Verify secrets are set correctly
3. Check EC2 deploy script:
   ```bash
   bash -x ~/deploy.sh
   ```

### Issue: HTTPS certificate not working

```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run

# Check Nginx config
sudo nginx -t
```

---

## Summary

You now have:
✅ AWS EC2 instance running
✅ Node.js and PM2 installed
✅ Frontend built and served via Nginx
✅ Backend running on port 5000
✅ HTTPS SSL certificates (optional)
✅ GitHub Actions auto-deploy
✅ Email notifications configured

Every time you push to GitHub `main` branch, your site auto-updates!

---

## Next Steps

1. Set up domain (point DNS to EC2 IP)
2. Configure HTTPS with Let's Encrypt
3. Monitor logs regularly
4. Set up backups (optional)
5. Monitor costs (free tier limits)

---

## Cost Calculator (Free Tier)

- EC2 t2.micro: Free for 12 months
- 30 GB storage: Free
- Data transfer: ~1 GB/month free (StudentLogger is ~2 MB)
- **Total: $0/month** (first year)

After 12 months:
- EC2 t2.micro: ~$9/month
- Storage: ~$1/month
- **Total: ~$10/month**
