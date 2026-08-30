import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/methodology')({
  head: () => ({
    meta: [
      { title: 'Calculation Methodology — Musician Tools' },
      {
        name: 'description',
        content:
          'The formulas, rounding rules, device-limit logic, and Tap Tempo method used by Musician Tools.',
      },
    ],
    links: [
      { rel: 'canonical', href: 'https://musiciantools.app/methodology' },
    ],
  }),
  component: MethodologyPage,
})

function MethodologyPage() {
  return (
    <main className="content-page page-shell">
      <p className="eyebrow">Methodology</p>
      <h1>What the calculator does with your tempo.</h1>
      <p className="content-lead">
        The BPM / Delay calculator uses standard musical timing relationships.
        It does not estimate hardware behavior or modify results for a specific
        brand.
      </p>
      <div className="method-list">
        <section>
          <span>01</span>
          <div>
            <h2>Quarter-note duration</h2>
            <p>
              A minute contains 60,000 milliseconds, so quarter-note duration
              is <code>60,000 ÷ BPM</code>.
            </p>
          </div>
        </section>
        <section>
          <span>02</span>
          <div>
            <h2>Note relationships</h2>
            <p>
              Whole, half, quarter, eighth, sixteenth, thirty-second, and
              sixty-fourth notes are derived from the quarter note. Dotted
              values multiply duration by 1.5; triplets multiply it by 2/3.
            </p>
          </div>
        </section>
        <section>
          <span>03</span>
          <div>
            <h2>Tap Tempo</h2>
            <p>
              Tap Tempo averages recent valid intervals, keeps the latest eight,
              filters one-off timing outliers, and uses an adaptive 2–5 second
              reset window. The longer first interval supports tempos down to
              20 BPM.
            </p>
          </div>
        </section>
        <section>
          <span>04</span>
          <div>
            <h2>Device limits and rounding</h2>
            <p>
              A device maximum only marks values as in or out of range; it does
              not remove them. Internal values are calculated before display
              rounding, with milliseconds retained to three decimal places.
            </p>
          </div>
        </section>
      </div>
      <p className="revision-note">Method revision: 1.0 · August 30, 2026</p>
    </main>
  )
}
