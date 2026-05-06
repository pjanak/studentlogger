export default function Uses() {
  const useCases = [
    {
      title: 'Learning Management Systems (LMS)',
      description: 'Track student progress and engagement'
    },
    {
      title: 'Educational Analytics Platforms',
      description: 'Monitor learning outcomes and performance metrics'
    },
    {
      title: 'Tutoring & Coaching Services',
      description: 'Manage student sessions and progress'
    },
    {
      title: 'Student Portfolio Platforms',
      description: 'Showcase student work and achievements'
    },
    {
      title: 'Academic Tracking Tools',
      description: 'Monitor grades, attendance, and academic progress'
    },
    {
      title: 'EdTech Startups',
      description: 'Launch with a professionally relevant domain name'
    }
  ]

  return (
    <section id="uses" className="uses">
      <div className="container">
        <h2>Ideal For</h2>
        <div className="uses-list">
          {useCases.map((useCase, index) => (
            <div key={index} className="use-item">
              <strong>{useCase.title}</strong>
              {useCase.description}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
