#!/bin/bash

# StudentLogger.com Deployment Script
# Usage: ./deploy.sh <ec2_host> <ec2_user> <ec2_key_path> [deploy_path]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
EC2_HOST="${1:-3.10.219.108}"
EC2_USER="${2:-ubuntu}"
EC2_KEY="${3:-~/.ssh/studentlogger.pem}"
DEPLOY_PATH="${4:-/home/ubuntu/studentlogger}"
LOCAL_DIST="./dist"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}StudentLogger.com Deployment Script${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Check if dist directory exists
if [ ! -d "$LOCAL_DIST" ]; then
    echo -e "${RED}❌ Error: dist/ directory not found${NC}"
    echo "Please run 'npm run build' first"
    exit 1
fi

echo -e "${GREEN}✓ dist/ directory found${NC}"
echo -e "${YELLOW}Target Server: ${EC2_USER}@${EC2_HOST}:${DEPLOY_PATH}${NC}\n"

# Expand home directory in key path
EC2_KEY="${EC2_KEY/#\~/$HOME}"

# Check if SSH key exists
if [ ! -f "$EC2_KEY" ]; then
    echo -e "${RED}❌ Error: SSH key not found at ${EC2_KEY}${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SSH key found${NC}\n"

# Test SSH connection
echo -e "${YELLOW}Testing SSH connection...${NC}"
if ! ssh -i "$EC2_KEY" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" "echo 'SSH connection successful'" > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Cannot connect to ${EC2_USER}@${EC2_HOST}${NC}"
    echo "Please verify:"
    echo "  1. EC2 instance is running"
    echo "  2. Security group allows SSH (port 22)"
    echo "  3. SSH key has correct permissions (chmod 600)"
    exit 1
fi

echo -e "${GREEN}✓ SSH connection successful${NC}\n"

# Deploy
echo -e "${YELLOW}Deploying files...${NC}"

# Create deployment directory
ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" \
    "mkdir -p ${DEPLOY_PATH}/dist"

# Remove old files
echo -e "${YELLOW}Removing old deployment...${NC}"
ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" \
    "rm -rf ${DEPLOY_PATH}/dist/* || true"

# Copy new files
echo -e "${YELLOW}Copying new files via SCP...${NC}"
scp -i "$EC2_KEY" -o StrictHostKeyChecking=no -r "${LOCAL_DIST}/" \
    "${EC2_USER}@${EC2_HOST}:${DEPLOY_PATH}/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error: SCP transfer failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Files copied successfully${NC}\n"

# Copy Nginx config if it exists
if [ -f "./nginx.conf" ]; then
    echo -e "${YELLOW}Copying Nginx configuration...${NC}"
    scp -i "$EC2_KEY" -o StrictHostKeyChecking=no "./nginx.conf" \
        "${EC2_USER}@${EC2_HOST}:${DEPLOY_PATH}/"
    echo -e "${GREEN}✓ Nginx config copied${NC}\n"
fi

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" \
    "sudo systemctl reload nginx"

if [ $? -ne 0 ]; then
    echo -e "${RED}⚠️  Warning: Nginx reload may have failed${NC}"
    echo "Check server logs: ssh ${EC2_USER}@${EC2_HOST} 'sudo systemctl status nginx'"
else
    echo -e "${GREEN}✓ Nginx reloaded successfully${NC}\n"
fi

# Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
if ssh -i "$EC2_KEY" -o StrictHostKeyChecking=no "${EC2_USER}@${EC2_HOST}" \
    "test -f ${DEPLOY_PATH}/dist/index.html"; then
    echo -e "${GREEN}✓ Deployment verified${NC}\n"
else
    echo -e "${RED}❌ Error: index.html not found on server${NC}"
    exit 1
fi

# Final status
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ DEPLOYMENT SUCCESSFUL!${NC}"
echo -e "${GREEN}========================================${NC}\n"

echo "Next steps:"
echo "1. Visit https://studentlogger.com"
echo "2. Verify homepage loads"
echo "3. Test dark mode (press 'D' or check system preference)"
echo "4. Check console for errors"
echo -e "\nServer logs:"
echo "  Access: ssh ${EC2_USER}@${EC2_HOST} 'tail -f /var/log/nginx/studentlogger_access.log'"
echo "  Error:  ssh ${EC2_USER}@${EC2_HOST} 'tail -f /var/log/nginx/studentlogger_error.log'"
