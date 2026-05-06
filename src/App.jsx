import { useState, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Value from './components/Value'
import Uses from './components/Uses'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('home')
  const homeRef = useRef(null)
  const aboutRef = useRef(null)
  const valueRef = useRef(null)
  const contactRef = useRef(null)
  const mainRef = useRef(null)

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    const refs = {
      home: homeRef,
      about: aboutRef,
      value: valueRef,
      contact: contactRef,
    }

    if (refs[sectionId]?.current) {
      refs[sectionId].current.scrollIntoView({ behavior: 'smooth' })
      refs[sectionId].current.focus()
    }
  }

  return (
    <div className="App">
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />

      <main ref={mainRef} id="main-content">
        <div ref={homeRef} tabIndex={-1}><Hero onCTA={scrollToSection} /></div>
        <div ref={aboutRef} tabIndex={-1}><About /></div>
        <div ref={valueRef} tabIndex={-1}><Value /></div>
        <Uses />
        <div ref={contactRef} tabIndex={-1}><Contact /></div>
      </main>

      <Footer />
    </div>
  )
}

export default App
