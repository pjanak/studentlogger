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
    }
  }

  return (
    <div className="App">
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />
      <div ref={homeRef}><Hero onCTA={scrollToSection} /></div>
      <div ref={aboutRef}><About /></div>
      <div ref={valueRef}><Value /></div>
      <Uses />
      <div ref={contactRef}><Contact /></div>
      <Footer />
    </div>
  )
}

export default App
