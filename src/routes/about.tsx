import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Musician Tools' },
      {
        name: 'description',
        content:
          'Why Musician Tools builds focused, transparent calculators for musicians and producers.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/about' }],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="content-page page-shell">
      <p className="eyebrow">About the project</p>
      <h1>Useful math should disappear into the session.</h1>
      <p className="content-lead">
        Musician Tools is an independent project building focused calculators
        for musicians, producers, and audio engineers.
      </p>
      <div className="content-grid">
        <section>
          <h2>Why this exists</h2>
          <p>
            A calculator earns its place when it removes a small, repeated
            interruption: converting a tempo, checking a hardware limit, or
            confirming a setting before recording. We prioritize those tasks
            over broad feature lists.
          </p>
        </section>
        <section>
          <h2>How we work</h2>
          <p>
            Every tool starts with a specific user job, uses documented
            formulas, and exposes its assumptions. Core calculations are
            covered by automated tests before the interface is built.
          </p>
        </section>
      </div>
      <p className="contact-line">
        Questions or corrections?{' '}
        <a href="mailto:hello@musiciantools.app">
          hello@musiciantools.app
        </a>
      </p>
    </main>
  )
}
