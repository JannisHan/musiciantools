import {
  ArrowRight,
  CalendarBlank,
  ChartLineUp,
  CheckCircle,
  Clock,
  Info,
} from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'

export type ArticleImage = {
  src: string
  alt: string
  caption: string
  width?: number
  height?: number
  portrait?: boolean
}

export type ArticleSection = {
  id: string
  number: string
  heading: string
  paragraphs: string[]
  subheading?: string
  bullets?: string[]
  formula?: string
  note?: string
  image?: ArticleImage
  table?: {
    caption: string
    headers: string[]
    rows: string[][]
  }
  link?: {
    lead: string
    label: string
    to: '/tools/bpm-delay-calculator' | '/tools/fret-calculator' | '/methodology'
    tail?: string
  }
}

export type KeywordArticleData = {
  focusKeyword: string
  title: string
  description: string
  keywords: string
  url: string
  eyebrow: string
  deck: string
  intro: string
  searchVolume: string
  keywordDifficulty: string
  readTime: string
  published: string
  modified: string
  images: ArticleImage[]
  sections: ArticleSection[]
  faqs: Array<{ question: string; answer: string }>
  conclusionTitle: string
  conclusion: string
  primaryCta: {
    label: string
    to: '/tools/bpm-delay-calculator' | '/tools/fret-calculator' | '/methodology'
  }
  secondaryCta?: {
    label: string
    to: '/tools/bpm-delay-calculator' | '/tools/fret-calculator' | '/methodology'
  }
}

export function keywordArticleHead(data: KeywordArticleData) {
  return {
    meta: [
      { title: data.title },
      { name: 'description', content: data.description },
      { name: 'keywords', content: data.keywords },
      { property: 'og:type', content: 'article' },
      { property: 'og:title', content: data.title },
      { property: 'og:description', content: data.description },
      { property: 'og:url', content: data.url },
      { property: 'og:image', content: `https://musiciantools.app${data.images[0].src}` },
      { property: 'article:published_time', content: data.published },
      { property: 'article:modified_time', content: data.modified },
    ],
    links: [{ rel: 'canonical', href: data.url }],
  }
}

export default function KeywordSeoArticle({ data }: { data: KeywordArticleData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.images.map((item) => `https://musiciantools.app${item.src}`),
    datePublished: data.published,
    dateModified: data.modified,
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
    mainEntityOfPage: { '@type': 'WebPage', '@id': data.url },
    about: data.keywords.split(',').map((keyword) => keyword.trim()),
  }

  return (
    <main className="article-page keyword-article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article>
        <header className="article-header page-shell">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span aria-hidden="true">/</span>
            <Link to="/blog">Blog</Link><span aria-hidden="true">/</span>
            <span>{data.focusKeyword}</span>
          </nav>
          <div className="article-heading-grid">
            <div>
              <p className="eyebrow">{data.eyebrow}</p>
              <h1>{data.title.replace(/ \(2026\)$/, '')}</h1>
            </div>
            <div className="article-deck">
              <p>{data.deck}</p>
              <div className="article-meta" aria-label="Article details">
                <span><CalendarBlank size={17} aria-hidden="true" /> Updated September 2, 2026</span>
                <span><Clock size={17} aria-hidden="true" /> {data.readTime}</span>
              </div>
            </div>
          </div>
          <div className="keyword-metric-strip" aria-label="Keyword research snapshot">
            <span><ChartLineUp size={18} aria-hidden="true" /> Focus keyword <strong>{data.focusKeyword}</strong></span>
            <span>Monthly volume <strong>{data.searchVolume}</strong></span>
            <span>Keyword difficulty <strong>{data.keywordDifficulty}</strong></span>
            <small>Planning snapshot supplied for 2026; rankings and traffic are not guaranteed.</small>
          </div>
        </header>

        <figure className="article-hero-media page-shell">
          <img
            src={data.images[0].src}
            alt={data.images[0].alt}
            width={data.images[0].width ?? 1400}
            height={data.images[0].height ?? 900}
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>{data.images[0].caption}</figcaption>
        </figure>

        <div className="article-layout page-shell">
          <aside className="article-toc" aria-label="On this page">
            <p>On this page</p>
            {data.sections.map((section) => (
              <a href={`#${section.id}`} key={section.id}>{section.heading}</a>
            ))}
            <a href="#faq">FAQ</a>
          </aside>

          <div className="article-body">
            <p className="article-intro">{data.intro}</p>
            {data.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <p className="section-number">{section.number}</p>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.formula ? <p className="article-formula">{section.formula}</p> : null}
                {section.subheading ? <h3>{section.subheading}</h3> : null}
                {section.bullets ? (
                  <div className="article-checklist">
                    {section.bullets.map((bullet) => (
                      <div key={bullet}>
                        <CheckCircle size={20} weight="fill" aria-hidden="true" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.table ? (
                  <div className="baseline-table-wrap">
                    <table>
                      <caption>{section.table.caption}</caption>
                      <thead><tr>{section.table.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row.join('|')}>{row.map((cell, columnIndex) => <td key={columnIndex}>{cell}</td>)}</tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
                {section.image ? (
                  <figure className={`article-figure${section.image.portrait ? ' portrait-figure' : ''}`}>
                    <img
                      src={section.image.src}
                      alt={section.image.alt}
                      width={section.image.width ?? 1200}
                      height={section.image.height ?? 760}
                      loading="lazy"
                    />
                    <figcaption>{section.image.caption}</figcaption>
                  </figure>
                ) : null}
                {section.note ? (
                  <div className="experience-note">
                    <Info size={24} weight="duotone" aria-hidden="true" />
                    <span>{section.note}</span>
                  </div>
                ) : null}
                {section.link ? (
                  <p className="article-inline-link">
                    {section.link.lead}{' '}
                    <Link to={section.link.to}>{section.link.label}</Link>
                    {section.link.tail ? ` ${section.link.tail}` : ''}
                  </p>
                ) : null}
              </section>
            ))}

            <section id="faq" className="article-faq">
              <p className="section-number">FAQ</p>
              <h2>{data.focusKeyword} FAQ</h2>
              {data.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </section>

            <section className="article-conclusion">
              <p className="eyebrow">Next step</p>
              <h2>{data.conclusionTitle}</h2>
              <p>{data.conclusion}</p>
              <div className="article-actions">
                <Link to={data.primaryCta.to} className="primary-button">
                  {data.primaryCta.label} <ArrowRight size={18} weight="bold" aria-hidden="true" />
                </Link>
                {data.secondaryCta ? (
                  <Link to={data.secondaryCta.to} className="secondary-button">
                    {data.secondaryCta.label}
                  </Link>
                ) : null}
              </div>
            </section>
          </div>
        </div>
      </article>
    </main>
  )
}
