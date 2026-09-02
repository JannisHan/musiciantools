import { createFileRoute, Link } from '@tanstack/react-router'
import FretCalculator from '../components/FretCalculator'

export const Route = createFileRoute('/tools/fret-calculator')({
  head: () => ({
    meta: [
      { title: 'Fret Calculator & Printable Fret Spacing — Musician Tools' },
      {
        name: 'description',
        content:
          'Calculate nut-based fret positions for guitar, bass, ukulele, mandolin, and banjo. Export CSV, actual-size SVG, and tiled PDF templates.',
      },
      {
        property: 'og:title',
        content: 'Fret Calculator & Printable Fret Spacing',
      },
      {
        property: 'og:description',
        content:
          'Accurate single-scale fret positions with workshop-ready exports.',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://musiciantools.app/tools/fret-calculator',
      },
    ],
  }),
  component: FretCalculatorPage,
})

function FretCalculatorPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Fret Calculator & Printable Fret Spacing',
    applicationCategory: 'MusicApplication',
    operatingSystem: 'Any',
    url: 'https://musiciantools.app/tools/fret-calculator',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }

  return (
    <main className="tool-page fret-tool-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="tool-title page-shell">
        <div>
          <p className="eyebrow">Fret layout workbench</p>
          <h1>Build an accurate fret layout.</h1>
        </div>
        <p>
          Calculate every fret from the nut, inspect the spacing, then export a
          workshop-ready CSV, SVG, or tiled PDF.
        </p>
      </header>
      <div className="page-shell">
        <FretCalculator />
      </div>
      <section className="method-strip page-shell">
        <div>
          <p className="eyebrow">Core formula</p>
          <p className="formula">dₙ = L × (1 − 2<sup>−n/12</sup>)</p>
        </div>
        <p>
          Results mark fret centerlines. Always verify physical exports with
          the included calibration ruler before cutting.
        </p>
        <Link to="/methodology">Read the methodology</Link>
      </section>
      <aside className="related-guide page-shell" aria-labelledby="print-guide-title">
        <div>
          <p className="eyebrow">Workshop guides</p>
          <h2 id="print-guide-title">Carry accurate geometry to the bench.</h2>
          <p>Review the formula, prevent cumulative spacing error, or follow the full-scale printing workflow before cutting.</p>
        </div>
        <nav className="related-guide-links" aria-label="Fret layout guides">
          <Link to="/blog/fret-calculator">Fret calculation guide</Link>
          <Link to="/blog/fret-spacing-calculator">Fret spacing guide</Link>
          <Link to="/blog/printable-fret-template-guide">Full-scale print guide</Link>
        </nav>
      </aside>
    </main>
  )
}
