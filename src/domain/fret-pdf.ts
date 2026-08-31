import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import {
  calculateFretPositions,
  createFretPdfLayout,
  createFretTemplate,
  templateWidthAt,
  type FretCalculationInput,
  type FretExportOptions,
} from './fret'

const POINTS_PER_MM = 72 / 25.4

export async function createFretPdf(
  input: FretCalculationInput,
  options: FretExportOptions,
): Promise<Uint8Array> {
  const positions = calculateFretPositions(input)
  const template = createFretTemplate(input, options.template)
  const layout = createFretPdfLayout(template.lengthMm, options.paper)
  const pdf = await PDFDocument.create()
  const regular = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  const marginMm = 12
  const boardCenterMm = layout.pageHeightMm - 78
  const outlineColor = rgb(0.03, 0.11, 0.2)
  const guideColor = rgb(0.35, 0.39, 0.43)
  const accentColor = rgb(0.67, 0.23, 0.03)
  const bridgeColor = rgb(0.03, 0.42, 0.44)

  for (const slice of layout.pages) {
    const page = pdf.addPage([
      layout.pageWidthMm * POINTS_PER_MM,
      layout.pageHeightMm * POINTS_PER_MM,
    ])
    const top = layout.pageHeightMm - 14
    page.drawText(options.title, { x: marginMm * POINTS_PER_MM, y: top * POINTS_PER_MM, size: 14, font: bold, color: outlineColor })
    page.drawText(`Actual size - 100% - disable Fit to page - page ${slice.index + 1}/${layout.pages.length}`, { x: marginMm * POINTS_PER_MM, y: (top - 7) * POINTS_PER_MM, size: 8.5, font: regular, color: guideColor })
    page.drawText(`Range ${slice.startMm.toFixed(1)}-${slice.endMm.toFixed(1)} mm - assemble pages left to right`, { x: marginMm * POINTS_PER_MM, y: (top - 13) * POINTS_PER_MM, size: 7.5, font: regular, color: guideColor })

    const localStartX = marginMm
    const localEndX = marginMm + slice.endMm - slice.startMm
    page.drawLine({ start: { x: localStartX * POINTS_PER_MM, y: boardCenterMm * POINTS_PER_MM }, end: { x: localEndX * POINTS_PER_MM, y: boardCenterMm * POINTS_PER_MM }, thickness: 0.25, color: guideColor })

    const boardSliceStartMm = Math.max(slice.startMm, 0)
    const boardSliceEndMm = Math.min(slice.endMm, template.boardEndMm)
    const hasBoard = boardSliceEndMm > boardSliceStartMm + 0.001
    if (hasBoard) {
      const boardStartX = marginMm + boardSliceStartMm - slice.startMm
      const boardEndX = marginMm + boardSliceEndMm - slice.startMm
      const boardStartWidth = templateWidthAt(template, boardSliceStartMm)
      const boardEndWidth = templateWidthAt(template, boardSliceEndMm)
      page.drawLine({ start: { x: boardStartX * POINTS_PER_MM, y: (boardCenterMm + boardStartWidth / 2) * POINTS_PER_MM }, end: { x: boardEndX * POINTS_PER_MM, y: (boardCenterMm + boardEndWidth / 2) * POINTS_PER_MM }, thickness: 0.7, color: outlineColor })
      page.drawLine({ start: { x: boardStartX * POINTS_PER_MM, y: (boardCenterMm - boardStartWidth / 2) * POINTS_PER_MM }, end: { x: boardEndX * POINTS_PER_MM, y: (boardCenterMm - boardEndWidth / 2) * POINTS_PER_MM }, thickness: 0.7, color: outlineColor })
    }

    if (slice.index === 0) {
      const nutHalfWidth = template.nutWidthMm / 2
      page.drawLine({ start: { x: localStartX * POINTS_PER_MM, y: (boardCenterMm - nutHalfWidth - 2) * POINTS_PER_MM }, end: { x: localStartX * POINTS_PER_MM, y: (boardCenterMm + nutHalfWidth + 2) * POINTS_PER_MM }, thickness: 1.2, color: accentColor })
      page.drawText('NUT FACE', { x: localStartX * POINTS_PER_MM, y: (boardCenterMm + nutHalfWidth + 5) * POINTS_PER_MM, size: 6.5, font: bold, color: accentColor })
    }

    for (const position of positions) {
      if (position.distanceFromNutMm > template.boardEndMm + 0.001 || position.distanceFromNutMm < slice.startMm - 0.001 || position.distanceFromNutMm > slice.endMm + 0.001) continue
      const localX = marginMm + position.distanceFromNutMm - slice.startMm
      const fretWidth = templateWidthAt(template, position.distanceFromNutMm)
      page.drawLine({ start: { x: localX * POINTS_PER_MM, y: (boardCenterMm - fretWidth / 2) * POINTS_PER_MM }, end: { x: localX * POINTS_PER_MM, y: (boardCenterMm + fretWidth / 2) * POINTS_PER_MM }, thickness: 0.55, color: outlineColor })
      page.drawText(String(position.fret), { x: (localX - 1.2) * POINTS_PER_MM, y: (boardCenterMm + fretWidth / 2 + 2) * POINTS_PER_MM, size: 6, font: regular, color: outlineColor })
    }

    if (template.bridgePositionMm !== undefined && template.boardEndMm >= slice.startMm - 0.001 && template.boardEndMm <= slice.endMm + 0.001) {
      const boardEndX = marginMm + template.boardEndMm - slice.startMm
      const boardHalfWidth = template.endWidthMm / 2
      page.drawLine({ start: { x: boardEndX * POINTS_PER_MM, y: (boardCenterMm - boardHalfWidth) * POINTS_PER_MM }, end: { x: boardEndX * POINTS_PER_MM, y: (boardCenterMm + boardHalfWidth) * POINTS_PER_MM }, thickness: 0.8, color: outlineColor })
      page.drawText('BOARD END', { x: Math.max(marginMm, boardEndX - 16) * POINTS_PER_MM, y: (boardCenterMm + boardHalfWidth + 5) * POINTS_PER_MM, size: 6.5, font: bold, color: outlineColor })
    }

    const isFinalSlice = slice.index === layout.pages.length - 1
    if (isFinalSlice) {
      const referenceHalfWidth = template.endWidthMm / 2
      const finalColor = template.bridgePositionMm === undefined ? outlineColor : bridgeColor
      const finalLabel = template.bridgePositionMm === undefined ? 'TEMPLATE END' : 'THEORETICAL BRIDGE REFERENCE'
      page.drawLine({ start: { x: localEndX * POINTS_PER_MM, y: (boardCenterMm - referenceHalfWidth - 2) * POINTS_PER_MM }, end: { x: localEndX * POINTS_PER_MM, y: (boardCenterMm + referenceHalfWidth + 2) * POINTS_PER_MM }, thickness: 1.1, color: finalColor })
      page.drawText(finalLabel, { x: Math.max(marginMm, localEndX - 48) * POINTS_PER_MM, y: (boardCenterMm + referenceHalfWidth + 5) * POINTS_PER_MM, size: 6.5, font: bold, color: finalColor })
    }

    const registrationXs: Array<{ x: number; label: string }> = []
    if (slice.previousOverlapMm > 0) registrationXs.push({ x: localStartX + slice.previousOverlapMm, label: 'MATCH PREVIOUS PAGE' })
    if (slice.nextOverlapMm > 0) registrationXs.push({ x: localEndX - slice.nextOverlapMm, label: 'MATCH NEXT PAGE' })
    for (const registration of registrationXs) {
      const x = registration.x
      page.drawLine({ start: { x: x * POINTS_PER_MM, y: (boardCenterMm - 38) * POINTS_PER_MM }, end: { x: x * POINTS_PER_MM, y: (boardCenterMm + 38) * POINTS_PER_MM }, thickness: 0.45, color: accentColor })
      for (const y of [boardCenterMm - 34, boardCenterMm + 34]) {
        page.drawLine({ start: { x: (x - 3) * POINTS_PER_MM, y: y * POINTS_PER_MM }, end: { x: (x + 3) * POINTS_PER_MM, y: y * POINTS_PER_MM }, thickness: 0.65, color: accentColor })
        page.drawLine({ start: { x: x * POINTS_PER_MM, y: (y - 3) * POINTS_PER_MM }, end: { x: x * POINTS_PER_MM, y: (y + 3) * POINTS_PER_MM }, thickness: 0.65, color: accentColor })
      }
      page.drawText(`${registration.label} - 10 mm overlap`, { x: Math.max(marginMm, x - 23) * POINTS_PER_MM, y: (boardCenterMm - 43) * POINTS_PER_MM, size: 6.5, font: bold, color: accentColor })
    }

    const calibrationY = 34
    page.drawLine({ start: { x: marginMm * POINTS_PER_MM, y: calibrationY * POINTS_PER_MM }, end: { x: (marginMm + 100) * POINTS_PER_MM, y: calibrationY * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawLine({ start: { x: marginMm * POINTS_PER_MM, y: (calibrationY - 2) * POINTS_PER_MM }, end: { x: marginMm * POINTS_PER_MM, y: (calibrationY + 2) * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawLine({ start: { x: (marginMm + 100) * POINTS_PER_MM, y: (calibrationY - 2) * POINTS_PER_MM }, end: { x: (marginMm + 100) * POINTS_PER_MM, y: (calibrationY + 2) * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawText('100 mm calibration', { x: marginMm * POINTS_PER_MM, y: (calibrationY - 7) * POINTS_PER_MM, size: 7, font: regular, color: outlineColor })

    const inchStart = marginMm + 120
    page.drawLine({ start: { x: inchStart * POINTS_PER_MM, y: calibrationY * POINTS_PER_MM }, end: { x: (inchStart + 101.6) * POINTS_PER_MM, y: calibrationY * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawLine({ start: { x: inchStart * POINTS_PER_MM, y: (calibrationY - 2) * POINTS_PER_MM }, end: { x: inchStart * POINTS_PER_MM, y: (calibrationY + 2) * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawLine({ start: { x: (inchStart + 101.6) * POINTS_PER_MM, y: (calibrationY - 2) * POINTS_PER_MM }, end: { x: (inchStart + 101.6) * POINTS_PER_MM, y: (calibrationY + 2) * POINTS_PER_MM }, thickness: 0.75, color: outlineColor })
    page.drawText('4 in calibration', { x: inchStart * POINTS_PER_MM, y: (calibrationY - 7) * POINTS_PER_MM, size: 7, font: regular, color: outlineColor })
  }

  pdf.setTitle(options.title)
  pdf.setSubject('1:1 fret position layout with calibration ruler')
  return pdf.save()
}
