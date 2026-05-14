import { useState, useRef, useEffect, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Value from './components/Value'
import Uses from './components/Uses'
import FAQ from './components/FAQ'
import Contact from './components/Contact'
import Footer from './components/Footer'

// Lazy load the SEO Monitor page for better code splitting
const SEOMonitor = lazy(() => import('./pages/SEOMonitor'))

function LandingPage({ scrollToSection, activeSection }) {
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const valueRef = useRef(null)
  const faqRef = useRef(null)
  const contactRef = useRef(null)
  const mainRef = useRef(null)

  const handleScrollToSection = (sectionId) => {
    scrollToSection(sectionId)
    const refs = {
      home: homeRef,
      about: aboutRef,
      value: valueRef,
      faq: faqRef,
      contact: contactRef,
    }

    if (refs[sectionId]?.current) {
      refs[sectionId].current.scrollIntoView({ behavior: 'smooth' })
      refs[sectionId].current.focus()
    }
  }

  return (
    <div>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} onNavigate={handleScrollToSection} />

      <main ref={mainRef} id="main-content">
        <div ref={homeRef} tabIndex={-1}><Hero onCTA={handleScrollToSection} /></div>
        <div ref={aboutRef} tabIndex={-1}><About /></div>
        <div ref={valueRef} tabIndex={-1}><Value /></div>
        <Uses />
        <div ref={faqRef} tabIndex={-1}><FAQ /></div>
        <div ref={contactRef} tabIndex={-1}><Contact /></div>
      </main>

      <Footer />
    </div>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState('home')

  // Set color-scheme based on user's system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.style.colorScheme = prefersDark ? 'dark' : 'light'

    // Listen for changes to the color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e) => {
      document.documentElement.style.colorScheme = e.matches ? 'dark' : 'light'
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage scrollToSection={setActiveSection} activeSection={activeSection} />} />
        <Route
          path="/admin/seo-monitor"
          element={
            <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading SEO Monitor...</div>}>
              <SEOMonitor />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
