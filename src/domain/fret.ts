
export type LengthUnit = 'in' | 'mm'
export type PrintPaper = 'letter' | 'a4'
export type FretTemplateExtent = 'last-fret' | 'board-end' | 'bridge'

export interface FretCalculationInput {
  scaleLength: number
  unit: LengthUnit
  fretCount: number
}

export interface FretPosition {
  fret: number
  distanceFromNutMm: number
  spacingFromPreviousMm: number
  remainingScaleMm: number
}

export interface InstrumentScalePreset {
  id: string
  name: string
  scaleLength: number
  unit: LengthUnit
  family: 'guitar' | 'bass' | 'ukulele' | 'mandolin' | 'banjo'
}

export interface FretExportOptions {
  paper: PrintPaper
  title: string
  template?: FretTemplateSettings
}

export interface FretTemplateSettings {
  extent: FretTemplateExtent
  nutWidthMm: number
  endWidthMm: number
  endMarginMm: number
}

export interface FretTemplate {
  extent: FretTemplateExtent
  lengthMm: number
  boardEndMm: number
  nutWidthMm: number
  endWidthMm: number
  bridgePositionMm?: number
}

export interface FretPdfLayout {
  paper: PrintPaper
  landscape: boolean
  pageWidthMm: number
  pageHeightMm: number
  contentWidthMm: number
  overlapMm: number
  pages: Array<{
    index: number
    startMm: number
    endMm: number
    previousOverlapMm: number
    nextOverlapMm: number
  }>
}

export interface FretCalculatorState extends FretCalculationInput, FretTemplateSettings {
  preset: string
}

export const INSTRUMENT_PRESETS: InstrumentScalePreset[] = [
  { id: 'electric-25-5', name: 'Electric guitar · 25.5 in', scaleLength: 25.5, unit: 'in', family: 'guitar' },
  { id: 'electric-24-75', name: 'Electric guitar · 24.75 in', scaleLength: 24.75, unit: 'in', family: 'guitar' },
  { id: 'classical-650', name: 'Classical guitar · 650 mm', scaleLength: 650, unit: 'mm', family: 'guitar' },
  { id: 'bass-34', name: 'Electric bass · 34 in', scaleLength: 34, unit: 'in', family: 'bass' },
  { id: 'ukulele-soprano', name: 'Soprano ukulele · 13 in', scaleLength: 13, unit: 'in', family: 'ukulele' },
  { id: 'ukulele-concert', name: 'Concert ukulele · 15 in', scaleLength: 15, unit: 'in', family: 'ukulele' },
  { id: 'ukulele-tenor', name: 'Tenor ukulele · 17 in', scaleLength: 17, unit: 'in', family: 'ukulele' },
  { id: 'ukulele-baritone', name: 'Baritone ukulele · 19 in', scaleLength: 19, unit: 'in', family: 'ukulele' },
  { id: 'mandolin-13-875', name: 'Mandolin · 13.875 in', scaleLength: 13.875, unit: 'in', family: 'mandolin' },
  { id: 'banjo-26-25', name: 'Banjo · 26.25 in', scaleLength: 26.25, unit: 'in', family: 'banjo' },
]

export const DEFAULT_FRET_STATE: FretCalculatorState = {
  preset: 'electric-25-5',
  scaleLength: 25.5,
  unit: 'in',
  fretCount: 24,
  extent: 'last-fret',
  nutWidthMm: 43,
  endWidthMm: 56,
  endMarginMm: 10,
}

export const DEFAULT_FRET_TEMPLATE: FretTemplateSettings = {
  extent: 'last-fret',
  nutWidthMm: 43,
  endWidthMm: 56,
  endMarginMm: 10,
}

const MM_PER_INCH = 25.4

export function toMillimeters(value: number, unit: LengthUnit): number {
  return unit === 'in' ? value * MM_PER_INCH : value
}

export function fromMillimeters(value: number, unit: LengthUnit): number {
  return unit === 'in' ? value / MM_PER_INCH : value
}

export function validateFretInput(input: FretCalculationInput): void {
  const scaleMm = toMillimeters(input.scaleLength, input.unit)
  if (!Number.isFinite(scaleMm) || scaleMm < 254 || scaleMm > 1016) {
    throw new RangeError('Scale length must be between 254 and 1016 mm.')
  }
  if (!Number.isInteger(input.fretCount) || input.fretCount < 1 || input.fretCount > 36) {
    throw new RangeError('Fret count must be an integer between 1 and 36.')
  }
}

