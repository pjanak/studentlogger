# Security Documentation

## Overview

This form submission system implements multiple layers of security to prevent abuse, protect user data, and maintain integrity.

---

## Security Layers

### 1. Network & Transport

**HTTPS/TLS (Production)**
- All production traffic must use HTTPS
- Certificates from Let's Encrypt (free) or AWS ACM
- Ensures data is encrypted in transit

**CORS Policy**
```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 3600
}
```
- Only frontend domain can access API
- Prevents requests from malicious websites
- Configurable per environment

**Security Headers (Helmet.js)**
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME type sniffing
- `Content-Security-Policy`: Controls resource loading
- `Strict-Transport-Security`: Forces HTTPS

---

### 2. Rate Limiting

**Implementation:**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 5,  // 5 requests per IP
  message: 'Too many inquiries from this IP'
})
```

**Protection Against:**
- Brute force attacks
- DoS attacks
- Spam submissions
- Resource exhaustion

**How it works:**
- Tracks requests by IP address
- Resets after 15-minute window
- Returns 429 status code when exceeded

---

### 3. Input Validation

**Name Field:**
```javascript
body('name')
  .trim()
  .notEmpty().withMessage('Name is required')
  .isLength({ min: 2, max: 100 })
  .matches(/^[a-zA-Z\s'-]+$/)  // Only letters, spaces, hyphens, apostrophes
```

**Email Field:**
```javascript
body('email')
  .trim()
  .isEmail()  // Valid email format
  .isLength({ max: 255 })
  .normalizeEmail()  // Lowercase, remove spaces
```

**Message Field:**
```javascript
body('message')
  .trim()
  .notEmpty()
  .isLength({ min: 10, max: 5000 })
  .escape()  // Converts <, >, &, ", ' to HTML entities
```

**Protection Against:**
- XSS (Cross-Site Scripting)
- SQL Injection (via escaped output)
- Buffer overflow (length limits)
- Invalid data format

---

### 4. Spam Detection

**Keyword Filtering:**
```javascript
const suspiciousPatterns = [
  /viagra|cialis|casino|lottery|prize/gi,
  /http:\/\/|https:\/\//g
]
```

**Link Limiting:**
```javascript
const linkCount = (message.match(/http:\/\/|https:\/\//g) || []).length
if (linkCount > 2) {
  // Reject
}
```

**Protection Against:**
- Pharmaceutical spam
- Phishing attempts
- Malware distribution links
- Irrelevant marketing content

**Stealth Mode:**
- Silently rejects spam without revealing detection
- Prevents spammers from testing different patterns
- User sees "Thank you" message (security through obscurity)

---

### 5. Payload Size Limits

**Implementation:**
```javascript
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb' }))
```

**Protection Against:**
- Large payload attacks
- Memory exhaustion
- Zip bomb attacks
- Slowloris attacks

---

### 6. Output Encoding

**HTML Escaping:**
```javascript
.escape()  // Built into express-validator

// Converts:
// '<script>' → '&lt;script&gt;'
// '&' → '&amp;'
// '"' → '&quot;'
```

**Email HTML Encoding:**
```javascript
html: `<p>${validator.escape(message).replace(/\n/g, '<br>')}</p>`
```

**Protection Against:**
- XSS attacks in email display
- Email client vulnerabilities
- HTML injection

---

### 7. Data Privacy

**No Storage:**
- Form data not stored in database
- Only transmitted via email
- Logs don't contain sensitive data

**Email Privacy:**
```javascript
// Admin email contains user info
to: process.env.ADMIN_EMAIL

// User email is private (not logged)
replyTo: email
```

**Configuration Isolation:**
```env
# Never expose these in logs or responses
EMAIL_USER=hidden
EMAIL_PASSWORD=hidden
ADMIN_EMAIL=hidden
```

---

### 8. Error Handling

**Information Leakage Prevention:**
```javascript
catch (error) {
  console.error('Form submission error:', error)  // Server-side only
  res.status(500).json({
    success: false,
    message: 'An error occurred. Please try again later.'  // Generic message
  })
}
```

**Never Expose:**
- ❌ Stack traces to client
- ❌ Database errors
- ❌ File paths
- ❌ Internal server details
- ❌ Email addresses

---

### 9. Form-Specific Protections

**Honeypot Fields (Optional Enhancement):**
Could add hidden fields that bots fill but humans ignore:
```html
<input type="email" name="website" style="display:none;" />
```

**CAPTCHA (Optional Enhancement):**
For additional bot protection:
```javascript
const recaptchaScore = await verifyRecaptcha(req.body.token)
if (recaptchaScore < 0.5) reject()
```

**Email Verification:**
Could implement double opt-in:
```
User submits → Confirmation email → Click link → Verified
```

---

## Threat Model

### Threats Addressed

| Threat | Protection |
|--------|-----------|
| SQL Injection | No database, input validation |
| XSS (Cross-Site Scripting) | HTML escaping, CSP headers |
| CSRF (Cross-Site Request Forgery) | CORS policy |
| Spam | Rate limiting, keyword filtering, link limits |
| DoS/DDoS | Rate limiting, payload size limits |
| Data leakage | No storage, generic error messages |
| Brute force | Rate limiting (5 per 15 min) |
| Clickjacking | X-Frame-Options header |
| Phishing | Email validation, link detection |
| Information disclosure | No stack traces, generic messages |

### Remaining Risks

| Risk | Mitigation |
|------|-----------|
| Bot attacks | Rate limiting, consider CAPTCHA |
| Email spoofing | SPF/DKIM records (hosting) |
| Compromised email | Use app-specific passwords |
| Man-in-the-middle | HTTPS only (production) |
| Server compromise | Use OS-level firewall, keep updated |

---

## Monitoring & Logging

**Log Examples:**
```
✓ Inquiry received from user@example.com
⚠️ Suspicious content detected from attacker@example.com
⚠️ Too many links detected from spammer@example.com
✓ Rate limit triggered from 192.168.1.1
✗ Email service connection failed
```

**What to Monitor:**
1. Error rate increases
2. Repeated rate limit triggers from same IP
3. Failed email deliveries
4. Suspicious content attempts

---

## Testing Security

### Test Rate Limiting
```bash
# Submit 6 inquiries rapidly
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"test@test.com","message":"Test"}'
# Request 6 should return 429
```

### Test Input Validation
```bash
# Invalid email
-d '{"name":"John","email":"invalid","message":"Test"}'
# Response: 400 Bad Request

# Too short message
-d '{"name":"John","email":"test@test.com","message":"Hi"}'
# Response: 400 Bad Request
```

### Test Spam Detection
```bash
# Message with viagra keyword
-d '{"name":"John","email":"test@test.com","message":"Buy cheap viagra now"}'
# Response: 200 OK (silently rejected)
```

---

## Production Security Checklist

- [ ] Enable HTTPS/TLS certificates
- [ ] Set `NODE_ENV=production`
- [ ] Update `FRONTEND_URL` in .env
- [ ] Use app-specific email password
- [ ] Enable firewall rules
- [ ] Set up monitoring/alerts
- [ ] Configure backup email
- [ ] Test rate limiting works
- [ ] Review CORS policy
- [ ] Keep dependencies updated
- [ ] Use environment secrets (not .env files)
- [ ] Set up email forwarding/backup
- [ ] Test error handling
- [ ] Monitor server logs daily
- [ ] Use HTTPS redirects
- [ ] Set security headers
- [ ] Validate email configuration
- [ ] Test form submission end-to-end

---

## Security Resources

- [OWASP Top 10](https://owasp.org/Top10/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [express-validator](https://express-validator.github.io/)
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit)

---

## Incident Response

**If form is getting spam:**
1. Increase rate limit or lower `max` value
2. Add keyword to spam filter
3. Check IP reputation
4. Consider enabling CAPTCHA

**If emails not being received:**
1. Check email service status
2. Verify credentials in `.env`
3. Check spam folder
4. Review error logs

**If suspicious activity detected:**
1. Review logs for patterns
2. Identify malicious IPs
3. Report to hosting provider
4. Consider DDoS protection

---

## Version History

- **v1.0.0** - Initial implementation with rate limiting, input validation, spam detection
