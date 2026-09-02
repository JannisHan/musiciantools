import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const keywordPages = [
  {
    path: '/blog/guitar-string-tension-calculator',
    focus: 'guitar string tension calculator',
  },
  { path: '/blog/bpm-to-ms', focus: 'bpm to ms' },
  { path: '/blog/delay-time-calculator', focus: 'delay time calculator' },
  { path: '/blog/fret-calculator', focus: 'fret calculator' },
  { path: '/blog/fret-spacing-calculator', focus: 'fret spacing calculator' },
] as const

test('keyword articles expose complete standalone SEO and local images', async ({ page }) => {
  const consoleErrors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })

  for (const article of keywordPages) {
    await page.goto(article.path, { waitUntil: 'networkidle' })
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toBeVisible()
    expect((await heading.textContent())?.toLowerCase()).toContain(article.focus)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length).toBeGreaterThan(80)
    expect(description?.length).toBeLessThanOrEqual(150)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://musiciantools.app${article.path}`,
    )
    expect(await page.locator('script[type="application/ld+json"]').textContent()).toContain(
      '"@type":"Article"',
    )
    const articleImages = page.locator('article img')
    await expect(articleImages).toHaveCount(5)
    for (let index = 0; index < 5; index += 1) {
      const image = articleImages.nth(index)
      await image.scrollIntoViewIfNeeded()
      await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
    }
    expect((await page.locator('.article-body').innerText()).length).toBeGreaterThan(2000)
    await expect(page.locator('.vite-error-overlay')).toHaveCount(0)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
  }

  expect(consoleErrors).toEqual([])
})

test('blog index links all five keyword guides and remains accessible', async ({ page }) => {
  await page.goto('/blog', { waitUntil: 'networkidle' })
  for (const article of keywordPages) {
    await expect(page.locator(`a[href="${article.path}"]`).first()).toBeVisible()
  }
  const accessibility = await new AxeBuilder({ page }).analyze()
  expect(accessibility.violations).toEqual([])
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
})