export function calculateFretPositions(input: FretCalculationInput): FretPosition[] {
  validateFretInput(input)
  const scaleLengthMm = toMillimeters(input.scaleLength, input.unit)
  let previousDistance = 0

  return Array.from({ length: input.fretCount }, (_, index) => {
    const fret = index + 1
    const distanceFromNutMm = scaleLengthMm * (1 - 2 ** (-fret / 12))
    const position = {
      fret,
      distanceFromNutMm,
      spacingFromPreviousMm: distanceFromNutMm - previousDistance,
      remainingScaleMm: scaleLengthMm - distanceFromNutMm,
    }
    previousDistance = distanceFromNutMm
    return position
  })
}

export function validateFretTemplateSettings(
  input: FretCalculationInput,
  settings: FretTemplateSettings,
): void {
  validateFretInput(input)
  if (!Number.isFinite(settings.nutWidthMm) || settings.nutWidthMm < 20 || settings.nutWidthMm > 100) {
    throw new RangeError('Nut width must be between 20 and 100 mm.')
  }
  if (!Number.isFinite(settings.endWidthMm) || settings.endWidthMm < 20 || settings.endWidthMm > 100) {
    throw new RangeError('End width must be between 20 and 100 mm.')
  }
  if (settings.endWidthMm < settings.nutWidthMm) {
    throw new RangeError('End width must be at least as wide as the nut.')
  }
  if (!Number.isFinite(settings.endMarginMm) || settings.endMarginMm < 0 || settings.endMarginMm > 100) {
    throw new RangeError('Board end margin must be between 0 and 100 mm.')
  }
  if (settings.extent === 'board-end' || settings.extent === 'bridge') {
    const scaleLengthMm = toMillimeters(input.scaleLength, input.unit)
    const lastFretMm = calculateFretPositions(input).at(-1)?.distanceFromNutMm ?? 0
    if (lastFretMm + settings.endMarginMm > scaleLengthMm) {
      throw new RangeError('Board end margin must finish before the theoretical bridge position.')
    }
  }
}

export function createFretTemplate(
  input: FretCalculationInput,
  settings: FretTemplateSettings = DEFAULT_FRET_TEMPLATE,
): FretTemplate {
  validateFretTemplateSettings(input, settings)
  const positions = calculateFretPositions(input)
  const scaleLengthMm = toMillimeters(input.scaleLength, input.unit)
  const lastFretMm = positions.at(-1)?.distanceFromNutMm ?? 0
  const requestedBoardEnd = settings.extent === 'last-fret'
    ? lastFretMm
    : lastFretMm + settings.endMarginMm
  const boardEndMm = Math.min(requestedBoardEnd, scaleLengthMm)
  const requestedLength = settings.extent === 'bridge' ? scaleLengthMm : boardEndMm
  const lengthMm = Math.min(requestedLength, scaleLengthMm)

  return {
    extent: settings.extent,
    lengthMm,
    boardEndMm,
    nutWidthMm: settings.nutWidthMm,
    endWidthMm: settings.endWidthMm,
    bridgePositionMm: settings.extent === 'bridge' ? scaleLengthMm : undefined,
  }
}

export function templateWidthAt(template: FretTemplate, distanceMm: number): number {
  if (template.boardEndMm <= 0) return template.nutWidthMm
  const progress = Math.min(1, Math.max(0, distanceMm / template.boardEndMm))
  return template.nutWidthMm + (template.endWidthMm - template.nutWidthMm) * progress
}

export function formatFretValue(valueMm: number, unit: LengthUnit): string {
  const value = fromMillimeters(valueMm, unit)
  return unit === 'mm' ? value.toFixed(2) : value.toFixed(3)
}

