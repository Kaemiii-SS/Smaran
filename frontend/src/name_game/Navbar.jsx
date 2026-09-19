import './Navbar.css'
import { useI18n } from './i18nContext'

function Navbar() {
  return (
    <nav className="game-navbar">
      <div className="navbar-logo">
        <span className="logo-see">See</span>
        <span className="logo-ampersand">&amp;</span>
        <span className="logo-say">Say</span>
      </div>
      <div className="navbar-stars">
        <span className="star star-1">★</span>
        <span className="star star-2">★</span>
        <span className="star star-3">★</span>
      </div>
    </nav>
  )
}

export default Navbar
