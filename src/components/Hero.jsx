export default function Hero({ onCTA }) {
  return (
    <section id="home" className="hero" aria-label="Hero section">
      <div className="hero-content">
        <h1 id="hero-title">StudentLogger</h1>
        <p className="tagline" id="hero-tagline">
          The Learning Management System built for modern educators
        </p>
        <p className="hero-description">
          Track student progress, manage attendance, assign grades, and collaborate with your team—all in one place.
        </p>
        <div className="hero-cta" role="region" aria-label="Call to action buttons">
          <button
            className="btn btn-primary"
            onClick={() => onCTA('value')}
            aria-label="See the StudentLogger dashboard"
          >
            View Dashboard Demo
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onCTA('about')}
            aria-label="Learn more about StudentLogger"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
