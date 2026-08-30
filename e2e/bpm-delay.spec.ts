import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('BPM / Delay calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/bpm-delay-calculator', { waitUntil: 'networkidle' })
    await expect(page.locator('.calculator-workspace')).toHaveAttribute(
      'data-hydrated',
      'true',
    )
  })

  test('renders useful defaults and updates the timing cards', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'BPM to MS & Delay Time Calculator',
      }),
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'At 120.0 BPM' })).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Copy 500.0 milliseconds for Quarter note',
      }),
    ).toBeVisible()

    await page.getByRole('spinbutton', { name: 'TEMPO' }).fill('90')

    await expect(page.getByRole('heading', { name: 'At 90.0 BPM' })).toBeVisible()
    await expect(
      page.getByRole('button', {
        name: 'Copy 666.7 milliseconds for Quarter note',
      }),
    ).toBeVisible()
  })

  test('marks values beyond a device maximum and keeps the full table', async ({
    page,
  }) => {
    await page
      .getByRole('spinbutton', { name: 'DEVICE MAX DELAY OPTIONAL' })
      .fill('400')

    await expect(page.locator('.timing-card.is-over')).toHaveCount(1)
    await expect(page.locator('.device-hint')).toContainText(
      'Longest in-range setting: Dotted eighth note',
    )

    await page.getByText('View full timing table').click()
    await expect(page.locator('tbody tr')).toHaveCount(21)
  })

  test('supports Tap Tempo, copy feedback, share state, and theme switching', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name === 'mobile-chromium',
      'Clipboard permission is only granted to the desktop project.',
    )

    const tap = page.getByRole('button', { name: /^Tap/ })
    await tap.click()
    await page.waitForTimeout(500)
    await tap.click()
    await page.waitForTimeout(500)
    await tap.click()
    await expect(page.locator('.tap-status')).toHaveText('Stable timing')
    await expect(tap).toContainText('BPM')

    await page.locator('.copy-button').first().click()
    await expect(page.locator('.copy-button').first()).toHaveText('Copied')

    await page.evaluate(() => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: undefined,
      })
    })
    await page.getByRole('button', { name: 'Share setup' }).click()
    await expect(page.locator('.screen-status')).toHaveText(
      'Share link copied.',
    )

    const theme = page.getByRole('button', { name: /Theme mode/ })
    await theme.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  })

  test('has no automatically detectable accessibility violations', async ({
    page,
  }) => {
    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })
})

test('home page leads to the active tool', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /Open BPM \/ Delay calculator/ }).click()
  await expect(page).toHaveURL(/\/tools\/bpm-delay-calculator$/)
})
