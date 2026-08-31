import { createFileRoute, Link } from '@tanstack/react-router'
import BpmDelayCalculator from '../components/BpmDelayCalculator'

export const Route = createFileRoute('/tools/bpm-delay-calculator')({
  head: () => ({
    meta: [
      { title: 'Delay Patch Builder & BPM to MS Calculator — Musician Tools' },
      {
        name: 'description',
        content:
          'Build mono and stereo delay patches from BPM with musical recipes, one-bar audio preview, pedal-limit checks, and a complete timing table.',
      },
      { property: 'og:title', content: 'Delay Patch Builder & BPM to MS Calculator' },
      { property: 'og:description', content: 'Turn a tempo into a musical, pedal-ready delay patch.' },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/tools/bpm-delay-calculator' }],
  }),
  component: BpmDelayPage,
})

function BpmDelayPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Delay Patch Builder & BPM to MS Calculator',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Any',
    url: 'https://musiciantools.app/tools/bpm-delay-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <main className="tool-page timing-tool-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="tool-title page-shell">
        <div><p className="eyebrow">Timing workbench</p><h1>Build a delay patch.</h1></div>
        <p>Choose a rhythmic character, fit it to your pedal, and hear the complete pattern before you reach for the knobs.</p>
      </header>
      <div className="page-shell"><BpmDelayCalculator /></div>
      <section className="method-strip page-shell">
        <div><p className="eyebrow">Core formula</p><p className="formula">Quarter-note ms = 60,000 ÷ BPM</p></div>
        <p>Straight, dotted, and triplet relationships use the unrounded value. Display rounding never changes compatibility checks.</p>
        <Link to="/methodology">Read the methodology</Link>
      </section>
    </main>
  )
}
