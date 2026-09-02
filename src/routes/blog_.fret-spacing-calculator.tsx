import { createFileRoute } from '@tanstack/react-router'
import KeywordSeoArticle, {
  keywordArticleHead,
  type KeywordArticleData,
} from '../components/KeywordSeoArticle'

const images = [
  {
    src: '/assets/images/blog/fret-centerline-preview.webp',
    alt: 'Fret spacing calculator preview showing shrinking intervals from nut to final fret',
    caption: 'Fret-to-fret spacing shrinks toward the bridge, but every workshop mark should still reference the nut.',
  },
  {
    src: '/assets/images/blog/printable-fret-template-workbench.webp',
    alt: 'Nut-based fret position table beside a tapered fingerboard layout',
    caption: 'Use adjacent spacing to inspect the pattern and nut-based distance to place each centerline.',
  },
  {
    src: '/assets/images/blog/fret-template-extent-options.webp',
    alt: 'Tapered fretboard width and board-end margin controls',
    caption: 'Board geometry determines the outline and template extent, not the musical fret positions.',
  },
  {
    src: '/assets/images/blog/tiled-fret-template-calibration.webp',
    alt: 'Tiled fret slotting template with calibration and page alignment marks',
    caption: 'Registration marks carry the centerline accurately across ordinary printer pages.',
    portrait: true,
    width: 900,
    height: 1200,
  },
  {
    src: '/assets/images/blog/fret-layout-export-formats.webp',
    alt: 'CSV, vector SVG, and tiled PDF options for fret slot placement',
    caption: 'Choose an output that matches the marking and cutting process on your bench.',
  },
]

