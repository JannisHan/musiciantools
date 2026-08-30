import { createFileRoute } from '@tanstack/react-router'
import BpmDelayCalculator from '../components/BpmDelayCalculator'

export const Route = createFileRoute('/tools/bpm-delay-calculator')({
  head: () => ({
    meta: [
      { title: 'BPM to MS & Delay Time Calculator — Musician Tools' },
      {
        name: 'description',
        content:
          'Convert BPM to delay time in milliseconds for straight, dotted, and triplet notes. Includes Tap Tempo, device limits, copy, and share.',
      },
      {
        property: 'og:title',
        content: 'BPM to MS & Delay Time Calculator',
      },
      {
        property: 'og:description',
        content:
          'Set delay, reverb, and modulation times without breaking the groove.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://musiciantools.app/tools/bpm-delay-calculator',
      },
    ],
  }),
  component: BpmDelayPage,
})

function BpmDelayPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'BPM to MS & Delay Time Calculator',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Any',
    url: 'https://musiciantools.app/tools/bpm-delay-calculator/',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  }

  return (
    <main className="tool-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="tool-hero page-shell">
        <p className="eyebrow">Timing workstation</p>
        <h1>BPM to MS & Delay Time Calculator</h1>
        <p>
          Set delay, reverb, and modulation times without breaking the groove.
        </p>
      </header>

      <div className="page-shell">
        <BpmDelayCalculator />
      </div>

      <section className="tool-explainer page-shell">
        <div className="section-heading">
          <p className="eyebrow">Practical reference</p>
          <h2>From tempo to a setting you can use</h2>
        </div>
        <div className="explainer-grid">
          <article>
            <span>01</span>
            <h3>Enter or tap the song tempo</h3>
            <p>
              Use the known BPM or tap along manually. The first estimate
              appears after two taps and becomes more reliable as you continue.
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>Choose the musical feel</h3>
            <p>
              Straight values reinforce the pulse, dotted values create
              syncopation, and triplets divide each beat into three.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Check the device before setting it</h3>
            <p>
              Add the maximum delay from your manual to see which values fit
              your pedal or plugin. Results stay visible for comparison.
            </p>
          </article>
        </div>
        <div className="formula-panel">
          <div>
            <p className="eyebrow">Core formula</p>
            <p className="formula">Quarter-note ms = 60,000 ÷ BPM</p>
          </div>
          <a href="/methodology">Read the full methodology →</a>
        </div>
      </section>
    </main>
  )
}
