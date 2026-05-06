export default function Value() {
  const valueCards = [
    {
      icon: '📚',
      title: 'Perfect for EdTech',
      description: 'Ideal for learning management systems, student tracking platforms, and educational analytics tools'
    },
    {
      icon: '🎯',
      title: 'Clear & Memorable',
      description: 'Easy to remember, spell, and pronounce. No confusing abbreviations or unclear meanings'
    },
    {
      icon: '🚀',
      title: 'Market Demand',
      description: 'The e-learning market is booming. A domain this relevant is invaluable for startups and enterprises'
    },
    {
      icon: '🌍',
      title: 'Global Potential',
      description: 'Works across languages and markets. No geographic limitations or language barriers'
    },
    {
      icon: '💡',
      title: 'Multiple Use Cases',
      description: 'Perfect for student data management, learning analytics, course tracking, or tutoring platforms'
    },
    {
      icon: '💰',
      title: 'Brand Value',
      description: 'A domain this relevant could save thousands in brand development and marketing costs'
    }
  ]

  return (
    <section id="value" className="value">
      <div className="container">
        <h2>Why This Domain Has Value</h2>
        <div className="value-grid">
          {valueCards.map((card, index) => (
            <div key={index} className="value-card">
              <div className="value-icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
