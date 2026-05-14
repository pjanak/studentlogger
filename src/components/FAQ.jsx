export default function FAQ() {
  const faqs = [
    {
      question: 'Can I build a Learning Management System on StudentLogger.com?',
      answer: 'Absolutely! StudentLogger.com is specifically designed for LMS platforms. The domain name clearly indicates student tracking and progress logging, making it ideal for platforms like Canvas, Blackboard, or Moodle alternatives. Your users will immediately understand your platform\'s purpose.'
    },
    {
      question: 'What industries and businesses can use this domain?',
      answer: 'StudentLogger.com works for any education technology company including K-12 schools, universities, tutoring services, online coaching platforms, corporate training systems, EdTech startups, educational analytics companies, and student portfolio platforms. The domain is versatile enough for SaaS, enterprise software, or marketplace business models.'
    },
    {
      question: 'Is StudentLogger.com available for immediate purchase?',
      answer: 'Yes, StudentLogger.com is available for acquisition. The domain represents a premium investment in the education technology sector. Contact us to discuss pricing and terms tailored to your business needs and timeline.'
    },
    {
      question: 'How much search traffic potential does this domain have?',
      answer: 'StudentLogger.com targets high-intent keywords in the education technology vertical including "student tracking," "learning management," "student logger," and related terms. Educational institutions and EdTech companies actively search for these solutions. The domain provides strong SEO foundation with natural keyword alignment.'
    },
    {
      question: 'What is included in a domain purchase?',
      answer: 'Domain purchases include full ownership rights to StudentLogger.com, complete transfer of domain registration, DNS management access, and email forwarding setup. The domain comes with all standard registrar services and can be immediately integrated with your hosting provider.'
    },
    {
      question: 'How do I contact you about pricing and availability?',
      answer: 'Use the contact form on this page to express your interest. Include details about your intended use case, business model, and timeline. We\'ll respond within 24 hours with information about pricing, terms, and next steps in the acquisition process.'
    },
    {
      question: 'Can I use StudentLogger.com for an international EdTech platform?',
      answer: 'Yes! StudentLogger.com works globally. The domain is in English, which is the international language of business and education technology. It resonates with educators and administrators worldwide and provides excellent SEO foundation for global markets.'
    }
  ]

  return (
    <section id="faq" className="faq">
      <div className="container">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={index} className="faq-item">
              <summary className="faq-question">{faq.question}</summary>
              <p className="faq-answer">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem' }}>
          <a href="#contact" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'underline' }}>
            Ready to move forward? Contact us to discuss terms →
          </a>
        </p>
      </div>
    </section>
  )
}
