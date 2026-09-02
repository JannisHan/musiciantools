import { ArrowRight, CalendarBlank, Ruler } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'

const keywordGuides = [
  {
    to: '/blog/guitar-string-tension-calculator',
    keyword: 'guitar string tension calculator',
    title: 'Guitar String Tension Calculator: Gauge Guide',
    summary: 'Understand Unit Weight, compare current and target setups, and avoid false precision when source data is incomplete.',
    volume: '1.9k',
    kd: '31%',
    image: '/assets/images/blog/guitar-string-tension-formula.svg',
    alt: 'Guitar string tension formula diagram',
  },
  {
    to: '/blog/bpm-to-ms',
    keyword: 'bpm to ms',
    title: 'BPM to MS: Complete Conversion Chart & Guide',
    summary: 'Convert tempo into straight, dotted, and triplet milliseconds for delay, reverb, compression, and modulation.',
    volume: '1k',
    kd: '3%',
    image: '/assets/images/blog/bpm-to-ms-workbench.webp',
    alt: 'Tempo-to-milliseconds workbench',
  },
  {
    to: '/blog/delay-time-calculator',
    keyword: 'delay time calculator',
    title: 'Delay Time Calculator: Pedal & Plugin Guide',
    summary: 'Choose a rhythmic role, check device limits, build mono or stereo relationships, and save a repeatable patch.',
    volume: '480',
    kd: '20%',
    image: '/assets/images/blog/delay-time-calculator-workbench.webp',
    alt: 'Delay patch calculator workbench',
  },
  {
    to: '/blog/fret-calculator',
    keyword: 'fret calculator',
    title: 'Fret Calculator: Accurate Scale Length Guide',
    summary: 'Understand equal-tempered fret positions, verify the half-scale checkpoint, and choose a workshop export.',
    volume: '260',
    kd: '9%',
    image: '/assets/images/blog/printable-fret-template-workbench.webp',
    alt: 'Fret layout calculation workbench',
  },
  {
    to: '/blog/fret-spacing-calculator',
    keyword: 'fret spacing calculator',
    title: 'Fret Spacing Calculator: Workshop Layout Guide',
    summary: 'Place every centerline from the nut, prevent cumulative error, and transfer a verified layout to the board.',
    volume: '110',
    kd: '6%',
    image: '/assets/images/blog/fret-centerline-preview.webp',
    alt: 'Nut-based fret spacing preview',
  },
] as const

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title: 'Musician Tools Blog — Practical Setup & Workshop Guides' },
      {
        name: 'description',
        content:
          'Practical, tested guides for delay timing, fret layout, instrument setup, and workshop-ready music calculations.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/blog' }],
  }),
  component: BlogIndexPage,
})

function BlogIndexPage() {
  return (
    <main className="blog-index-page">
      <header className="blog-index-header page-shell">
        <div>
          <p className="eyebrow">Field notes</p>
          <h1>Practical guides for the session and the bench.</h1>
        </div>
        <p>
          Tested workflows for turning calculations into settings, layouts,
          and files you can actually use.
        </p>
      </header>

      <section className="page-shell blog-feature" aria-labelledby="latest-guide">
        <div className="blog-feature-copy">
          <p className="directory-kicker">Highest search demand</p>
          <h2 id="latest-guide">Guitar String Tension Calculator: Gauge Guide</h2>
          <p>
            Learn why gauge alone cannot produce an exact result, how Unit Weight
            changes the calculation, and how to compare a current setup with a
            target tuning without inventing missing manufacturer data.
          </p>
          <div className="article-meta" aria-label="Article details">
            <span><CalendarBlank size={17} aria-hidden="true" /> Updated September 2, 2026</span>
            <span><Ruler size={17} aria-hidden="true" /> 1.9k volume · 31% KD</span>
          </div>
          <Link to="/blog/guitar-string-tension-calculator" className="primary-button">
            Read the string tension guide <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </Link>
        </div>
        <Link
          to="/blog/guitar-string-tension-calculator"
          className="blog-feature-image"
          aria-label="Read the guitar string tension guide"
        >
          <img
            src="/assets/images/blog/guitar-string-tension-formula.svg"
            alt="Guitar string tension formula and required inputs"
            width="1400"
            height="900"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
      </section>

      <section className="page-shell blog-directory" aria-labelledby="keyword-guides-title">
        <div className="blog-directory-heading">
          <div>
            <p className="eyebrow">Keyword guides</p>
            <h2 id="keyword-guides-title">Five search tasks, five focused answers.</h2>
          </div>
          <p>Search volume and KD are planning snapshots supplied for 2026, not traffic promises.</p>
        </div>
        <div className="blog-directory-list">
          {keywordGuides.map((guide, index) => (
            <article className="blog-directory-row" key={guide.to}>
              <span className="blog-row-number">{String(index + 1).padStart(2, '0')}</span>
              <img src={guide.image} alt={guide.alt} width="240" height="150" loading="lazy" />
              <div>
                <p className="directory-kicker">{guide.keyword}</p>
                <h3><Link to={guide.to}>{guide.title}</Link></h3>
                <p>{guide.summary}</p>
              </div>
              <dl>
                <div><dt>Volume</dt><dd>{guide.volume}</dd></div>
                <div><dt>KD</dt><dd>{guide.kd}</dd></div>
              </dl>
              <Link to={guide.to} className="blog-row-link" aria-label={`Read ${guide.title}`}>
                <ArrowRight size={20} weight="bold" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <aside className="page-shell blog-secondary-guide">
        <div>
          <p className="eyebrow">Related workshop guide</p>
          <h2>Printable Fret Template: Full-Scale Workshop Guide</h2>
          <p>Print at actual size, verify the calibration ruler, and align tiled pages without carrying an error across the fretboard.</p>
        </div>
        <Link to="/blog/printable-fret-template-guide" className="secondary-button">Read the print guide</Link>
      </aside>
    </main>
  )
}
