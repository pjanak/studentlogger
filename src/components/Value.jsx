export default function Value() {
  const valueCards = [
    {
      icon: '📚',
      iconLabel: 'Books representing education',
      title: 'Perfect for EdTech',
      description: 'Ideal for learning management systems, student tracking platforms, and educational analytics tools. StudentLogger precisely describes what your platform does—logging and tracking student progress. Whether you\'re building an LMS like Canvas or Blackboard, a student data dashboard, or an educational analytics tool, this domain communicates your value proposition instantly.'
    },
    {
      icon: '🎯',
      iconLabel: 'Target representing clarity and focus',
      title: 'Clear & Memorable',
      description: 'Easy to remember, spell, and pronounce with no confusing abbreviations or unclear meanings. In the crowded EdTech space, a domain that clearly describes your function gives you a competitive advantage. StudentLogger immediately tells visitors what your platform does, reducing friction in customer acquisition.'
    },
    {
      icon: '🚀',
      iconLabel: 'Rocket representing growth and momentum',
      title: 'Market Demand',
      description: 'The e-learning market is booming with a projected CAGR of 20% through 2030. A domain this relevant is invaluable for startups and enterprises entering the education technology space. Global education technology investment exceeded $10 billion in 2023, and domain names that match market intent capture premium valuations.'
    },
    {
      icon: '🌍',
      iconLabel: 'Globe representing worldwide reach',
      title: 'Global Potential',
      description: 'Works across languages and markets with no geographic limitations or language barriers. StudentLogger is universally understood in the education sector across English-speaking countries. The domain is keyword-rich for international SEO, helping you rank for "student tracking," "learning logger," and related terms worldwide.'
    },
    {
      icon: '💡',
      iconLabel: 'Light bulb representing ideas and innovation',
      title: 'Multiple Use Cases',
      description: 'Perfect for student data management, learning analytics, course tracking, tutoring platforms, corporate training systems, and more. Build an LMS, student portfolio showcase, attendance tracker, grade management system, or educational SaaS. This domain accommodates diverse business models within the education technology vertical.'
    },
    {
      icon: '💰',
      iconLabel: 'Money bag representing financial value',
      title: 'Brand Value',
      description: 'A domain this relevant could save you $50,000+ in brand development and marketing costs. Premium domains in the EdTech vertical typically command valuations of $10,000-$100,000+. Beyond resale value, owning StudentLogger positions your company as a serious player in education technology from day one.'
    }
  ]

  return (
    <section id="value" className="value">
      <div className="container">
        <h2>Why This Domain Has Value</h2>
        <div className="value-grid">
          {valueCards.map((card, index) => (
            <div key={index} className="value-card">
              <div className="value-icon" aria-label={card.iconLabel}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="#uses" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline' }}>
            See how you can use this domain →
          </a>
        </p>
      </div>
    </section>
  )
}
