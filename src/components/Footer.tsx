import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-shell">
        <div>
          <p className="footer-brand">Musician Tools</p>
          <p className="footer-note">
            Practical timing tools for musicians and producers.
          </p>
        </div>
        <nav className="footer-links" aria-label="Legal and project links">
          <Link to="/about">About</Link>
          <Link to="/methodology">Methodology</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
        <p className="footer-copyright">
          © {new Date().getFullYear()} Musician Tools
        </p>
      </div>
    </footer>
  )
}
