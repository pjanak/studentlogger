export default function Navbar({ activeSection, onNavigate }) {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <div className="logo" role="heading" aria-level="1">
          studentlogger.com
        </div>
        <ul className="nav-menu" role="menubar">
          <li role="none">
            <button
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
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
              onClick={() => onNavigate('about')}
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
              onClick={() => onNavigate('value')}
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
              onClick={() => onNavigate('contact')}
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
