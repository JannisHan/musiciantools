import { createFileRoute } from '@tanstack/react-router'
import KeywordSeoArticle, {
  keywordArticleHead,
  type KeywordArticleData,
} from '../components/KeywordSeoArticle'

const images = [
  {
    src: '/assets/images/blog/guitar-string-tension-formula.svg',
    alt: 'Guitar string tension calculator formula using unit weight, scale length, and frequency',
    caption: 'Tension depends on the physical string, vibrating length, and target pitch—not gauge alone.',
  },
  {
    src: '/assets/images/blog/string-tension-input-model.svg',
    alt: 'String tension inputs for construction, unit weight, scale length, and tuning',
    caption: 'A trustworthy input model identifies the exact string construction and the source behind its Unit Weight.',
  },
  {
    src: '/assets/images/blog/current-target-string-comparison.svg',
    alt: 'Current and target guitar string configurations compared by relative tension',
    caption: 'Compare a proposed setup with a known baseline instead of judging isolated pounds as universally correct.',
  },
  {
    src: '/assets/images/blog/balanced-string-tension-profile.svg',
    alt: 'Relative tension profile across a six-string guitar set',
    caption: 'A profile reveals abrupt changes between neighboring strings that a total-tension figure can hide.',
  },
  {
    src: '/assets/images/blog/string-data-source-checklist.svg',
    alt: 'Manufacturer string data checklist with product, construction, source, and verification date',
    caption: 'Traceable source metadata is part of the calculation, not an optional footnote.',
  },
]