const article: KeywordArticleData = {
  focusKeyword: 'fret spacing calculator',
  title: 'Fret Spacing Calculator: Workshop Layout Guide (2026)',
  description:
    'Calculate fret-to-fret spacing without cumulative error. Mark centerlines from the nut, prepare tapered boards, and print verified slotting templates.',
  keywords: 'fret spacing calculator, fret spacing chart, guitar fret spacing, fret slot template, luthier fret layout',
  url: 'https://musiciantools.app/blog/fret-spacing-calculator',
  eyebrow: 'Luthier workflow guide',
  deck:
    'The workshop challenge is not producing decimals. It is transferring dozens of shrinking intervals to wood without letting one small rounding or alignment error move every fret that follows.',
  intro:
    'Fret spacing is often described as a sequence: measure from one fret to the next, then continue toward the bridge. That description is convenient but risky. If each rounded interval becomes the origin for the next mark, small errors accumulate across the board. A better workflow calculates every fret centerline from the nut, uses adjacent spacing only as a cross-check, and keeps the same reference through the drawing, print, and slotting stages. This guide focuses on that physical transfer process: preparing the tapered board, choosing a template extent, joining tiled pages, and verifying the result before cutting.',
  searchVolume: '110',
  keywordDifficulty: '6%',
  readTime: '8 minute read',
  published: '2026-09-02T00:00:00+08:00',
  modified: '2026-09-02T00:00:00+08:00',
  images,
  sections: [
    {
      id: 'two-measurements',
      number: '01',
      heading: 'Understand the two spacing measurements',
      paragraphs: [
        'Distance from the nut tells you where each fret belongs on the scale. Previous spacing tells you the gap between adjacent fret centerlines. Both are valid results, but they serve different jobs.',
        'Use the nut-based value for layout and verification. Use previous spacing to inspect whether the intervals shrink smoothly and to estimate the working room for a saw guide or indexing jig.',
      ],
      table: {
        caption: 'Why the two columns are different',
        headers: ['Measurement', 'Reference', 'Workshop use'],
        rows: [
          ['From nut', 'One fixed origin', 'Primary centerline placement'],
          ['Previous spacing', 'Adjacent fret', 'Inspection and jig setup'],
          ['Remaining scale', 'Fret to bridge reference', 'Geometry check'],
        ],
      },
      image: images[1],
    },
    {
      id: 'avoid-error',
      number: '02',
      heading: 'Prevent cumulative spacing error',
      paragraphs: [
        'Suppose every adjacent interval is rounded to the nearest tenth of a millimeter, then added to the previous pencil mark. Some rounding errors cancel, but others reinforce each other. By the upper frets, the final centerline can drift even though no single step looked unreasonable.',
        'Direct nut-based positions remove that chain. Each fret is an independent measurement from the same zero point. If one mark is wrong, it does not redefine every mark after it.',
      ],
      formula: 'Place fret n at: L × (1 − 2⁻ⁿ⁄¹²) from the nut',
      bullets: [
        'Keep extra decimal precision in the calculation.',
        'Round only to the precision your measuring tool can reproduce.',
        'Do not add displayed fret-to-fret values to create later positions.',
        'Recheck fret 12 and the last fret from the nut.',
      ],
    },
    {
      id: 'board-geometry',
      number: '03',
      heading: 'Separate pitch geometry from board geometry',
      paragraphs: [
        'Scale length and fret number determine the centerline positions. Nut width, end width, and margin after the final fret determine the physical outline of the board. Changing the taper should not move a fret along the centerline.',
        'Choose the template end that matches the operation. A last-fret layout is enough for a slotting reference. A board-end layout helps when shaping the blank. A bridge reference is useful for assembly checks but should not be mistaken for an extension of the fretboard itself.',
      ],
      bullets: [
        'Last fret: smallest practical slotting template.',
        'Board end: includes real material after the final slot.',
        'Bridge reference: extends the theoretical centerline only.',
        'Nut and end widths: create the physical taper.',
      ],
      image: images[2],
    },
    {
      id: 'print-and-join',
      number: '04',
      heading: 'Print and join a tiled slotting template',
      paragraphs: [
        'Set the PDF print dialog to Actual size or 100%. Disable Fit, Shrink, and borderless enlargement. Print one page first and measure the calibration ruler before spending time trimming and joining the full template.',
        'Trim one side of each overlap and align the printed registration marks, centerline, and board outline. Paper edges are not reliable registration surfaces because printer margins vary between devices and even between feed trays.',
      ],
      table: {
        caption: 'Tiled print acceptance checks',
        headers: ['Check', 'Accept when', 'Reject when'],
        rows: [
          ['Calibration ruler', 'Measures exact length', 'Any scaling is visible'],
          ['Overlap marks', 'Crosshairs coincide', 'Marks form a doubled edge'],
          ['Centerline', 'Continuous across join', 'Line steps or changes angle'],
          ['Fret line', 'Square to centerline', 'Join introduces skew'],
        ],
      },
      image: images[3],
      link: {
        lead: 'For a complete print workflow, also read the',
        label: 'full-scale fret template guide',
        to: '/tools/fret-calculator',
        tail: 'and verify the calibration ruler before cutting.',
      },
    },
    {
      id: 'transfer-to-board',
      number: '05',
      heading: 'Transfer the centerlines to the workpiece',
      paragraphs: [
        'Secure the verified template so it cannot creep while marking. A light knife line can be more precise than a wide pencil mark, but the marking method must suit the finish and material. Treat every printed line as the intended slot center.',
        'Before cutting, compare the physical nut-to-12th-fret distance with half the scale length and inspect the final-fret position. These two checks catch most unit, scale, and print errors while the work is still reversible.',
      ],
      bullets: [
        'Reference the nut witness line, not the paper edge.',
        'Mark centerlines consistently with one tool.',
        'Confirm saw kerf and fret tang requirements separately.',
        'Keep the verified template with the build record.',
      ],
      image: images[4],
    },
  ],
  faqs: [
    {
      question: 'Should I measure each fret from the previous fret?',
      answer: 'Use adjacent spacing as a check, but place every fret from the nut. This prevents rounded intervals from accumulating into a larger final error.',
    },
    {
      question: 'Why does fret spacing get smaller?',
      answer: 'Each semitone shortens the remaining vibrating string length by the same ratio, so the absolute distance between fret centerlines decreases toward the bridge.',
    },
    {
      question: 'Does board taper change fret spacing?',
      answer: 'No. Taper changes the length of each drawn fret line across the board, but the centerline position along the scale remains the same.',
    },
    {
      question: 'How accurate should fret spacing measurements be?',
      answer: 'Keep full precision in the calculation, then use a marking and cutting method appropriate to the instrument. Avoid claiming precision finer than the physical tools can reproduce.',
    },
    {
      question: 'Can I print a fret spacing template on a home printer?',
      answer: 'Yes, with a tiled PDF. Print at 100%, verify the calibration ruler, and align registration marks rather than paper edges.',
    },
  ],
  conclusionTitle: 'Use spacing to inspect and the nut to locate',
  conclusion:
    'The safest layout keeps one origin from calculation to cutting. Place every centerline from the nut, use adjacent spacing to check the shrinking pattern, and verify the printed scale before transferring it to the board. That workflow contains individual marking errors instead of allowing them to travel down the entire instrument.',
  primaryCta: { label: 'Generate fret spacing', to: '/tools/fret-calculator' },
  secondaryCta: { label: 'Review the fret formula', to: '/methodology' },
}

export const Route = createFileRoute('/blog_/fret-spacing-calculator')({
  head: () => keywordArticleHead(article),
  component: () => <KeywordSeoArticle data={article} />,
})
