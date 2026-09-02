import { createFileRoute } from '@tanstack/react-router'
import KeywordSeoArticle, {
  keywordArticleHead,
  type KeywordArticleData,
} from '../components/KeywordSeoArticle'

const images = [
  {
    src: '/assets/images/blog/bpm-to-ms-workbench.webp',
    alt: 'BPM to ms workbench showing tempo input and millisecond timing results',
    caption: 'A tempo becomes useful when the result is shown in the note value your session actually needs.',
  },
  {
    src: '/assets/images/blog/dotted-eighth-delay-result.webp',
    alt: 'Dotted eighth and quarter note millisecond results at 120 BPM',
    caption: 'Straight, dotted, and triplet values are relationships to the same unrounded quarter-note duration.',
  },
  {
    src: '/assets/images/blog/bpm-millisecond-reference-table.webp',
    alt: 'Tempo reference table with note divisions in milliseconds and hertz',
    caption: 'A complete reference table is faster than repeating the same calculation for every subdivision.',
  },
  {
    src: '/assets/images/blog/tap-tempo-input-control.webp',
    alt: 'Tap tempo control used to estimate song speed before conversion',
    caption: 'Tap tempo is useful when the track has no reliable BPM label or drifts around a live performance.',
  },
  {
    src: '/assets/images/blog/pedal-delay-limit-check.webp',
    alt: 'Pedal maximum delay check with a compatible timing alternative',
    caption: 'A correct number is not a usable setting until it fits the range of the device.',
  },
]

