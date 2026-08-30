import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Musician Tools — Precise Music Calculators' },
      {
        name: 'description',
        content:
          'Fast, practical calculators for delay timing and studio workflows. Built for musicians, producers, and engineers.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/' }],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <section className="home-hero page-shell">
        <p className="eyebrow">Precision tools for working musicians</p>
        <h1>Make the setting. Keep the session moving.</h1>
        <p className="hero-copy">
          Focused calculators for the details that slow musicians down—clear
          inputs, trustworthy math, and results you can use immediately.
        </p>
        <Link
          to="/tools/bpm-delay-calculator"
          className="primary-button"
        >
          Open BPM / Delay calculator
          <span aria-hidden="true">→</span>
        </Link>
      </section>

      <section className="page-shell tool-directory" aria-labelledby="tools-title">
        <div className="section-heading">
          <p className="eyebrow">Available now</p>
          <h2 id="tools-title">Tools built around a real session task</h2>
        </div>
        <article className="directory-card">
          <div className="directory-index" aria-hidden="true">
            01
          </div>
          <div>
            <p className="directory-kicker">Timing · Free</p>
            <h3>BPM to MS & Delay Time Calculator</h3>
            <p>
              Convert tempo into straight, dotted, and triplet delay times.
              Tap a tempo, check a pedal limit, copy a value, and get back to
              playing.
            </p>
          </div>
          <Link to="/tools/bpm-delay-calculator" className="card-link">
            Use calculator <span aria-hidden="true">↗</span>
          </Link>
        </article>
      </section>

      <section className="trust-strip">
        <div className="page-shell trust-grid">
          <div>
            <span className="trust-number">Local</span>
            <p>Calculations stay in your browser.</p>
          </div>
          <div>
            <span className="trust-number">Clear</span>
            <p>Methods and assumptions are published.</p>
          </div>
          <div>
            <span className="trust-number">Fast</span>
            <p>No account, paywall, or setup ritual.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