const article: KeywordArticleData = {
  focusKeyword: 'guitar string tension calculator',
  title: 'Guitar String Tension Calculator: Gauge Guide (2026)',
  description:
    'Understand guitar string tension by gauge, tuning and scale length. Learn the formula, compare setups, and avoid unreliable cross-brand estimates.',
  keywords: 'guitar string tension calculator, string gauge tension, drop tuning string tension, guitar string tension chart, balanced tension strings',
  url: 'https://musiciantools.app/blog/guitar-string-tension-calculator',
  eyebrow: 'String setup guide',
  deck:
    'The arithmetic is straightforward. The difficult part is the data: two strings with the same printed gauge can produce different tension because construction and Unit Weight differ.',
  intro:
    'Changing tuning, scale length, or string gauge changes the feel of a guitar before the truss rod or bridge is adjusted. A tension calculation can make that change predictable, but only when it uses data for the actual string construction. Gauge by itself is not enough. Plain steel, nickel-wound, coated, round-core, and hex-core strings with the same diameter do not necessarily share the same Unit Weight. This guide explains the standard formula, shows how to compare a current setup with a target setup, and separates useful relative guidance from false claims of universal accuracy. It does not invent missing manufacturer data or label a configuration structurally safe.',
  searchVolume: '1,900',
  keywordDifficulty: '31%',
  readTime: '10 minute read',
  published: '2026-09-02T00:00:00+08:00',
  modified: '2026-09-02T00:00:00+08:00',
  images,
  sections: [
    {
      id: 'formula',
      number: '01',
      heading: 'The guitar string tension formula',
      paragraphs: [
        'The standard imperial calculation uses Unit Weight in pounds per inch, vibrating length in inches, and frequency in hertz. The constant converts the resulting force into pounds-force.',
        'Scale length and frequency are squared inside the formula. That is why a modest increase in scale or pitch can create a noticeable change, while simply comparing gauge numbers can miss the actual behavior of the string.',
      ],
      formula: 'T = UW × (2 × L × F)² ÷ 386.4',
      table: {
        caption: 'Formula variables',
        headers: ['Symbol', 'Meaning', 'Required source'],
        rows: [
          ['T', 'Tension in pounds-force', 'Calculated result'],
          ['UW', 'Unit Weight in lb/in', 'Exact string construction data'],
          ['L', 'Vibrating scale length in inches', 'Instrument measurement'],
          ['F', 'Target frequency in hertz', 'Tuning and octave'],
        ],
      },
      image: images[1],
    },
    {
      id: 'gauge-is-not-data',
      number: '02',
      heading: 'Why gauge alone cannot provide an exact result',
      paragraphs: [
        'Diameter describes the outside size, not the distribution of mass. A wound string combines a core and wrap wire, and manufacturers vary core shape, material, wrap dimensions, coatings, and tolerances.',
        'A generic estimator can be useful for rough comparison when it clearly states its model. It should not present that estimate as the official tension of another company’s product or silently mix data from different series.',
      ],
      bullets: [
        'Match brand, product series, material, construction, and gauge.',
        'Store Unit Weight with its source URL and publication version.',
        'Separate manufacturer values from modeled estimates.',
        'Do not interpolate across wound and plain-string construction boundaries.',
      ],
      note:
        'A result with more decimal places is not more accurate when the Unit Weight source is unknown.',
      image: images[4],
    },
    {
      id: 'compare-setups',
      number: '03',
      heading: 'Compare the current setup with the target setup',
      paragraphs: [
        'An isolated value such as 17 pounds does not tell you whether the new setup will feel familiar. Start with a configuration you already know, then compare each target string against its current counterpart.',
        'For a lower tuning, the target gauge usually needs more mass to recover a similar tension. For a longer scale, the same string at the same pitch will produce more tension. The comparison should show both per-string change and total change without declaring a universal safe threshold.',
      ],
      table: {
        caption: 'Useful comparison outputs',
        headers: ['Output', 'Question it answers', 'Limit'],
        rows: [
          ['Per-string change', 'Which string feels most different?', 'Does not describe construction safety'],
          ['Total tension change', 'How much does the overall pull move?', 'Can hide an uneven set'],
          ['Profile spread', 'Are neighboring strings balanced?', 'Feel remains player-dependent'],
          ['Current vs target', 'Which gauge restores a baseline?', 'Depends on source data quality'],
        ],
      },
      image: images[2],
    },
    {
      id: 'balanced-profile',
      number: '04',
      heading: 'Read the tension profile, not only the total',
      paragraphs: [
        'Two six-string sets can have nearly identical total tension and feel very different. One may place most of the difference on the wound strings, while another may have a stiff third string or unusually loose lowest string.',
        'Look for abrupt jumps between neighbors and compare them with the familiar set. Balanced tension does not have one universal shape; some players prefer a firmer bass side, while others want each string closer to the same force.',
      ],
      bullets: [
        'Inspect every string rather than averaging the set.',
        'Compare plain-to-wound transitions carefully.',
        'Use playing feel and setup measurements alongside the calculation.',
        'Expect intonation, relief, and action to need adjustment after a large change.',
      ],
      image: images[3],
    },
    {
      id: 'trustworthy-calculator',
      number: '05',
      heading: 'What a trustworthy calculator should disclose',
      paragraphs: [
        'A reliable tool should identify where every preset value came from, when it was last checked, and whether the number is a manufacturer specification or an estimate. It should also state that tension is one part of setup—not a structural guarantee for a specific instrument.',
        'Musician Tools is holding back its preset calculator until a traceable Unit Weight dataset and acceptable data-use boundary are established. Publishing a polished interface with guessed values would create confidence without evidence.',
      ],
      bullets: [
        'Exact product or SKU and string construction',
        'Unit Weight source, version, and verification date',
        'Visible formula, units, and rounding behavior',
        'Current-versus-target comparison without unsupported safety labels',
      ],
      link: {
        lead: 'Review how calculations, sources, and limitations are handled in the',
        label: 'Musician Tools methodology',
        to: '/methodology',
        tail: 'before relying on any setup number.',
      },
    },
  ],
  faqs: [
    {
      question: 'Does thicker string gauge always mean higher tension?',
      answer: 'For the same construction, scale length, and pitch, a thicker string normally has greater Unit Weight and tension. Cross-brand or cross-construction comparisons still need exact data.',
    },
    {
      question: 'How does scale length affect guitar string tension?',
      answer: 'With the same string and pitch, tension changes with the square of scale length. A longer scale therefore produces higher tension.',
    },
    {
      question: 'How does drop tuning affect string tension?',
      answer: 'Lowering pitch reduces tension. A heavier gauge can recover some of the previous feel, but the correct comparison requires Unit Weight for the actual strings.',
    },
    {
      question: 'What is balanced string tension?',
      answer: 'It describes how tension is distributed across a set. There is no single required profile; the useful goal is a deliberate, playable relationship between neighboring strings.',
    },
    {
      question: 'Can a calculator tell me whether a string set is safe for my guitar?',
      answer: 'Not by itself. Instrument construction, condition, hardware, setup, and manufacturer limits matter. Use tension results for comparison and consult the instrument maker or a qualified technician when structural risk is uncertain.',
    },
  ],
  conclusionTitle: 'Trust the source before trusting the decimal',
  conclusion:
    'Use tension as a comparison tool: document the current setup, obtain traceable Unit Weight data, calculate the target at the correct scale and pitch, then inspect both the individual strings and the whole profile. That process is slower than guessing from gauge, but it produces a result worth using.',
  primaryCta: { label: 'Review calculation methodology', to: '/methodology' },
  secondaryCta: { label: 'Open the fret layout tool', to: '/tools/fret-calculator' },
}

export const Route = createFileRoute('/blog_/guitar-string-tension-calculator')({
  head: () => keywordArticleHead(article),
  component: () => <KeywordSeoArticle data={article} />,
})