const article: KeywordArticleData = {
  focusKeyword: 'bpm to ms',
  title: 'BPM to MS: Complete Conversion Chart & Guide (2026)',
  description:
    'Convert BPM to milliseconds for delay, reverb, compression and modulation. Use formulas, timing charts and straight, dotted or triplet note values.',
  keywords: 'bpm to ms, bpm to milliseconds, tempo to milliseconds, bpm ms chart, milliseconds to bpm',
  url: 'https://musiciantools.app/blog/bpm-to-ms',
  eyebrow: 'Studio timing guide',
  deck:
    'The quarter-note formula is simple. The practical work starts when you need the right subdivision, a value your device accepts, and enough precision to keep several effects moving together.',
  intro:
    'A BPM label describes musical speed, while many pedals, plugins, and automation lanes ask for milliseconds. That gap creates needless guesswork during a session: the delay is close but not locked, the compressor release breathes against the groove, or a reverb pre-delay blurs the attack. This guide turns tempo into usable time values without hiding the math. You will see the core formula, learn how straight, dotted, and triplet notes relate, and know when to use a chart, Tap Tempo, or a live calculator. Every example keeps full internal precision and rounds only the displayed result.',
  searchVolume: '1,000',
  keywordDifficulty: '3%',
  readTime: '8 minute read',
  published: '2026-09-02T00:00:00+08:00',
  modified: '2026-09-02T00:00:00+08:00',
  images,
  sections: [
    {
      id: 'formula',
      number: '01',
      heading: 'The BPM to milliseconds formula',
      paragraphs: [
        'One minute contains 60,000 milliseconds. Divide that number by the tempo to get the duration of one quarter note. At 120 BPM, a quarter note lasts 500 ms. An eighth note is half of that value, and a sixteenth note is one quarter of it.',
        'Keep the unrounded quarter-note value when deriving other divisions. Rounding an early step can introduce small differences across a long delay pattern or modulation chain.',
      ],
      formula: 'Quarter-note milliseconds = 60,000 ÷ BPM',
      table: {
        caption: 'Common straight-note values',
        headers: ['BPM', 'Quarter', 'Eighth', 'Sixteenth'],
        rows: [
          ['60', '1000.0 ms', '500.0 ms', '250.0 ms'],
          ['80', '750.0 ms', '375.0 ms', '187.5 ms'],
          ['100', '600.0 ms', '300.0 ms', '150.0 ms'],
          ['120', '500.0 ms', '250.0 ms', '125.0 ms'],
          ['140', '428.6 ms', '214.3 ms', '107.1 ms'],
        ],
      },
      image: images[1],
    },
    {
      id: 'note-values',
      number: '02',
      heading: 'Straight, dotted, and triplet timing',
      paragraphs: [
        'Dotted and triplet values are not separate tempo systems. A dotted note lasts one and a half times the matching straight note. A triplet division fits three equal notes into the time normally occupied by two.',
        'At 120 BPM, the straight eighth is 250 ms, the dotted eighth is 375 ms, and the eighth-note triplet is about 166.7 ms. Those three settings can make the same riff feel spacious, syncopated, or tightly rolling without changing the song tempo.',
      ],
      bullets: [
        'Dotted value: straight duration × 1.5',
        'Triplet value: matching straight duration × 2 ÷ 3',
        'Frequency in hertz: 1000 ÷ milliseconds',
        'Reverse conversion: 60,000 ÷ quarter-note milliseconds',
      ],
      image: images[2],
    },
    {
      id: 'studio-uses',
      number: '03',
      heading: 'Where tempo-based milliseconds help in a mix',
      paragraphs: [
        'Delay is the obvious use, but the same timing grid can organize a mix. Reverb pre-delay can leave room for the dry attack. Compressor release can recover between beats instead of pumping randomly. Tremolo, chorus, filter movement, and sidechain envelopes can share related straight or triplet values.',
        'These are starting points rather than rules. A vocal may need a slightly shorter pre-delay to stay connected, and a bass compressor may need a release that avoids distortion before it follows the tempo. Listen first, then move away from the calculated value deliberately.',
      ],
      subheading: 'Start with the musical role',
      bullets: [
        'Use quarter or half-note times for obvious rhythmic echoes.',
        'Use eighth or sixteenth values for movement that stays behind the performance.',
        'Use a related but offset value when every effect locking perfectly sounds mechanical.',
        'Check whether the control expects milliseconds, seconds, hertz, or a note symbol.',
      ],
      image: images[3],
    },
    {
      id: 'chart-or-calculator',
      number: '04',
      heading: 'When to use a chart, Tap Tempo, or calculator',
      paragraphs: [
        'A printed chart is ideal when you repeatedly work at familiar tempos and want zero setup. A calculator is better when the BPM is unusual, several note values are needed, or the device has a hard maximum delay. Tap Tempo is the quickest path when you only have the recording or a live player.',
        'For Tap Tempo, use several even taps rather than two rushed hits. Long pauses should reset the estimate; otherwise one old interval can pull the result away from the current pulse.',
      ],
      note:
        'Treat a Tap Tempo result as an estimate when a live performance drifts. A useful setting may follow the average groove better than a constantly changing decimal value.',
      image: images[4],
      link: {
        lead: 'Enter a tempo, hear one bar, and copy a complete setting in the',
        label: 'BPM delay workbench',
        to: '/tools/bpm-delay-calculator',
        tail: 'without retyping the formula.',
      },
    },
    {
      id: 'mistakes',
      number: '05',
      heading: 'Common conversion mistakes',
      paragraphs: [
        'The most common error is choosing the right number for the wrong note value. A 500 ms delay at 120 BPM is a quarter note, not an eighth. The next is mixing seconds and milliseconds: 0.375 seconds and 375 milliseconds are identical, but many controls display only one unit.',
        'Finally, a mathematically correct result can exceed the pedal or plugin range. Check the device limit before building the rest of a patch around a value it cannot produce.',
      ],
      bullets: [
        'Confirm whether the BPM represents quarter-note tempo.',
        'Label the note value beside every copied number.',
        'Do not round until the final displayed value.',
        'Check stereo channels independently when their subdivisions differ.',
      ],
    },
  ],
  faqs: [
    {
      question: 'How many milliseconds is 120 BPM?',
      answer: 'At 120 BPM, one quarter note is 500 ms, an eighth note is 250 ms, a dotted eighth is 375 ms, and an eighth-note triplet is about 166.7 ms.',
    },
    {
      question: 'How do I convert milliseconds back to BPM?',
      answer: 'If the millisecond value represents a quarter note, divide 60,000 by that value. A 500 ms quarter note equals 120 BPM.',
    },
    {
      question: 'Why does my calculator show a decimal?',
      answer: 'Many tempos do not divide evenly into 60,000. Keep the decimal internally and round only for the precision supported by the device.',
    },
    {
      question: 'Is BPM to ms useful beyond delay?',
      answer: 'Yes. The same values can guide reverb pre-delay, compressor release, tremolo, LFO rates, gates, and other time-based controls.',
    },
    {
      question: 'Should every effect use the exact calculated value?',
      answer: 'No. The calculated value is a musical reference. Small intentional offsets can preserve clarity or make a groove feel less rigid.',
    },
  ],
  conclusionTitle: 'Turn the number into a setting you can hear',
  conclusion:
    'Use the formula to understand the relationship, then use the workbench when speed matters. Choose a musical subdivision, confirm the device range, preview the rhythm, and copy the result with its note label so it remains understandable when you reopen the session.',
  primaryCta: { label: 'Convert BPM into a patch', to: '/tools/bpm-delay-calculator' },
  secondaryCta: { label: 'Review the timing method', to: '/methodology' },
}

export const Route = createFileRoute('/blog_/bpm-to-ms')({
  head: () => keywordArticleHead(article),
  component: () => <KeywordSeoArticle data={article} />,
})