export function parseFretSearch(search: string): FretCalculatorState {
  const params = new URLSearchParams(search)
  const presetId = params.get('preset') ?? DEFAULT_FRET_STATE.preset
  const preset = INSTRUMENT_PRESETS.find((candidate) => candidate.id === presetId)
  const unit = params.get('unit') === 'mm' ? 'mm' : params.get('unit') === 'in' ? 'in' : preset?.unit ?? 'in'
  const scale = Number(params.get('scale'))
  const frets = Number(params.get('frets'))
  const extentParam = params.get('extent')
  const extent: FretTemplateExtent = extentParam === 'board-end' || extentParam === 'bridge'
    ? extentParam
    : DEFAULT_FRET_TEMPLATE.extent
  const nutParam = params.get('nut')
  const endParam = params.get('end')
  const marginParam = params.get('margin')
  const nutWidthMm = nutParam === null ? Number.NaN : Number(nutParam)
  const endWidthMm = endParam === null ? Number.NaN : Number(endParam)
  const endMarginMm = marginParam === null ? Number.NaN : Number(marginParam)
  const fallbackScale = preset
    ? fromMillimeters(toMillimeters(preset.scaleLength, preset.unit), unit)
    : DEFAULT_FRET_STATE.scaleLength
  const candidate = {
    preset: preset?.id ?? 'custom',
    scaleLength: Number.isFinite(scale) ? scale : fallbackScale,
    unit,
    fretCount: Number.isInteger(frets) ? frets : DEFAULT_FRET_STATE.fretCount,
    extent,
    nutWidthMm: Number.isFinite(nutWidthMm) && nutWidthMm > 0 ? nutWidthMm : DEFAULT_FRET_TEMPLATE.nutWidthMm,
    endWidthMm: Number.isFinite(endWidthMm) && endWidthMm > 0 ? endWidthMm : DEFAULT_FRET_TEMPLATE.endWidthMm,
    endMarginMm: Number.isFinite(endMarginMm) && endMarginMm >= 0 ? endMarginMm : DEFAULT_FRET_TEMPLATE.endMarginMm,
  }

  try {
    validateFretInput(candidate)
    validateFretTemplateSettings(candidate, candidate)
    return candidate
  } catch {
    return { ...DEFAULT_FRET_STATE }
  }
}

export function serializeFretState(state: FretCalculatorState): string {
  const params = new URLSearchParams()
  params.set('preset', state.preset)
  params.set('scale', String(Number(state.scaleLength.toFixed(state.unit === 'mm' ? 2 : 3))))
  params.set('unit', state.unit)
  params.set('frets', String(state.fretCount))
  params.set('extent', state.extent)
  params.set('nut', String(Number(state.nutWidthMm.toFixed(2))))
  params.set('end', String(Number(state.endWidthMm.toFixed(2))))
  params.set('margin', String(Number(state.endMarginMm.toFixed(2))))
  return params.toString()
}

export function createFretCsv(input: FretCalculationInput): string {
  const unit = input.unit
  const rows = calculateFretPositions(input)
  const header = `Fret,Distance from nut (${unit}),Spacing from previous (${unit}),Remaining scale (${unit})`
  return [
    header,
    ...rows.map((row) =>
      [
        row.fret,
        formatFretValue(row.distanceFromNutMm, unit),
        formatFretValue(row.spacingFromPreviousMm, unit),
        formatFretValue(row.remainingScaleMm, unit),
      ].join(','),
    ),
  ].join('\n')
}

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character)
}

