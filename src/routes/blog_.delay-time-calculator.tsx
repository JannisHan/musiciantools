import { createFileRoute } from '@tanstack/react-router'
import KeywordSeoArticle, {
  keywordArticleHead,
  type KeywordArticleData,
} from '../components/KeywordSeoArticle'

const images = [
  {
    src: '/assets/images/blog/delay-time-calculator-workbench.webp',
    alt: 'Delay time calculator with BPM, rhythmic recipe, and pedal-ready millisecond values',
    caption: 'A useful delay setting combines tempo, rhythmic intent, channel layout, and the limits of the pedal or plugin.',
  },
  {
    src: '/assets/images/blog/dotted-eighth-delay-result.webp',
    alt: 'Stereo dotted eighth and quarter delay result with a three-to-two relationship',
    caption: 'A dotted eighth against a quarter note creates a clear 3:2 relationship rather than two unrelated echoes.',
  },
  {
    src: '/assets/images/blog/pedal-delay-limit-check.webp',
    alt: 'Maximum delay range check showing a compatible alternative subdivision',
    caption: 'The best fallback preserves the rhythmic role instead of merely choosing the nearest number.',
  },
  {
    src: '/assets/images/blog/tap-tempo-input-control.webp',
    alt: 'Tempo input and Tap control for finding a performance BPM',
    caption: 'Tap several steady beats when the track has no dependable tempo marker.',
  },
  {
    src: '/assets/images/blog/bpm-millisecond-reference-table.webp',
    alt: 'Delay timing reference with straight, dotted, and triplet subdivisions',
    caption: 'Use the full table to compare musical options before committing to a patch.',
  },
]

