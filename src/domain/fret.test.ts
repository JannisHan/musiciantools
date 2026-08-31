import { PDFDocument } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import {
  calculateFretPositions,
  createFretCsv,
  createFretPdfLayout,
  createFretTemplate,
  createFretSvg,
  DEFAULT_FRET_TEMPLATE,
  fromMillimeters,
  parseFretSearch,
  serializeFretState,
  templateWidthAt,
  toMillimeters,
  validateFretTemplateSettings,
} from './fret'
import { createFretPdf } from './fret-pdf'

describe('fret calculator', () => {
  const input = { scaleLength: 25.5, unit: 'in' as const, fretCount: 24 }

  it('places the twelfth fret at exactly half the scale length', () => {
    const positions = calculateFretPositions(input)
    expect(positions[11].distanceFromNutMm).toBeCloseTo(323.85, 8)
    expect(positions[11].remainingScaleMm).toBeCloseTo(323.85, 8)
  })

  it('prints the default 24-fret template on two Letter pages without an empty bridge page', () => {
    const template = createFretTemplate(input, DEFAULT_FRET_TEMPLATE)
    const layout = createFretPdfLayout(template.lengthMm, 'letter')

    expect(template.lengthMm).toBeCloseTo(485.775, 6)
    expect(layout.pages).toHaveLength(2)
    expect(layout.pages.at(-1)?.endMm).toBeCloseTo(485.775, 6)
  })

  it('interpolates a tapered fretboard from the nut to the template end', () => {
    const template = createFretTemplate(input, {
      ...DEFAULT_FRET_TEMPLATE,
      nutWidthMm: 43,
      endWidthMm: 56,
    })

    expect(templateWidthAt(template, 0)).toBeCloseTo(43, 8)
    expect(templateWidthAt(template, template.lengthMm / 2)).toBeCloseTo(49.5, 8)
    expect(templateWidthAt(template, template.lengthMm)).toBeCloseTo(56, 8)
  })

  it('round-trips length units', () => {
    expect(fromMillimeters(toMillimeters(25.5, 'in'), 'in')).toBeCloseTo(25.5, 10)
  })

  it('creates CSV and physical SVG exports with calibration rulers', () => {
    const csv = createFretCsv(input)
    expect(csv.split('\n')).toHaveLength(25)
    expect(csv).toContain('Distance from nut (in)')

    const svg = createFretSvg(input, '25.5 inch layout')
    expect(svg).toContain('width="521.775mm"')
    expect(svg).toContain('<polygon')
    expect(svg).toContain('100 mm')
    expect(svg).toContain('4 in')
  })

  it('draws an explicit bridge reference only when the user requests the full scale', () => {
    const settings = {
      ...DEFAULT_FRET_TEMPLATE,
      extent: 'bridge' as const,
    }
    const template = createFretTemplate(input, settings)
    const svg = createFretSvg(input, 'Bridge layout', settings)

    expect(svg).toContain('width="683.700mm"')
    expect(svg).toContain('Bridge reference')
    expect(template).toHaveProperty('boardEndMm', 495.775)
    expect(svg).toContain('513.775')
    expect(svg).toContain('class="bridge-extension"')
    expect(svg).not.toContain('665.700,')
  })

  it('tiles long scales with ten millimeters of overlap', () => {
    const layout = createFretPdfLayout(863.6, 'letter')
    expect(layout.pages.length).toBeGreaterThan(3)
    expect(layout.overlapMm).toBe(10)
    expect(layout.pages[1].startMm).toBeCloseTo(layout.contentWidthMm - 10, 6)
    expect(layout.pages.at(-1)?.endMm).toBe(863.6)
  })

  it('describes the exact overlap bands users must align on adjacent pages', () => {
    const template = createFretTemplate(input, DEFAULT_FRET_TEMPLATE)
    const layout = createFretPdfLayout(template.lengthMm, 'letter')

    expect(layout.pages[0].previousOverlapMm).toBe(0)
    expect(layout.pages[0].nextOverlapMm).toBe(10)
    expect(layout.pages[1].previousOverlapMm).toBe(10)
    expect(layout.pages[1].nextOverlapMm).toBe(0)
  })

  it('does not create an orphan page when the previous sheet already covers the template end', () => {
    const layout = createFretPdfLayout(495.775, 'letter')

    expect(layout.pages).toHaveLength(2)
    expect(layout.pages[1].endMm).toBeCloseTo(495.775, 6)
  })

  it('creates a valid multi-page PDF', async () => {
    const bytes = await createFretPdf(input, { paper: 'letter', title: 'Fret layout' })
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-')
    const pdf = await PDFDocument.load(bytes)
    expect(pdf.getPageCount()).toBe(2)
  })

  it('rejects workshop geometry that cannot produce a usable tapered template', () => {
    expect(() => validateFretTemplateSettings(input, {
      ...DEFAULT_FRET_TEMPLATE,
      nutWidthMm: 0,
    })).toThrow('Nut width')
    expect(() => validateFretTemplateSettings(input, {
      ...DEFAULT_FRET_TEMPLATE,
      extent: 'board-end',
      endMarginMm: 500,
    })).toThrow('Board end margin')
  })

  it('round-trips URL state and rejects unsafe ranges', () => {
    const state = {
      preset: 'electric-25-5',
      scaleLength: 25.5,
      unit: 'in' as const,
      fretCount: 24,
      ...DEFAULT_FRET_TEMPLATE,
    }
    expect(parseFretSearch(serializeFretState(state))).toEqual(state)
    expect(parseFretSearch('?scale=99&unit=in&frets=100')).toEqual({
      preset: 'electric-25-5',
      scaleLength: 25.5,
      unit: 'in',
      fretCount: 24,
      ...DEFAULT_FRET_TEMPLATE,
    })
  })

  it('restores the complete workshop template from a share URL', () => {
    const state = {
      preset: 'custom',
      scaleLength: 650,
      unit: 'mm' as const,
      fretCount: 22,
      extent: 'board-end' as const,
      nutWidthMm: 42.5,
      endWidthMm: 57.25,
      endMarginMm: 12.5,
    }

    expect(parseFretSearch(serializeFretState(state))).toEqual(state)
  })

  it('keeps shared metric URLs human-readable instead of exposing floating-point noise', () => {
    const search = serializeFretState({
      preset: 'electric-25-5',
      scaleLength: 647.6999999999999,
      unit: 'mm',
      fretCount: 24,
      ...DEFAULT_FRET_TEMPLATE,
    })

    expect(search).toContain('scale=647.7')
    expect(search).not.toContain('999999')
  })
})