export function createFretSvg(
  input: FretCalculationInput,
  title = 'Fret layout',
  settings: FretTemplateSettings = DEFAULT_FRET_TEMPLATE,
): string {
  const positions = calculateFretPositions(input)
  const scaleMm = toMillimeters(input.scaleLength, input.unit)
  const template = createFretTemplate(input, settings)
  const left = 18
  const top = 16
  const maxBoardWidth = Math.max(template.nutWidthMm, template.endWidthMm)
  const centerY = top + maxBoardWidth / 2
  const calibrationY = top + maxBoardWidth + 14
  const width = template.lengthMm + 36
  const height = calibrationY + 10
  const fretLines = positions
    .filter((position) => position.distanceFromNutMm <= template.boardEndMm + 0.001)
    .map((position) => {
    const x = left + position.distanceFromNutMm
    const fretWidth = templateWidthAt(template, position.distanceFromNutMm)
    return `<g><line x1="${x.toFixed(3)}" y1="${(centerY - fretWidth / 2).toFixed(3)}" x2="${x.toFixed(3)}" y2="${(centerY + fretWidth / 2).toFixed(3)}" stroke="#071c34" stroke-width="0.35"/><text x="${x.toFixed(3)}" y="${(centerY - fretWidth / 2 - 3).toFixed(3)}" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="2.8">${position.fret}</text></g>`
  }).join('')
  const nutTop = centerY - template.nutWidthMm / 2
  const nutBottom = centerY + template.nutWidthMm / 2
  const endTop = centerY - template.endWidthMm / 2
  const endBottom = centerY + template.endWidthMm / 2
  const boardEndX = left + template.boardEndMm
  const outputEndX = left + template.lengthMm
  const bridgeExtension = template.bridgePositionMm === undefined
    ? ''
    : `<line class="bridge-extension" x1="${boardEndX.toFixed(3)}" y1="${centerY.toFixed(3)}" x2="${outputEndX.toFixed(3)}" y2="${centerY.toFixed(3)}" stroke="#536170" stroke-width="0.3" stroke-dasharray="3 2"/>`
  const bridgeReference = template.bridgePositionMm === undefined
    ? ''
    : `<g><line x1="${(left + template.bridgePositionMm).toFixed(3)}" y1="${(endTop - 3).toFixed(3)}" x2="${(left + template.bridgePositionMm).toFixed(3)}" y2="${(endBottom + 3).toFixed(3)}" stroke="#087f83" stroke-width="1.2"/><text x="${(left + template.bridgePositionMm - 2).toFixed(3)}" y="${(endTop - 5).toFixed(3)}" text-anchor="end" font-family="IBM Plex Mono, monospace" font-size="2.8" fill="#087f83">Bridge reference</text></g>`

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width.toFixed(3)}mm" height="${height}mm" viewBox="0 0 ${width.toFixed(3)} ${height}">
  <rect width="100%" height="100%" fill="#fffdf8"/>
  <text x="${left}" y="7" font-family="Instrument Sans, sans-serif" font-size="4.2" font-weight="700" fill="#071c34">${escapeXml(title)}</text>
  <text x="${left}" y="11.5" font-family="IBM Plex Mono, monospace" font-size="2.7" fill="#536170">Scale ${scaleMm.toFixed(2)} mm - ${input.fretCount} frets - ${escapeXml(template.extent)}</text>
  <polygon points="${left},${nutTop.toFixed(3)} ${boardEndX.toFixed(3)},${endTop.toFixed(3)} ${boardEndX.toFixed(3)},${endBottom.toFixed(3)} ${left},${nutBottom.toFixed(3)}" fill="#f6f2ea" stroke="#071c34" stroke-width="0.45"/>
  <line x1="${left}" y1="${(nutTop - 2).toFixed(3)}" x2="${left}" y2="${(nutBottom + 2).toFixed(3)}" stroke="#e85d0f" stroke-width="1.2"/>
  <line x1="${left}" y1="${centerY.toFixed(3)}" x2="${boardEndX.toFixed(3)}" y2="${centerY.toFixed(3)}" stroke="#536170" stroke-width="0.25" stroke-dasharray="3 2"/>
  ${bridgeExtension}
  ${fretLines}
  ${bridgeReference}
  <g transform="translate(${left} ${calibrationY})">
    <text x="0" y="-3" font-family="Instrument Sans, sans-serif" font-size="2.8" fill="#071c34">Calibration rulers - verify after printing at 100%</text>
    <line x1="0" y1="0" x2="100" y2="0" stroke="#071c34" stroke-width="0.6"/>
    <line x1="0" y1="-2" x2="0" y2="2" stroke="#071c34" stroke-width="0.6"/><line x1="100" y1="-2" x2="100" y2="2" stroke="#071c34" stroke-width="0.6"/>
    <text x="50" y="5" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="2.8">100 mm</text>
    <line x1="118" y1="0" x2="219.6" y2="0" stroke="#071c34" stroke-width="0.6"/>
    <line x1="118" y1="-2" x2="118" y2="2" stroke="#071c34" stroke-width="0.6"/><line x1="219.6" y1="-2" x2="219.6" y2="2" stroke="#071c34" stroke-width="0.6"/>
    <text x="168.8" y="5" text-anchor="middle" font-family="IBM Plex Mono, monospace" font-size="2.8">4 in</text>
  </g>
</svg>`
}

export function createFretPdfLayout(
  scaleLengthMm: number,
  paper: PrintPaper,
): FretPdfLayout {
  const portrait = paper === 'a4'
    ? { width: 210, height: 297 }
    : { width: 215.9, height: 279.4 }
  const landscape = true
  const pageWidthMm = portrait.height
  const pageHeightMm = portrait.width
  const marginMm = 12
  const overlapMm = 10
  const contentWidthMm = pageWidthMm - marginMm * 2
  const step = contentWidthMm - overlapMm
  const pages: FretPdfLayout['pages'] = []
  for (let startMm = 0, index = 0; startMm < scaleLengthMm; startMm += step, index += 1) {
    if (index > 0) pages[index - 1].nextOverlapMm = overlapMm
    pages.push({
      index,
      startMm,
      endMm: Math.min(startMm + contentWidthMm, scaleLengthMm),
      previousOverlapMm: index === 0 ? 0 : overlapMm,
      nextOverlapMm: 0,
    })
    if (pages[index].endMm >= scaleLengthMm) break
  }
  return { paper, landscape, pageWidthMm, pageHeightMm, contentWidthMm, overlapMm, pages }
}