const article: KeywordArticleData = {
  focusKeyword: 'delay time calculator',
  title: 'Delay Time Calculator: Pedal & Plugin Guide (2026)',
  description:
    'Set delay time from BPM with straight, dotted and triplet values. Check pedal limits, build mono or stereo patches, and preview the rhythm.',
  keywords: 'delay time calculator, delay pedal settings, dotted eighth delay, stereo delay time, tempo delay calculator',
  url: 'https://musiciantools.app/blog/delay-time-calculator',
  eyebrow: 'Delay setup guide',
  deck:
    'A millisecond value is only the start. A dependable patch also needs a rhythmic purpose, the right feedback space, and a fallback when the hardware cannot reach the calculated time.',
  intro:
    'Delay problems usually appear after the calculation, not during it. You can enter the correct BPM and still end up with a cluttered part, two stereo channels that fight each other, or a setting beyond the pedal’s maximum range. This guide uses the calculator as a patch-building tool rather than a number generator. You will choose a subdivision by musical role, translate it into milliseconds, check whether the device can produce it, and listen to the pattern before saving the result. The examples focus on guitar pedals and studio plugins, but the timing relationships apply to any tempo-synced echo.',
  searchVolume: '480',
  keywordDifficulty: '20%',
  readTime: '9 minute read',
  published: '2026-09-02T00:00:00+08:00',
  modified: '2026-09-02T00:00:00+08:00',
  images,
  sections: [
    {
      id: 'inputs',
      number: '01',
      heading: 'What a practical delay calculator needs',
      paragraphs: [
        'The minimum inputs are tempo and note value. A more useful setup also records meter, mono or stereo output, the relationship between channels, and the device’s maximum delay time. Those details decide whether the result is playable and repeatable.',
        'When the song BPM is known, enter it directly. When it is not, Tap Tempo should use several recent intervals and reset after a pause. Two taps can produce a quick estimate, but four or more even taps are more reliable for a drifting performance.',
      ],
      bullets: [
        'Tempo between 20 and 400 BPM covers most practical music sessions.',
        'Straight, dotted, and triplet divisions should use the unrounded quarter-note duration.',
        'Meter changes the pattern preview even when the raw millisecond value stays the same.',
        'A saved patch should include the note name beside the number.',
      ],
      image: images[3],
    },
    {
      id: 'choose-rhythm',
      number: '02',
      heading: 'Choose the delay by rhythmic job',
      paragraphs: [
        'A quarter-note echo leaves space and reinforces the pulse. An eighth note adds motion without the strong offbeat pull of a dotted eighth. Triplets create a rolling feel, while shorter sixteenth values can thicken a line until the repeats begin to resemble ambience.',
        'The dotted eighth is popular because each repeat lands three sixteenth notes after the dry attack. Against steady eighth-note picking, the repeats fill the missing sixteenth positions and produce a busier pattern than the player performs.',
      ],
      formula: 'At 120 BPM: quarter = 500 ms · dotted eighth = 375 ms · eighth = 250 ms',
      table: {
        caption: 'Practical delay starting points',
        headers: ['Role', 'Subdivision', 'Typical use'],
        rows: [
          ['Wide pulse', 'Quarter note', 'Slow lead lines and sparse arrangements'],
          ['Interlocking rhythm', 'Dotted eighth', 'Picked patterns and rhythmic guitar'],
          ['Tight movement', 'Eighth note', 'Faster parts and subtle repeats'],
          ['Rolling repeat', 'Eighth triplet', 'Shuffle, triplet, and polyrhythmic feels'],
        ],
      },
      image: images[1],
    },
    {
      id: 'device-limits',
      number: '03',
      heading: 'Check the pedal or plugin range',
      paragraphs: [
        'Older digital pedals, compact multi-effects, and some specialized modes have shorter maximum delay times than their headline specification suggests. A low BPM combined with a long subdivision can exceed that range.',
        'Do not simply clamp the number to the maximum. That produces a repeat with no clear musical relationship. Choose a shorter subdivision that keeps the same feel, or double the effective tempo if the part supports that interpretation.',
      ],
      table: {
        caption: 'Example at 60 BPM with an 800 ms device limit',
        headers: ['Subdivision', 'Calculated time', 'Result'],
        rows: [
          ['Quarter note', '1000 ms', 'Over limit'],
          ['Dotted eighth', '750 ms', 'Compatible'],
          ['Eighth note', '500 ms', 'Compatible'],
          ['Eighth triplet', '333.3 ms', 'Compatible'],
        ],
      },
      note:
        'Some pedals expose different maximum times in different modes. Check the manual for the selected mode, not only the maximum printed on the product page.',
      image: images[2],
    },
    {
      id: 'stereo',
      number: '04',
      heading: 'Build stereo delay as one relationship',
      paragraphs: [
        'A stereo patch is easier to understand when the channels form a simple musical ratio. A dotted eighth on the left and a quarter note on the right create a 3:4 duration ratio, while the repeat rates form the inverse relationship. Another useful pairing is an eighth note against a dotted eighth.',
        'Keep feedback and mix conservative when both sides are active. Two dense repeat streams can mask the dry signal faster than a single mono delay. Start with one or two clear repeats, then add feedback while listening in the full arrangement.',
      ],
      bullets: [
        'Label left and right channels with both note value and milliseconds.',
        'Check the maximum delay independently for each side.',
        'Preview at least one complete bar to hear the repeat cycle.',
        'Collapse to mono once to check for an unexpectedly crowded center.',
      ],
      image: images[4],
    },
    {
      id: 'save-patch',
      number: '05',
      heading: 'Save a patch you can rebuild later',
      paragraphs: [
        'A screenshot of one number is not enough. Record the BPM, meter, subdivision, exact millisecond value, channel assignment, device mode, feedback, and mix. If the tempo changes later, the note relationship tells you how to recalculate the patch.',
        'A shareable URL is useful for rehearsal notes and remote sessions because it preserves the calculation inputs. Keep the clean calculator URL as the canonical page while the query parameters store the temporary patch state.',
      ],
      link: {
        lead: 'Build, preview, copy, and share the complete setting with the',
        label: 'Delay Patch Builder',
        to: '/tools/bpm-delay-calculator',
        tail: 'instead of saving disconnected numbers.',
      },
    },
  ],
  faqs: [
    {
      question: 'What is the formula for delay time?',
      answer: 'For a quarter note, divide 60,000 by the BPM. Multiply or divide that duration according to the straight, dotted, or triplet subdivision you need.',
    },
    {
      question: 'What delay time should I use at 120 BPM?',
      answer: 'Common starting points are 500 ms for a quarter note, 375 ms for a dotted eighth, 250 ms for an eighth note, and about 166.7 ms for an eighth-note triplet.',
    },
    {
      question: 'Why is dotted eighth delay good for guitar?',
      answer: 'It places repeats between steady picked notes, creating a denser rhythmic pattern without requiring the player to perform every subdivision.',
    },
    {
      question: 'What if my pedal cannot reach the calculated delay time?',
      answer: 'Choose a shorter musical subdivision that fits the available range. Avoid setting the pedal to an arbitrary maximum value with no tempo relationship.',
    },
    {
      question: 'Should stereo delay channels use the same time?',
      answer: 'They can, but different related subdivisions usually create a wider and more animated pattern. Keep the relationship simple enough to hear and rebuild.',
    },
  ],
  conclusionTitle: 'Build the rhythm before turning the knobs',
  conclusion:
    'Start with the role of the repeat, calculate the subdivision, check both device channels, and hear a complete bar. Once the rhythm works, adjust feedback, mix, tone, and modulation in the real arrangement. That order keeps the patch musical and makes every later change easier to diagnose.',
  primaryCta: { label: 'Build a delay patch', to: '/tools/bpm-delay-calculator' },
  secondaryCta: { label: 'See the timing methodology', to: '/methodology' },
}

export const Route = createFileRoute('/blog_/delay-time-calculator')({
  head: () => keywordArticleHead(article),
  component: () => <KeywordSeoArticle data={article} />,
})
