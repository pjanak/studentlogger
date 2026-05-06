export default function Navbar({ activeSection, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">studentlogger.com</div>
        <ul className="nav-menu">
          <li>
            <button
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={() => onNavigate('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => onNavigate('about')}
            >
              About
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'value' ? 'active' : ''}`}
              onClick={() => onNavigate('value')}
            >
              Value
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
              onClick={() => onNavigate('contact')}
            >
              Contact
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}
