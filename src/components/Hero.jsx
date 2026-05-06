export default function Hero({ onCTA }) {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <h1>studentlogger.com</h1>
        <p className="tagline">A premium domain for the education technology market</p>
        <div className="hero-cta">
          <button className="btn btn-primary" onClick={() => onCTA('contact')}>
            Make an Offer
          </button>
          <button className="btn btn-secondary" onClick={() => onCTA('about')}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}
