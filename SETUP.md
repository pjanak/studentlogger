# StudentLogger Domain Sale - Setup Guide

## Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables

**Frontend** (`.env` file in root):
```env
VITE_API_URL=http://localhost:5000
```

**Backend** (`backend/.env` file):
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=p.janak@gmail.com
```

### 3. Run Both Servers

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

Frontend opens at `http://localhost:3000`
Backend runs at `http://localhost:5000`

---

## Email Setup

### Using Gmail (Recommended)

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App passwords** (only available with 2FA enabled)
4. Select **Mail** and **Windows Computer** (or your device)
5. Google generates a 16-character password
6. Copy this password to `backend/.env` as `EMAIL_PASSWORD`

**Example:**
```env
EMAIL_USER=p.janak@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Using Other Email Services

**SendGrid:**
```bash
cd backend
npm install @sendgrid/mail
```

Update `server.js` to use SendGrid instead of nodemailer.

**Mailgun:**
```bash
npm install mailgun.js
```

**AWS SES:**
```bash
npm install aws-sdk
```

---

## Security Features Implemented

### 1. **Rate Limiting**
- Max 5 inquiries per IP address per 15 minutes
- Prevents spam and abuse
- Returns `429 Too Many Requests` when exceeded

### 2. **Input Validation**
- Name: 2-100 characters, letters/spaces/hyphens only
- Email: Valid email format
- Message: 10-5000 characters
- All inputs trimmed and escaped to prevent XSS attacks

### 3. **Spam Detection**
- Blocks messages with suspicious keywords (viagra, casino, lottery, etc.)
- Limits links in message (max 2)
- Prevents common spam patterns

### 4. **CORS Protection**
- Only allows requests from frontend origin
- Configurable via `FRONTEND_URL` environment variable
- Prevents requests from malicious websites

### 5. **Security Headers**
- Helmet.js adds security headers (Content-Security-Policy, X-Frame-Options, etc.)
- Protects against common web vulnerabilities

### 6. **Payload Size Limit**
- Limited to 10KB maximum
- Prevents large payload attacks

### 7. **SQL Injection Prevention**
- No database used, so no SQL injection risk
- All inputs validated before processing

### 8. **CSRF Protection**
- Simple email form doesn't require CSRF token
- Added when integrating with database

---

## Configuration Reference

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Backend server port | `5000` |
| `FRONTEND_URL` | Frontend origin (CORS) | `http://localhost:3000` |
| `EMAIL_USER` | Sender email address | `p.janak@gmail.com` |
| `EMAIL_PASSWORD` | Email app password | `abcd efgh ijkl mnop` |
| `ADMIN_EMAIL` | Where to send inquiries | `p.janak@gmail.com` |
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## Monitoring & Logs

The backend logs all form submissions:
```
Inquiry received from user@example.com
```

Suspicious activity is logged:
```
Suspicious content detected from user@example.com
Too many links detected from user@example.com
```

---

## Production Deployment

### Before Deploying

1. **Update `FRONTEND_URL`** in backend `.env`:
   ```env
   FRONTEND_URL=https://yourdomain.com
   ```

2. **Use strong `EMAIL_PASSWORD`** (don't commit to git)

3. **Set `ADMIN_EMAIL`** to your email address

4. **Enable HTTPS** on production domain

5. **Use environment secrets** (never commit `.env`)

### Deployment Steps

**AWS EC2:**
1. SSH into your instance
2. Clone the repository
3. Install Node.js
4. Create `.env` files with production values
5. Run `npm install` in both directories
6. Use PM2 or systemd to run servers:
   ```bash
   pm2 start backend/server.js --name "studentlogger-backend"
   pm2 start npm -- run dev --name "studentlogger-frontend"
   ```

**Vercel/Netlify (Frontend):**
```bash
npm run build
# Deploy `dist/` folder
```

**AWS Lambda (Backend):**
Use serverless framework to deploy `backend/server.js`

---

## Testing

### Test the Form

1. Go to `http://localhost:3000`
2. Scroll to Contact section
3. Fill in: Name, Email, Message
4. Click "Send Inquiry"
5. Check your email for confirmation
6. Check `ADMIN_EMAIL` inbox for admin notification

### Test Rate Limiting

Submit 6 inquiries in a row (within 15 minutes):
- Requests 1-5: ✓ Success
- Request 6: ✗ "Too many inquiries from this IP"

### Test Spam Detection

Try submitting a message with:
- `viagra` or `casino` → Silently rejected
- `http://example.com http://example.com http://example.com` → Silently rejected
- Valid message → ✓ Accepted

---

## Troubleshooting

### "Email service ready" not showing
- Check `EMAIL_USER` and `EMAIL_PASSWORD` are correct
- For Gmail, use App Password, not regular password
- Enable "Less secure apps" if not using App Password

### CORS error in browser console
- Make sure `FRONTEND_URL` in backend matches your frontend URL
- Check both servers are running on correct ports

### "Too many inquiries" error
- Rate limit is 5 per IP per 15 minutes
- Wait 15 minutes or change IP address (VPN)

### Form submitting but no email received
- Check email service logs: `console` output
- Verify email addresses are correct in `.env`
- Check spam/junk folder

---

## Security Best Practices

✅ **Do:**
- Store `.env` files securely (never commit to git)
- Use HTTPS on production
- Use app-specific passwords for email
- Monitor logs for suspicious activity
- Update dependencies regularly
- Use strong email passwords
- Keep `ADMIN_EMAIL` private

❌ **Don't:**
- Commit `.env` files to git
- Use personal email passwords
- Deploy with `NODE_ENV=development`
- Disable CORS for production
- Use weak rate limits
- Expose error messages to users
- Store form data in logs

---

## Support

For issues or questions:
1. Check the error message in backend console
2. Verify `.env` configuration
3. Ensure both servers are running
4. Check firewall/port availability

---

## License

Open source - feel free to modify and deploy.
