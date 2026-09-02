import { createFileRoute } from '@tanstack/react-router'
import KeywordSeoArticle, {
  keywordArticleHead,
  type KeywordArticleData,
} from '../components/KeywordSeoArticle'

const images = [
  {
    src: '/assets/images/blog/printable-fret-template-workbench.webp',
    alt: 'Fret calculator with scale length input, 24-fret results, and visual layout',
    caption: 'A complete calculation keeps the instrument inputs, centerline results, and physical export in one traceable workflow.',
  },
  {
    src: '/assets/images/blog/fret-centerline-preview.webp',
    alt: 'Nut-based fret centerlines across a single-scale fingerboard preview',
    caption: 'The visual preview makes the shrinking interval between higher frets easy to inspect.',
  },
  {
    src: '/assets/images/blog/fret-template-extent-options.webp',
    alt: 'Instrument scale and fretboard geometry controls for a physical layout',
    caption: 'Scale length controls pitch geometry; board width and extent control the physical drawing.',
  },
  {
    src: '/assets/images/blog/fret-layout-export-formats.webp',
    alt: 'Fret measurement exports in CSV, actual-size SVG, and tiled PDF',
    caption: 'Use numerical output for checking and vector output for full-scale workshop transfer.',
  },
  {
    src: '/assets/images/blog/tiled-fret-template-calibration.webp',
    alt: 'Printed fret layout page with centerlines and a calibration ruler',
    caption: 'The exported file is not verified until the physical calibration ruler measures correctly.',
    portrait: true,
    width: 900,
    height: 1200,
  },
]

