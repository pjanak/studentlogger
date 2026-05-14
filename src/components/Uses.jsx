export default function Uses() {
  const useCases = [
    {
      title: 'Learning Management Systems (LMS)',
      description: 'Build a centralized platform where teachers log daily attendance, assignment submissions, and student progress. StudentLogger.com is ideal for institutions rolling out their own LMS alternative to expensive enterprise solutions like Canvas or Blackboard.'
    },
    {
      title: 'Educational Analytics Platforms',
      description: 'Create a data intelligence platform that helps schools identify at-risk students, track learning outcomes across districts, and provide actionable insights to educators. The domain perfectly describes analytics focused on student data.'
    },
    {
      title: 'Tutoring & Coaching Services',
      description: 'Launch a platform connecting tutors with students, where tutors log session notes, track student progress, and measure learning improvements over time. Perfect for 1-on-1 and group tutoring businesses.'
    },
    {
      title: 'Student Portfolio & ePortfolio Platforms',
      description: 'Build a platform where students compile evidence of their learning journey—essays, projects, certifications, and achievements. Teachers use the platform to document and log student growth throughout their academic career.'
    },
    {
      title: 'Academic Tracking Tools for Schools',
      description: 'Develop an administrative dashboard for K-12 and university registrars to log grades, attendance, discipline records, and transcript data. Streamline record-keeping and parent communication at scale.'
    },
    {
      title: 'EdTech Startups & B2B SaaS',
      description: 'Launch any education technology company with immediate credibility and clear market positioning. StudentLogger.com signals that you understand education and are focused on solving real problems for schools and students.'
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

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="#faq" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline' }}>
            See more details in our FAQ →
          </a>
        </p>
      </div>
    </section>
  )
}
