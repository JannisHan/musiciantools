import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: 'Privacy — Musician Tools' },
      {
        name: 'description',
        content: 'How Musician Tools handles calculator inputs and analytics.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/privacy' }],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <main className="content-page page-shell legal-copy">
      <p className="eyebrow">Privacy</p>
      <h1>Your settings are for the calculator, not a profile.</h1>
      <p className="content-lead">Last updated: August 30, 2026</p>
      <section>
        <h2>Calculator data</h2>
        <p>
          BPM values, device limits, taps, scale lengths, fret counts, and
          exports are processed in your browser. We do not require an account
          and do not store those raw inputs on our servers.
        </p>
      </section>
      <section>
        <h2>Analytics</h2>
        <p>
          We use Cloudflare Web Analytics to understand aggregate page
          performance. We may also count a small set of anonymous product
          events, such as starting a tool, completing a calculation, tapping a
          tempo, previewing a pattern, exporting a file, or sharing a setup. These events contain an
          event name and tool identifier—not your input values, full URL,
          referrer, user agent, cookies, or a visitor ID.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          For privacy questions, email{' '}
          <a href="mailto:hello@musiciantools.app">
            hello@musiciantools.app
          </a>
          .
        </p>
      </section>
      <p className="legal-note">
        This policy describes the intended MVP data flow and is not legal
        advice. It should be reviewed before production launch.
      </p>
    </main>
  )
}
