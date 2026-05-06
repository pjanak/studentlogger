import { useState } from 'react'

// Use relative URL for API calls - works with Nginx reverse proxy
const API_URL = import.meta.env.VITE_API_URL || ''

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    setServerError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setServerError('')

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle validation errors
        if (data.errors) {
          const errorMap = {}
          data.errors.forEach(err => {
            errorMap[err.field] = err.message
          })
          setErrors(errorMap)
        } else {
          setServerError(data.message || 'An error occurred. Please try again.')
        }
        return
      }

      // Success
      setSubmitted(true)
      setFormData({ name: '', email: '', message: '' })
      setErrors({})

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSubmitted(false)
      }, 5000)

    } catch (error) {
      console.error('Form submission error:', error)
      setServerError('Unable to connect to server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Interested in StudentLogger.com?</h2>
        <p>Send us your inquiry and we'll get back to you within 24 hours.</p>

        {submitted && (
          <div className="success-message" role="status" aria-live="polite">
            ✓ Thank you! Check your email for confirmation.
          </div>
        )}

        {serverError && (
          <div className="error-message" role="alert" aria-live="polite">
            {serverError}
          </div>
        )}

        <form
          className="contact-form"
          onSubmit={handleSubmit}
          noValidate
          aria-label="Contact form to inquire about the domain"
        >
          <div className="form-group">
            <label htmlFor="name">
              Name <span className="required" aria-label="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
              disabled={loading}
            />
            {errors.name && (
              <p id="name-error" className="error-message" role="alert">{errors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email <span className="required" aria-label="required">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
              disabled={loading}
            />
            {errors.email && (
              <p id="email-error" className="error-message" role="alert">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="message">
              Message <span className="required" aria-label="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your interest in this domain..."
              aria-required="true"
              aria-describedby={errors.message ? "message-error" : undefined}
              aria-invalid={errors.message ? 'true' : 'false'}
              disabled={loading}
            ></textarea>
            {errors.message && (
              <p id="message-error" className="error-message" role="alert">{errors.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            aria-label="Send your inquiry about studentlogger.com"
          >
            {loading ? 'Sending...' : 'Send Inquiry'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          We respect your privacy. Your information will only be used to respond to your inquiry.
        </p>
      </div>
    </section>
  )
}
