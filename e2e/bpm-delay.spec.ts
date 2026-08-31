import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('Delay Patch Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator', { waitUntil: 'networkidle' })
    await expect(page.locator('.patch-builder')).toHaveAttribute('data-hydrated', 'true')
  })

  test('builds and shares a stereo dotted-eighth patch', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Build a delay patch.' })).toBeVisible()
    await expect(page.getByText('375.0ms')).toBeVisible()
    await expect(page.getByText('250.0ms')).toBeVisible()
    await expect(page.getByText('Stereo relationship')).toContainText('3:2')
    if (testInfo.project.name === 'mobile-chromium') {
      await expect(page.getByRole('button', { name: /^Tap/ })).toContainText('Tap')
    }

    await page.getByRole('spinbutton', { name: 'Tempo' }).fill('90')
    await expect(page.getByText('500.0ms')).toBeVisible()
    await page.getByRole('button', { name: /Ambient/ }).click()
    await expect(page.getByRole('heading', { name: 'Ambient' })).toBeVisible()

    await page.getByRole('button', { name: 'Mono' }).click()
    await expect(page.locator('.channel-card')).toHaveCount(1)

    if (testInfo.project.name === 'desktop-chromium') {
      await page.getByRole('button', { name: 'Copy patch' }).click()
      await expect(page.locator('.screen-status')).toHaveText('Patch copied.')
      await page.getByRole('button', { name: 'Share' }).click()
      await expect(page).toHaveURL(/recipe=ambient/)
    }
  })

  test('checks pedal limits, previews one bar, and keeps the full table', async ({ page }) => {
    await page.getByRole('spinbutton', { name: 'Maximum delay Optional' }).fill('300')
    await expect(page.locator('.compatibility.is-over')).toBeVisible()
    await expect(page.getByText(/Try Eighth note/)).toBeVisible()

    const preview = page.getByRole('button', { name: 'Preview pattern' })
    await preview.click()
    await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible()
    await page.getByRole('button', { name: 'Stop' }).click()

    await page.getByText('Reference table & reverse converter').click()
    await expect(page.locator('.reference-panel tbody tr')).toHaveCount(21)
  })

  test('is accessible and has no horizontal page overflow', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
})

