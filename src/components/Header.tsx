import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

function BrandMark() {
  return (
    <svg viewBox="0 0 30 30" aria-hidden="true" className="brand-mark">
      <path d="M3 15h4l2.2-7 4.3 14 3.4-11 2.6 8 2-4H27" />
    </svg>
  )
}

export default function Header() {
  return (
    <header className="site-header">
      <nav className="page-shell nav-shell" aria-label="Primary navigation">
        <Link to="/" className="brand-link">
          <BrandMark />
          <span>Musician Tools</span>
        </Link>

        <div className="nav-links">
          <Link
            to="/tools/bpm-delay-calculator"
            activeProps={{ className: 'nav-link is-active' }}
            className="nav-link"
          >
            BPM / Delay
          </Link>
          <Link
            to="/methodology"
            activeProps={{ className: 'nav-link is-active' }}
            className="nav-link nav-link-secondary"
          >
            Methodology
          </Link>
          <Link
            to="/about"
            activeProps={{ className: 'nav-link is-active' }}
            className="nav-link nav-link-secondary"
          >
            About
          </Link>
        </div>

        <ThemeToggle />
      </nav>
    </header>
  )
}
