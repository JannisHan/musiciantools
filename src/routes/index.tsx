import { ArrowRight, Guitar, Ruler, Waveform } from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Musician Tools — Delay & Fret Calculators' },
      {
        name: 'description',
        content:
          'Professional delay patch and fret spacing tools for guitarists, pedal users, and instrument builders.',
      },
    ],
    links: [{ rel: 'canonical', href: 'https://musiciantools.app/' }],
  }),
  component: HomePage,
})

function HomePage() {
  return (
    <main>
      <section className="home-intro page-shell">
        <div>
          <p className="eyebrow">Purpose-built musician utilities</p>
          <h1>From musical idea to usable setting.</h1>
        </div>
        <p>
          Deep, focused tools for the two moments where rough calculations get
          in the way: dialing a rhythmic delay and laying out an instrument.
        </p>
      </section>

      <section className="page-shell home-tools" aria-labelledby="tools-title">
        <h2 id="tools-title" className="sr-only">Available tools</h2>
        <article className="home-tool-card timing-home-card">
          <div className="home-tool-icon"><Waveform size={30} weight="duotone" /></div>
          <p className="directory-kicker">For guitarists & pedal users</p>
          <h3>Delay Patch Builder</h3>
          <p>Start with a musical recipe, hear one bar, check your pedal limit, then copy the complete mono or stereo patch.</p>
          <div className="tool-proof"><span>5 recipes</span><span>One-bar audio</span><span>21 reference values</span></div>
          <Link to="/tools/bpm-delay-calculator" className="primary-button">
            Build a delay patch <ArrowRight size={19} weight="bold" />
          </Link>
        </article>
        <article className="home-tool-card fret-home-card">
          <div className="home-tool-icon"><Guitar size={30} weight="duotone" /></div>
          <p className="directory-kicker">For builders & repair benches</p>
          <h3>Fret Calculator</h3>
          <p>Calculate every centerline from the nut and export workshop-ready measurements or an actual-size print layout.</p>
          <div className="tool-proof"><span>10 presets</span><span>mm & inches</span><span>CSV · SVG · PDF</span></div>
          <Link to="/tools/fret-calculator" className="secondary-button">
            Calculate fret spacing <ArrowRight size={19} weight="bold" />
          </Link>
        </article>
      </section>

      <section className="trust-band">
        <div className="page-shell trust-band-inner">
          <Ruler size={26} weight="duotone" />
          <div><strong>Transparent math, useful output.</strong><span>Browser-based calculations, documented formulas, no account required.</span></div>
          <Link to="/methodology">Review the methodology</Link>
        </div>
      </section>
    </main>
  )
}