test.describe('Fret Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/fret-calculator', { waitUntil: 'networkidle' })
    await expect(page.locator('.fret-calculator')).toHaveAttribute('data-hydrated', 'true')
  })

  test('calculates a standard 25.5 inch layout and switches units', async ({ page }, testInfo) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Build an accurate fret layout.' })).toBeVisible()
    expect(await page.locator('.template-settings').evaluate((element) => element.tagName)).toBe('DETAILS')
    await expect(page.locator('.template-settings')).not.toHaveAttribute('open', '')
    await expect(page.getByText(/12th fret check: 12.750 in/)).toBeVisible()
    await expect(page.getByText('2 pages - 10 mm overlap')).toBeVisible()
    await page.getByRole('button', { name: 'Millimeters' }).click()
    await expect(page.getByText(/12th fret check: 323.85 mm/)).toBeVisible()
    if (testInfo.project.name === 'mobile-chromium') {
      const resultHeading = await page.getByText('Calculated layout').boundingBox()
      expect(resultHeading?.y ?? Number.POSITIVE_INFINITY).toBeLessThan(900)
      const inchButton = await page.getByRole('button', { name: 'Inches' }).boundingBox()
      const unitButton = await page.getByRole('button', { name: 'Millimeters' }).boundingBox()
      const viewport = page.viewportSize()
      expect(inchButton).not.toBeNull()
      expect(unitButton).not.toBeNull()
      expect(viewport).not.toBeNull()
      expect(Math.abs((inchButton?.width ?? 0) - (unitButton?.width ?? 0))).toBeLessThanOrEqual(1)
      expect((unitButton?.x ?? 0) + (unitButton?.width ?? 0)).toBeLessThanOrEqual(viewport?.width ?? 0)
    }
    await page.getByRole('spinbutton', { name: 'Frets' }).fill('22')
    await expect(page.locator('.fret-table-scroll tbody tr')).toHaveCount(22)
    await page.locator('.fret-table-scroll tbody tr').nth(3).locator('td').first().click()
    await expect(page.locator('.selected-fret-card > div').first().locator('strong')).toHaveText('4')
  })

  test('provides working zoom controls and user-selected template extents', async ({ page }, testInfo) => {
    const preview = page.locator('.fretboard-visual')
    await expect(preview).toHaveCSS('width', /.+/)
    await page.getByRole('button', { name: 'Zoom in' }).click()
    await expect(page.getByText('125%', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Fit' }).click()
    await expect(page.getByText('100%', { exact: true })).toBeVisible()

    await page.getByText('Workshop template options').click()
    await page.getByRole('button', { name: /Bridge reference/ }).click()
    await expect(page.getByText('3 pages - 10 mm overlap')).toBeVisible()
    await expect(page.getByText('Theoretical bridge - no compensation')).toBeVisible()
    if (testInfo.project.name === 'desktop-chromium') {
      const bridgePdfPromise = page.waitForEvent('download')
      await page.getByRole('button', { name: 'Download print PDF' }).click()
      await (await bridgePdfPromise).saveAs('artifacts/design-qa/fret-layout-bridge-letter.pdf')
    }

    await page.getByRole('button', { name: /Board end/ }).click()
    await expect(page.getByRole('spinbutton', { name: 'Margin after final fret' })).toBeVisible()
    await expect(page.getByText('2 pages - 10 mm overlap')).toBeVisible()
    await page.getByRole('spinbutton', { name: 'Nut width' }).fill('0')
    await expect(page.getByRole('spinbutton', { name: 'Nut width' })).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('spinbutton', { name: 'Scale length' })).toHaveAttribute('aria-invalid', 'false')
    await page.getByRole('button', { name: 'Reset template' }).click()
    await expect(page.getByRole('spinbutton', { name: 'Nut width' })).toHaveValue('1.693')
    await expect(page.getByRole('button', { name: /Last fret/ })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: /Board end/ }).click()

    if (testInfo.project.name === 'desktop-chromium') {
      await page.getByRole('button', { name: 'Share this layout' }).click()
      await expect(page).toHaveURL(/extent=board-end/)
      await expect(page).not.toHaveURL(/999999/)
    }
  })

  test('downloads CSV, SVG, and tiled PDF exports', async ({ page }, testInfo) => {
    const csvPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /CSV measurements/ }).click()
    expect((await csvPromise).suggestedFilename()).toBe('fret-layout.csv')

    const svgPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: /1:1 tapered SVG/ }).click()
    expect((await svgPromise).suggestedFilename()).toBe('fret-layout-actual-size.svg')

    const pdfPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Download print PDF' }).click()
    const pdfDownload = await pdfPromise
    expect(pdfDownload.suggestedFilename()).toBe('fret-layout-letter.pdf')
    await expect(page.locator('.export-panel .screen-status')).toHaveText('Tiled PDF downloaded.')
    await expect(page.getByRole('button', { name: 'Download print PDF' })).toHaveAttribute('aria-busy', 'false')
    if (testInfo.project.name === 'desktop-chromium') {
      await pdfDownload.saveAs('artifacts/design-qa/fret-layout-default-letter.pdf')
    }
  })

  test('is accessible and has no horizontal page overflow', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
    const clippedTemplateControls = await page.locator('.extent-options button').evaluateAll((buttons) =>
      buttons.some((button) => button.scrollWidth > button.clientWidth + 1),
    )
    expect(clippedTemplateControls).toBe(false)
    const clippedToolSections = await page.locator('.fret-controls, .fret-preview-panel, .fret-results-panel, .export-panel').evaluateAll((sections) => {
      const calculatorRight = document.querySelector('.fret-calculator')?.getBoundingClientRect().right ?? 0
      return sections.some((section) => section.getBoundingClientRect().right > calculatorRight + 1)
    })
    expect(clippedToolSections).toBe(false)
    await expect(page.getByRole('spinbutton', { name: 'Frets' })).toBeInViewport()
  })
})

test('home page leads to both deep tools', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: /Build a delay patch/ })).toBeVisible()
  await expect(page.getByRole('link', { name: /Calculate fret spacing/ })).toBeVisible()
})

test('core routes load without browser console errors', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.goto('/tools/bpm-delay-calculator', { waitUntil: 'networkidle' })
  await page.goto('/tools/fret-calculator', { waitUntil: 'networkidle' })

  expect(errors).toEqual([])
})
