import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import validator from 'validator'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ===== Security Middleware =====

// Helmet for security headers
app.use(helmet())

// CORS configuration - restrict to frontend origin
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 3600
}
app.use(cors(corsOptions))

// Body parser middleware (limit payload size to prevent abuse)
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ limit: '10kb', extended: true }))

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes per IP
  message: 'Too many inquiries from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limit for health check
    return req.path === '/health'
  }
})

app.use(limiter)

// ===== Email Configuration =====

// Using Gmail SMTP (or configure your own email service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
  }
})

// Verify email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error)
  } else {
    console.log('Email service ready')
  }
})

// ===== Validation Middleware =====

const validateContactForm = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .matches(/^[a-zA-Z\s'-]+$/).withMessage('Name contains invalid characters'),

  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .isLength({ max: 255 }).withMessage('Email must be less than 255 characters')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 5000 }).withMessage('Message must be 10-5000 characters')
    .escape() // Escape HTML to prevent XSS
]

// ===== Routes =====

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Contact form submission
app.post('/api/contact', validateContactForm, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.param,
          message: err.msg
        }))
      })
    }

    const { name, email, message } = req.body

    // Additional security checks
    // Check for suspicious patterns (spam keywords, excessive links, etc.)
    const suspiciousPatterns = [
      /viagra|cialis|casino|lottery|prize/gi,
      /http:\/\/|https:\/\//g
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(message)) {
        console.warn(`Suspicious content detected from ${email}`)
        // Don't reveal that we detected spam, just pretend it worked
        return res.json({
          success: true,
          message: 'Thank you for your inquiry. We will review and get back to you soon.'
        })
      }
    }

    // Count links in message (max 2)
    const linkCount = (message.match(/http:\/\/|https:\/\//g) || []).length
    if (linkCount > 2) {
      console.warn(`Too many links detected from ${email}`)
      return res.json({
        success: true,
        message: 'Thank you for your inquiry. We will review and get back to you soon.'
      })
    }

    // Send email to admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || 'p.janak@gmail.com',
      subject: `New Inquiry: StudentLogger.com Domain Sale`,
      html: `
        <h2>New Domain Inquiry</h2>
        <p><strong>Name:</strong> ${validator.escape(name)}</p>
        <p><strong>Email:</strong> ${validator.escape(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${validator.escape(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Received at: ${new Date().toISOString()}</small></p>
      `,
      replyTo: email
    }

    // Send confirmation email to user
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'We received your inquiry - StudentLogger.com',
      html: `
        <h2>Thank you for your interest!</h2>
        <p>Hi ${validator.escape(name)},</p>
        <p>We received your inquiry about studentlogger.com and will get back to you within 24 hours.</p>
        <p>Best regards,<br>StudentLogger Team</p>
      `
    }

    // Send both emails with error handling
    try {
      const [adminResult, userResult] = await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions)
      ])
      console.log(`Inquiry received from ${email}`)
      console.log(`Admin email sent, User confirmation email sent to ${email}`)
    } catch (emailError) {
      console.error(`Email sending error for ${email}:`, emailError.message)
      throw emailError
    }

    // Success response
    res.status(200).json({
      success: true,
      message: 'Thank you for your inquiry. We will review and get back to you soon.'
    })

  } catch (error) {
    console.error('Form submission error:', error)

    // Don't expose internal errors to client
    res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again later.'
    })
  }
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({
    success: false,
    message: 'An error occurred. Please try again later.'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`)
})
