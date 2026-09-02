import {
  ArrowRight,
  CalendarBlank,
  CheckCircle,
  Clock,
  Printer,
  Ruler,
  Warning,
} from '@phosphor-icons/react'
import { Link, createFileRoute } from '@tanstack/react-router'

// Keep shared metadata and structured data on the same clean canonical URL.
const ARTICLE_URL = 'https://musiciantools.app/blog/printable-fret-template-guide'

export const Route = createFileRoute('/blog_/printable-fret-template-guide')({
  head: () => ({
    meta: [
      { title: 'Printable Fret Template: Full-Scale Workshop Guide (2026)' },
      {
        name: 'description',
        content:
          'Create and print a full-scale fret template, verify scale and page overlap, avoid scaling errors, and export accurate SVG or tiled PDF layouts.',
      },
      {
        name: 'keywords',
        content:
          'printable fret template, full scale fret template, fret spacing template, guitar fret template PDF, how to print fret template',
      },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: 'Printable Fret Template: Full-Scale Workshop Guide (2026)' },
      {
        property: 'og:description',
        content: 'A practical workflow for creating, checking, and printing an accurate full-scale fret layout.',
      },
      { property: 'og:url', content: ARTICLE_URL },
      {
        property: 'og:image',
        content: 'https://musiciantools.app/assets/images/blog/printable-fret-template-workbench.webp',
      },
      { property: 'article:published_time', content: '2026-09-02T00:00:00+08:00' },
      { property: 'article:modified_time', content: '2026-09-02T00:00:00+08:00' },
    ],
    links: [{ rel: 'canonical', href: ARTICLE_URL }],
  }),
  component: PrintableFretTemplateGuide,
})

