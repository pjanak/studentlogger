export default function Hero({ onCTA }) {
  return (
    <section id="home" className="hero" aria-label="Hero section">
      <div className="hero-content">
        <h1 id="hero-title">studentlogger.com</h1>
        <p className="tagline" id="hero-tagline">
          A premium domain for the education technology market
        </p>
        <div className="hero-cta" role="region" aria-label="Call to action buttons">
          <button
            className="btn btn-primary"
            onClick={() => onCTA('contact')}
            aria-label="Make an offer for studentlogger.com domain"
          >
            Make an Offer
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onCTA('about')}
            aria-label="Learn more about why studentlogger.com is valuable"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
