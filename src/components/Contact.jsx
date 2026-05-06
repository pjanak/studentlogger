import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', company: '', message: '' })
    setErrors({})

    setTimeout(() => {
      setSubmitted(false)
    }, 5000)
  }

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Interested in StudentLogger.com?</h2>
        <p>Send us a message with your inquiry. We'll respond promptly to discuss terms and pricing.</p>

        {submitted && (
          <div className="success-message" role="status" aria-live="polite">
            ✓ Thank you! We'll get back to you soon.
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
              aria-required="true"
              aria-describedby={errors.name ? "name-error" : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
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
              aria-required="true"
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p id="email-error" className="error-message" role="alert">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="company">
              Company/Organization
            </label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
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
            ></textarea>
            {errors.message && (
              <p id="message-error" className="error-message" role="alert">{errors.message}</p>
            )}
          </div>

          <button type="submit" className="btn btn-primary" aria-label="Send your inquiry about studentlogger.com">
            Send Inquiry
          </button>
        </form>

        <div className="contact-info">
          <p>Or reach out directly:</p>
          <p><strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
        </div>
      </div>
    </section>
  )
}
