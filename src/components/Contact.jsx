export default function Contact() {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Interested in StudentLogger.com?</h2>
        <p>This premium domain is available for acquisition. We're open to discussing pricing and terms with serious buyers.</p>

        <div className="contact-cta" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            To inquire about purchasing this domain, please contact us at:
          </p>
          <a
            href="mailto:janakpatelaws@gmail.com?subject=Inquiry%20about%20StudentLogger.com"
            className="btn btn-primary"
            style={{ display: 'inline-block' }}
            aria-label="Send email inquiry to janakpatelaws@gmail.com"
          >
            janakpatelaws@gmail.com
          </a>
          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Include details about your intended use case and timeline.
          </p>
        </div>
      </div>
    </section>
  )
}
