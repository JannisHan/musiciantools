import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  head: () => ({
    meta: [
      { title: 'Terms — Musician Tools' },
      {
        name: 'description',
        content: 'Terms for using Musician Tools calculators and content.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/terms' }],
  }),
  component: TermsPage,
})

function TermsPage() {
  return (
    <main className="content-page page-shell legal-copy">
      <p className="eyebrow">Terms</p>
      <h1>Use the tools, and verify critical settings.</h1>
      <p className="content-lead">Last updated: August 30, 2026</p>
      <section>
        <h2>Tool use</h2>
        <p>
          Musician Tools provides calculators and educational content for
          general informational use. You are responsible for confirming that a
          result is appropriate for your instrument, hardware, software, and
          session.
        </p>
      </section>
      <section>
        <h2>Availability and accuracy</h2>
        <p>
          We test core formulas and welcome corrections, but the service is
          provided without a guarantee of uninterrupted availability or
          suitability for a particular purpose.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions can be sent to{' '}
          <a href="mailto:hello@musiciantools.app">
            hello@musiciantools.app
          </a>
          .
        </p>
      </section>
      <p className="legal-note">
        This draft reflects the MVP feature set and is not legal advice. It
        should be reviewed before production launch.
      </p>
    </main>
  )
}
