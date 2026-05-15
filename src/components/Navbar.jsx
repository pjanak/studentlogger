import { useState } from 'react'

export default function Navbar({ activeSection, onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavigate = (section) => {
    onNavigate(section)
    setMobileMenuOpen(false)  // Close menu after navigation
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <div className="logo" role="heading" aria-level="1">
          studentlogger.com
        </div>

        {/* Hamburger menu button - visible only on mobile */}
        <button
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
          aria-controls="nav-menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Navigation menu - collapses on mobile */}
        <ul
          className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}
          id="nav-menu"
          role="menubar"
        >
          <li role="none">
            <button
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => handleNavigate('home')}
              aria-current={activeSection === 'home' ? 'page' : 'false'}
              role="menuitem"
              aria-label="Home"
            >
              Home
            </button>
          </li>
          <li role="none">
            <button
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => handleNavigate('about')}
              aria-current={activeSection === 'about' ? 'page' : 'false'}
              role="menuitem"
              aria-label="About this domain"
            >
              About
            </button>
          </li>
          <li role="none">
            <button
              className={`nav-link ${activeSection === 'value' ? 'active' : ''}`}
              onClick={() => handleNavigate('value')}
              aria-current={activeSection === 'value' ? 'page' : 'false'}
              role="menuitem"
              aria-label="Value proposition"
            >
              Value
            </button>
          </li>
          <li role="none">
            <button
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => handleNavigate('contact')}
              aria-current={activeSection === 'contact' ? 'page' : 'false'}
              role="menuitem"
              aria-label="Contact us"
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