const article: KeywordArticleData = {
  focusKeyword: 'fret calculator',
  title: 'Fret Calculator: Accurate Scale Length Guide (2026)',
  description:
    'Calculate guitar, bass and ukulele fret positions from scale length. Understand the formula, verify fret 12, and export accurate workshop layouts.',
  keywords: 'fret calculator, guitar fret calculator, fret position calculator, scale length calculator, printable fret layout',
  url: 'https://musiciantools.app/blog/fret-calculator',
  eyebrow: 'Instrument geometry guide',
  deck:
    'The formula is consistent, but the result is only trustworthy when scale length, reference points, centerlines, units, and physical output all mean exactly what the builder thinks they mean.',
  intro:
    'A fret position list looks authoritative because it contains precise decimals. That precision can be misleading if the scale was measured from the wrong points, inches and millimeters were mixed, or the lines were treated as slot edges instead of centers. This guide explains what a fret calculator should compute, how 12-tone equal temperament determines each position, and how to check the result before using it on an instrument. The workflow applies to standard single-scale guitars, basses, ukuleles, mandolins, and banjos. Multiscale layouts, compensation, and alternative temperaments require additional design decisions and are outside this calculation.',
  searchVolume: '260',
  keywordDifficulty: '9%',
  readTime: '9 minute read',
  published: '2026-09-02T00:00:00+08:00',
  modified: '2026-09-02T00:00:00+08:00',
  images,
  sections: [
    {
      id: 'inputs',
      number: '01',
      heading: 'Enter the scale length, not the board length',
      paragraphs: [
        'Scale length is the vibrating length from the nut witness point to the theoretical bridge or saddle reference. It is not the total neck length, the fretboard length, or the distance to the end of the wooden board.',
        'Choose an instrument preset only as a starting point. Confirm the actual design dimension before calculating, especially when replacing an existing board or copying an instrument whose nominal scale may have been rounded for marketing.',
      ],
      bullets: [
        'Measure from the nut witness point, not the front edge of a thick nut blank.',
        'Use the theoretical scale for fret geometry; saddle compensation is handled separately.',
        'Select the intended fret count before creating a print extent.',
        'Keep one unit system through measurement and marking.',
      ],
      image: images[2],
    },
    {
      id: 'formula',
      number: '02',
      heading: 'How equal-tempered fret positions are calculated',
      paragraphs: [
        'In 12-tone equal temperament, every semitone multiplies frequency by the twelfth root of two. The remaining vibrating string length therefore shrinks by the inverse of that ratio at each fret.',
        'The direct nut-based formula avoids accumulating rounded fret-to-fret distances. Calculate every centerline from the original scale length, then derive the previous spacing by subtracting adjacent nut-based positions.',
      ],
      formula: 'Distance from nut to fret n: dₙ = L × (1 − 2⁻ⁿ⁄¹²)',
      table: {
        caption: '25.5 inch scale checkpoints',
        headers: ['Fret', 'From nut', 'Remaining scale'],
        rows: [
          ['1', '1.431 in', '24.069 in'],
          ['5', '6.402 in', '19.098 in'],
          ['7', '8.479 in', '17.021 in'],
          ['12', '12.750 in', '12.750 in'],
          ['24', '19.125 in', '6.375 in'],
        ],
      },
      image: images[1],
    },
    {
      id: 'read-results',
      number: '03',
      heading: 'Read nut position, previous spacing, and remaining scale',
      paragraphs: [
        'The nut-based position is the primary manufacturing value because every line shares one stable origin. Previous spacing is useful for inspection and saw setup, but it should not become a chain of rounded measurements.',
        'Remaining scale is a useful diagnostic value. At fret 12 it must equal half the original scale, and at fret 24 it must equal one quarter. If those checkpoints fail, the input or formula is wrong.',
      ],
      note:
        'Select several rows across the layout rather than checking only the first fret. A unit error or wrong scale can look plausible near the nut and become obvious farther down the board.',
    },
    {
      id: 'exports',
      number: '04',
      heading: 'Choose the right output for the job',
      paragraphs: [
        'CSV is the most transparent output for reviewing numbers, importing measurements into another system, or keeping a build record. SVG preserves true vector dimensions for CAD and large-format printing. A tiled PDF makes the same geometry practical on a Letter or A4 printer.',
        'The drawing extent should match the job. Ending at the final fret keeps the template compact. Ending at the physical board includes the margin after the last slot. A theoretical bridge reference can extend the centerline without falsely extending the wooden board.',
      ],
      table: {
        caption: 'Output selection',
        headers: ['Format', 'Best for', 'Critical check'],
        rows: [
          ['CSV', 'Measurement review', 'Unit and decimal precision'],
          ['SVG', 'CAD or print shop', 'Preserved physical dimensions'],
          ['Tiled PDF', 'Home Letter/A4 printing', '100% scale and page overlap'],
        ],
      },
      image: images[3],
      link: {
        lead: 'Calculate and export all three formats with the',
        label: 'workshop fret layout tool',
        to: '/tools/fret-calculator',
        tail: 'using one shared geometry model.',
      },
    },
    {
      id: 'verification',
      number: '05',
      heading: 'Verify the calculation and the physical print',
      paragraphs: [
        'First confirm that fret 12 is exactly half the scale length from the nut. Next compare one or two positions with an independent calculation. If you print a template, measure the included 100 mm or 4 inch ruler before aligning pages.',
        'Printing at Fit or Shrink changes every fret position. Correct the print setting and print again rather than moving individual lines to compensate for a scaled sheet.',
      ],
      bullets: [
        'Check the original scale-length entry.',
        'Verify fret 12 at exactly half scale.',
        'Confirm exported units before opening another program.',
        'Measure the paper calibration ruler before cutting.',
      ],
      image: images[4],
    },
  ],
  faqs: [
    {
      question: 'How do you calculate fret positions?',
      answer: 'For fret n, multiply the scale length by one minus two raised to the power of negative n divided by 12. Measure each result from the nut.',
    },
    {
      question: 'Is the 12th fret always half the scale length?',
      answer: 'In a standard 12-tone equal-tempered layout, yes. The 12th-fret centerline is exactly half the theoretical scale length from the nut.',
    },
    {
      question: 'Are fret positions measured to the center of the slot?',
      answer: 'Yes. The calculated line is the fret or slot centerline. Saw kerf width is a separate manufacturing consideration.',
    },
    {
      question: 'Does a fret calculation include saddle compensation?',
      answer: 'No. The fret layout uses theoretical scale length. Saddle compensation depends on the instrument, string, action, and setup.',
    },
    {
      question: 'Can the same formula be used for bass and ukulele?',
      answer: 'Yes for standard single-scale, 12-tone equal-tempered instruments. Use the correct scale length and intended fret count for that instrument.',
    },
  ],
  conclusionTitle: 'Keep one reference from input to finished layout',
  conclusion:
    'Use the nut as the stable origin, derive every fret directly from the full scale, and verify the half-scale checkpoint. When the numerical and physical outputs share the same geometry, the result stays understandable from the first calculation to the final printed template.',
  primaryCta: { label: 'Calculate a fret layout', to: '/tools/fret-calculator' },
  secondaryCta: { label: 'Read the formula methodology', to: '/methodology' },
}

export const Route = createFileRoute('/blog_/fret-calculator')({
  head: () => keywordArticleHead(article),
  component: () => <KeywordSeoArticle data={article} />,
})