function PrintableFretTemplateGuide() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Printable Fret Template: Full-Scale Workshop Guide (2026)',
    description:
      'A practical workflow for creating, checking, and printing an accurate full-scale fret layout.',
    image: [
      'https://musiciantools.app/assets/images/blog/printable-fret-template-workbench.webp',
      'https://musiciantools.app/assets/images/blog/fret-centerline-preview.webp',
      'https://musiciantools.app/assets/images/blog/fret-layout-export-formats.webp',
    ],
    datePublished: '2026-09-02T00:00:00+08:00',
    dateModified: '2026-09-02T00:00:00+08:00',
    author: {
      '@type': 'Organization',
      name: 'Musician Tools',
      url: 'https://musiciantools.app/about',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Musician Tools',
      url: 'https://musiciantools.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://musiciantools.app/favicon.svg',
      },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': ARTICLE_URL },
    about: ['Fret layout', 'Fret spacing', 'Guitar building', 'Full-scale printing'],
  }

  return (
    <main className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article>
        <header className="article-header page-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/blog">Blog</Link><span aria-hidden="true">/</span>
            <span>Printable fret template</span>
          </nav>
          <div className="article-heading-grid">
            <div>
              <p className="eyebrow">Workshop guide</p>
              <h1>Printable Fret Template: Full-Scale Workshop Guide</h1>
            </div>
            <div className="article-deck">
              <p>
                A fret layout can be mathematically correct and still fail on the
                bench. The usual culprit is not the formula—it is a print dialog
                quietly set to “Fit,” a page overlap joined on the wrong marks, or
                a template measured from an unclear reference edge.
              </p>
              <div className="article-meta" aria-label="Article details">
                <span><CalendarBlank size={17} aria-hidden="true" /> Updated September 2, 2026</span>
                <span><Clock size={17} aria-hidden="true" /> 9 minute read</span>
              </div>
            </div>
          </div>
        </header>

        <figure className="article-hero-media page-shell">
          <img
            src="/assets/images/blog/printable-fret-template-workbench.webp"
            alt="Printable fret template workbench showing scale length, fret count, and calculated layout"
            width="1400"
            height="900"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            Start with the manufacturing inputs, then inspect the calculated layout before exporting.
          </figcaption>
        </figure>

        <div className="article-layout page-shell">
          <aside className="article-toc" aria-label="On this page">
            <p>On this page</p>
            <a href="#what-you-need">What you need</a>
            <a href="#create-template">Create the template</a>
            <a href="#print-actual-size">Print at actual size</a>
            <a href="#verify-layout">Verify the layout</a>
            <a href="#common-mistakes">Common mistakes</a>
            <a href="#faq">FAQ</a>
          </aside>

          <div className="article-body">
            <p className="article-intro">
              If you are building or replacing a fretboard, a printable fret
              template saves time only when the physical output matches the
              calculated scale. This guide follows the same workflow we use to
              test Musician Tools: define the instrument, choose the physical end
              of the template, export a true-size file, verify its ruler, then
              check one known fret before a saw touches wood. The goal is simple:
              turn accurate numbers into an accurate object.
            </p>

            <section id="what-you-need">
              <p className="section-number">01</p>
              <h2>What you need before creating a full-scale fret template</h2>
              <p>
                Gather the scale length, fret count, unit, and the physical width
                of the board at the nut and its far end. Use the instrument’s
                actual design dimensions rather than a label such as “standard
                guitar.” Two instruments sold as the same scale can still differ
                in board width, final-fret count, and the amount of material left
                beyond the last slot.
              </p>
              <div className="article-checklist">
                <div><CheckCircle size={20} weight="fill" aria-hidden="true" /><span><strong>Scale length:</strong> nut witness point to theoretical bridge line</span></div>
                <div><CheckCircle size={20} weight="fill" aria-hidden="true" /><span><strong>Fret count:</strong> the number of centerlines you intend to cut</span></div>
                <div><CheckCircle size={20} weight="fill" aria-hidden="true" /><span><strong>Board geometry:</strong> nut width, end width, and any margin after the final fret</span></div>
                <div><CheckCircle size={20} weight="fill" aria-hidden="true" /><span><strong>Output plan:</strong> large-format SVG or tiled Letter/A4 PDF</span></div>
              </div>
              <p>
                For equal-tempered frets, the distance from the nut to fret
                <em> n</em> is <code>dₙ = L × (1 − 2⁻ⁿ⁄¹²)</code>. That makes the
                12th fret exactly half the theoretical scale length—a useful
                independent check later.
              </p>
            </section>

            <section id="create-template">
              <p className="section-number">02</p>
              <h2>Create the printable fret template from manufacturing inputs</h2>
              <h3>1. Enter scale length and fret count</h3>
              <p>
                Open the <Link to="/tools/fret-calculator">fret calculator and printable layout tool</Link>,
                choose a close preset, then replace the preset values with your
                measured design. Keep units consistent. Converting halfway through
                a hand calculation is a common source of rounding and transcription
                errors; the tool can switch the display without changing the stored
                geometry.
              </p>

              <figure className="article-figure">
                <img
                  src="/assets/images/blog/fret-centerline-preview.webp"
                  alt="Fret centerline preview with nut, numbered frets, and board end"
                  width="1200"
                  height="760"
                  loading="lazy"
                />
                <figcaption>Every result represents a fret centerline measured from the nut reference.</figcaption>
              </figure>

              <h3>2. Choose where the physical template ends</h3>
              <p>
                This decision should match the job on the bench. A last-fret
                template is compact. A board-end template includes the margin
                beyond the last fret and shows the real tapered board. A bridge
                reference extends only the center reference line to the theoretical
                bridge; it does not pretend the wooden board continues that far.
              </p>

              <figure className="article-figure">
                <img
                  src="/assets/images/blog/fret-template-extent-options.webp"
                  alt="Fret template extent options for last fret, board end, and bridge reference"
                  width="1200"
                  height="760"
                  loading="lazy"
                />
                <figcaption>Choose the shortest extent that still gives you the physical references needed for the job.</figcaption>
              </figure>

              <h3>3. Inspect the preview before export</h3>
              <p>
                Zoom into the nut, final fret, board end, and bridge reference.
                Confirm the taper moves in the expected direction and select a few
                rows in the measurement table. At this stage you are checking
                intent: the software cannot know that you typed 24.75 inches when
                your drawing called for 25.5.
              </p>
            </section>

            <section id="print-actual-size">
              <p className="section-number">03</p>
              <h2>Export and print the fret template at actual size</h2>
              <p>
                Use SVG when a print shop, laser workflow, or CAD application can
                preserve vector dimensions. Use the tiled PDF for an ordinary
                Letter or A4 printer. Both formats should remain vector-based so
                fret centerlines stay crisp at full scale.
              </p>

              <figure className="article-figure">
                <img
                  src="/assets/images/blog/fret-layout-export-formats.webp"
                  alt="Fret layout export controls for CSV, full-scale SVG, and tiled PDF"
                  width="1200"
                  height="760"
                  loading="lazy"
                />
                <figcaption>CSV is for inspection; SVG and PDF carry the physical layout.</figcaption>
              </figure>

              <div className="print-callout">
                <Printer size={28} weight="duotone" aria-hidden="true" />
                <div>
                  <h3>Use these print settings</h3>
                  <p>
                    Select <strong>Actual size</strong> or <strong>100%</strong>.
                    Turn off Fit, Shrink oversized pages, and any borderless option
                    that applies automatic enlargement. Print one test page before
                    committing the full set.
                  </p>
                </div>
              </div>

              <h3>Join tiled pages by the marks, not by the paper edges</h3>
              <p>
                Home printers rarely place artwork at an identical distance from
                every sheet edge. Trim one side of the overlap, align the printed
                registration marks and the continuous centerline, then tape the
                sheets while they are flat. The 10 mm overlap is working space; it
                is not another dimension to add to the scale.
              </p>

              <figure className="article-figure portrait-figure">
                <img
                  src="/assets/images/blog/tiled-fret-template-calibration.webp"
                  alt="Tiled fret template PDF page with calibration ruler and alignment marks"
                  width="900"
                  height="1200"
                  loading="lazy"
                />
                <figcaption>Measure the calibration ruler on paper before aligning the remaining pages.</figcaption>
              </figure>
            </section>

            <section id="verify-layout">
              <p className="section-number">04</p>
              <h2>Verify the paper layout before cutting fret slots</h2>
              <p>
                Treat the printed sheet as a new measurement tool that must be
                calibrated. First measure the 100 mm or 4 inch reference ruler.
                Then check the nut-to-12th-fret distance. On a 25.5 inch scale, the
                12th fret centerline must be 12.750 inches from the nut. Finally,
                check the last fret and make sure page joins have not introduced a
                step or skew.
              </p>
              <div className="baseline-table-wrap">
                <table>
                  <caption>Our 25.5 inch, 24-fret print baseline</caption>
                  <thead><tr><th>Check</th><th>Expected result</th><th>Why it matters</th></tr></thead>
                  <tbody>
                    <tr><td>Calibration ruler</td><td>100 mm / 4.000 in</td><td>Detects printer scaling</td></tr>
                    <tr><td>12th fret</td><td>12.750 in from nut</td><td>Checks half-scale geometry</td></tr>
                    <tr><td>Last-fret extent</td><td>2 Letter pages</td><td>Checks tiling and overlap</td></tr>
                    <tr><td>Bridge reference extent</td><td>3 Letter pages</td><td>Confirms the reference line is included</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="experience-note">
                <Ruler size={24} weight="duotone" aria-hidden="true" />
                <span><strong>Bench rule:</strong> if the printed ruler is wrong, stop. Do not compensate by moving individual fret marks; fix the print scale and print again.</span>
              </p>
            </section>

            <section id="common-mistakes">
              <p className="section-number">05</p>
              <h2>Five mistakes that ruin an otherwise accurate fret layout</h2>
              <ol className="mistake-list">
                <li><strong>Printing with Fit enabled.</strong> A small percentage error compounds across the full board.</li>
                <li><strong>Measuring from page edges.</strong> Fret positions are measured from the nut reference, not the paper margin.</li>
                <li><strong>Treating lines as slot edges.</strong> The exported marks are centerlines; your saw kerf is a separate manufacturing choice.</li>
                <li><strong>Confusing board end with bridge position.</strong> The physical fretboard usually ends well before the theoretical bridge reference.</li>
                <li><strong>Skipping the paper check.</strong> A correct file does not guarantee a correctly scaled printer output.</li>
              </ol>
              <div className="warning-callout">
                <Warning size={26} weight="fill" aria-hidden="true" />
                <p>
                  A mathematical fret layout does not include saddle compensation,
                  nut compensation, multiscale fan geometry, or temperament changes.
                  Use a design built specifically for those cases.
                </p>
              </div>
            </section>

            <section id="faq" className="article-faq">
              <p className="section-number">06</p>
              <h2>Printable fret template FAQ</h2>
              <details>
                <summary>Should I use SVG or PDF for a full-scale fret template?</summary>
                <p>Use SVG for CAD, a print shop, or a wide-format vector workflow. Use a tiled PDF for a home Letter or A4 printer. Both can be accurate when printed at 100%.</p>
              </details>
              <details>
                <summary>How do I know the fret template printed at the correct scale?</summary>
                <p>Measure the included 100 mm or 4 inch ruler with a reliable physical ruler. Then confirm that fret 12 is exactly half the scale length from the nut.</p>
              </details>
              <details>
                <summary>Are fret positions measured to the center of each slot?</summary>
                <p>Yes. The layout marks fret centerlines. Do not treat those lines as the two edges of a saw kerf.</p>
              </details>
              <details>
                <summary>Can I use the bridge reference as a compensated saddle location?</summary>
                <p>No. It is the theoretical scale-length reference. Saddle compensation depends on the instrument, string, setup, and playing conditions.</p>
              </details>
              <details>
                <summary>Can this workflow create a multiscale or fanned-fret template?</summary>
                <p>No. The current tool produces single-scale, 12-tone equal-tempered layouts. A multiscale design needs separate bass and treble scales plus a chosen perpendicular fret.</p>
              </details>
            </section>

            <section className="article-conclusion">
              <p className="eyebrow">Ready for the bench</p>
              <h2>Calculate once. Verify twice. Cut once.</h2>
              <p>
                The reliable workflow is short: enter the real dimensions, inspect
                the intended extent, export a vector layout, print at 100%, and
                verify both the calibration ruler and the 12th fret. Keep the
                checked paper template with your build notes so the layout remains
                traceable later.
              </p>
              <div className="article-actions">
                <Link to="/tools/fret-calculator" className="primary-button">
                  Create a fret template <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </Link>
                <Link to="/methodology" className="secondary-button">Review formulas and limits</Link>
              </div>
              <p className="related-reading">
                Also working on pedal timing? Use the <Link to="/tools/bpm-delay-calculator">BPM to delay patch builder</Link> to turn a tempo into straight, dotted, or triplet settings.
              </p>
            </section>
          </div>
        </div>
      </article>
    </main>
  )
}
