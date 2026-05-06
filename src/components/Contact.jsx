import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    setSubmitted(true)
    setFormData({ name: '', email: '', company: '', message: '' })

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
          <div className="success-message">
            ✓ Thank you! We'll get back to you soon.
          </div>
        )}

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="company">Company/Organization</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              placeholder="Tell us about your interest in this domain..."
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Send Inquiry</button>
        </form>

        <div className="contact-info">
          <p>Or reach out directly:</p>
          <p><strong>Email:</strong> <a href="mailto:contact@example.com">contact@example.com</a></p>
        </div>
      </div>
    </section>
  )
}
