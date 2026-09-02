import { Link } from '@tanstack/react-router'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="site-header">
      <nav className="page-shell nav-shell" aria-label="Primary navigation">
        <Link to="/" className="brand-link" aria-label="Musician Tools home">
          <img src="/favicon.svg" alt="" className="brand-mark" />
          <span>Musician Tools</span>
        </Link>
        <div className="nav-links">
          <Link to="/tools/bpm-delay-calculator" activeProps={{ className: 'nav-link is-active' }} className="nav-link">
            Timing Workbench
          </Link>
          <Link to="/tools/fret-calculator" activeProps={{ className: 'nav-link is-active' }} className="nav-link">
            Fret Layout
          </Link>
          <Link to="/blog" activeProps={{ className: 'nav-link is-active' }} className="nav-link nav-link-blog">
            Guides
          </Link>
          <Link to="/methodology" activeProps={{ className: 'nav-link is-active' }} className="nav-link nav-link-secondary">
            Methodology
          </Link>
        </div>
        <ThemeToggle />
      </nav>
    </header>
  )
}
