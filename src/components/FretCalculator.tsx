import {
  ArrowCounterClockwise,
  CaretDown,
  CheckCircle,
  DownloadSimple,
  FileCsv,
  FilePdf,
  FileSvg,
  LinkSimple,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Printer,
  Ruler,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  calculateFretPositions,
  createFretCsv,
  createFretPdfLayout,
  createFretSvg,
  createFretTemplate,
  DEFAULT_FRET_TEMPLATE,
  DEFAULT_FRET_STATE,
  formatFretValue,
  fromMillimeters,
  INSTRUMENT_PRESETS,
  parseFretSearch,
  serializeFretState,
  templateWidthAt,
  toMillimeters,
  validateFretInput,
  validateFretTemplateSettings,
  type FretCalculatorState,
  type FretTemplateExtent,
  type LengthUnit,
  type PrintPaper,
} from '../domain/fret'
import { downloadBlob, writeTextToClipboard } from '../lib/browser-actions'
import { createProductEventTracker, type ProductEventDetail } from '../lib/product-events'

function formatInputMillimeters(valueMm: number, unit: LengthUnit): string {
  return String(Number(fromMillimeters(valueMm, unit).toFixed(unit === 'mm' ? 2 : 3)))
}

export default function FretCalculator() {
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<FretCalculatorState>(DEFAULT_FRET_STATE)
  const [scaleInput, setScaleInput] = useState('25.5')
  const [fretInput, setFretInput] = useState('24')
  const [nutWidthInput, setNutWidthInput] = useState(formatInputMillimeters(DEFAULT_FRET_STATE.nutWidthMm, 'in'))
  const [endWidthInput, setEndWidthInput] = useState(formatInputMillimeters(DEFAULT_FRET_STATE.endWidthMm, 'in'))
  const [endMarginInput, setEndMarginInput] = useState(formatInputMillimeters(DEFAULT_FRET_STATE.endMarginMm, 'in'))
  const [selectedFret, setSelectedFret] = useState(12)
  const [paper, setPaper] = useState<PrintPaper>('letter')
  const [zoom, setZoom] = useState(1)
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [status, setStatus] = useState('')
  const fretboardScrollRef = useRef<HTMLDivElement>(null)
  const tracker = useRef(createProductEventTracker('fret-calculator'))

  useEffect(() => {
    const shared = parseFretSearch(window.location.search)
    setState(shared)
    setScaleInput(String(shared.scaleLength))
    setFretInput(String(shared.fretCount))
    setNutWidthInput(formatInputMillimeters(shared.nutWidthMm, shared.unit))
    setEndWidthInput(formatInputMillimeters(shared.endWidthMm, shared.unit))
    setEndMarginInput(formatInputMillimeters(shared.endMarginMm, shared.unit))
    setSelectedFret(Math.min(12, shared.fretCount))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!status || isExportingPdf) return
    const timer = window.setTimeout(() => setStatus(''), 4_000)
    return () => window.clearTimeout(timer)
  }, [isExportingPdf, status])

  const draftState = useMemo<FretCalculatorState>(() => ({
    ...state,
    scaleLength: Number(scaleInput),
    fretCount: Number(fretInput),
    nutWidthMm: toMillimeters(Number(nutWidthInput), state.unit),
    endWidthMm: toMillimeters(Number(endWidthInput), state.unit),
    endMarginMm: toMillimeters(Number(endMarginInput), state.unit),
  }), [endMarginInput, endWidthInput, fretInput, nutWidthInput, scaleInput, state])

  const validationError = useMemo(() => {
    try {
      validateFretInput(draftState)
      validateFretTemplateSettings(draftState, draftState)
      return ''
    } catch (error) {
      return error instanceof Error ? error.message : 'Check the scale, fret count, and template geometry.'
    }
  }, [draftState])
  const invalidField = validationError.startsWith('Scale length')
    ? 'scale'
    : validationError.startsWith('Fret count')
      ? 'frets'
      : validationError.startsWith('Nut width')
        ? 'nut'
        : validationError.startsWith('End width')
          ? 'end'
          : validationError.startsWith('Board end margin')
            ? 'margin'
            : null

  const positions = useMemo(
    () => calculateFretPositions(state),
    [state],
  )
  const template = useMemo(() => createFretTemplate(state, state), [state])
  const selected =
    positions.find((position) => position.fret === selectedFret) ?? positions[0]
  const scaleMm = toMillimeters(state.scaleLength, state.unit)
  const pdfLayout = createFretPdfLayout(template.lengthMm, paper)
  const maxPreviewWidth = Math.max(template.nutWidthMm, template.endWidthMm)
  const previewScaleY = 82 / maxPreviewWidth
  const previewCenterY = 104
  const previewNutHalf = template.nutWidthMm * previewScaleY / 2
  const previewEndHalf = template.endWidthMm * previewScaleY / 2
  const previewBoardEndX = 20 + (template.boardEndMm / template.lengthMm) * 960
  const extentLabel = state.extent === 'last-fret'
    ? 'Last fret'
    : state.extent === 'board-end'
      ? 'Board end'
      : 'Bridge reference'

  function tryCommit(next: FretCalculatorState, action: ProductEventDetail) {
    try {
      validateFretInput(next)
      validateFretTemplateSettings(next, next)
      setState(next)
      tracker.current.track('calculation_completed', action)
    } catch {
      // Keep the last valid drawing visible while the user edits.
    }
  }

  function updateScale(value: string) {
    setScaleInput(value)
    const numeric = Number(value)
    if (!Number.isFinite(numeric)) return
    tryCommit({ ...state, scaleLength: numeric, preset: 'custom' }, 'custom_scale')
  }

  function updateFrets(value: string) {
    setFretInput(value)
    const fretCount = Number(value)
    const next = { ...state, fretCount }
    try {
      validateFretInput(next)
      validateFretTemplateSettings(next, next)
      setState(next)
      setSelectedFret((current) => Math.min(current, fretCount))
      tracker.current.track('calculation_completed', 'fret_count_changed')
    } catch {
      // Keep the last valid drawing visible while the user edits.
    }
  }

  function updateGeometry(
    field: 'nutWidthMm' | 'endWidthMm' | 'endMarginMm',
    value: string,
  ) {
    if (field === 'nutWidthMm') setNutWidthInput(value)
    if (field === 'endWidthMm') setEndWidthInput(value)
    if (field === 'endMarginMm') setEndMarginInput(value)
    const numeric = Number(value)
    if (!Number.isFinite(numeric)) return
    tryCommit({ ...state, [field]: toMillimeters(numeric, state.unit) }, 'template_geometry_changed')
  }

  function changeExtent(extent: FretTemplateExtent) {
    tryCommit({ ...state, extent }, 'template_extent_changed')
  }

  function resetTemplate() {
    const next = { ...state, ...DEFAULT_FRET_TEMPLATE }
    setNutWidthInput(formatInputMillimeters(DEFAULT_FRET_TEMPLATE.nutWidthMm, state.unit))
    setEndWidthInput(formatInputMillimeters(DEFAULT_FRET_TEMPLATE.endWidthMm, state.unit))
    setEndMarginInput(formatInputMillimeters(DEFAULT_FRET_TEMPLATE.endMarginMm, state.unit))
    tryCommit(next, 'template_geometry_changed')
    setStatus('Template options reset.')
  }

  function selectPreset(id: string) {
    const preset = INSTRUMENT_PRESETS.find((candidate) => candidate.id === id)
    if (!preset) {
      setState((current) => ({ ...current, preset: 'custom' }))
      return
    }
    const scaleLength = fromMillimeters(
      toMillimeters(preset.scaleLength, preset.unit),
      state.unit,
    )
    const next = { ...state, preset: preset.id, scaleLength }
    try {
      validateFretTemplateSettings(next, next)
      setState(next)
      setScaleInput(String(Number(scaleLength.toFixed(state.unit === 'mm' ? 2 : 3))))
      tracker.current.track('tool_started', 'preset_changed')
    } catch {
      setStatus('This preset conflicts with the current board-end margin. Reduce the margin first.')
    }
  }

  function changeUnit(unit: LengthUnit) {
    if (unit === state.unit) return
    const converted = fromMillimeters(toMillimeters(state.scaleLength, state.unit), unit)
    setState((current) => ({ ...current, unit, scaleLength: converted }))
    setScaleInput(String(Number(converted.toFixed(unit === 'mm' ? 2 : 3))))
    setNutWidthInput(formatInputMillimeters(state.nutWidthMm, unit))
    setEndWidthInput(formatInputMillimeters(state.endWidthMm, unit))
    setEndMarginInput(formatInputMillimeters(state.endMarginMm, unit))
    tracker.current.track('tool_started', 'unit_changed')
  }

  function fitPreview() {
    setZoom(1)
    if (fretboardScrollRef.current) fretboardScrollRef.current.scrollLeft = 0
  }

  async function shareLayout() {
    if (validationError) return
    const url = new URL(window.location.href)
    url.search = serializeFretState(state)
    try {
      await writeTextToClipboard(url.toString())
      window.history.replaceState({}, '', `${url.pathname}?${url.searchParams.toString()}`)
      setStatus('Share link copied with scale and template geometry.')
      tracker.current.track('share_clicked', 'link_copy')
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

  function exportCsv() {
    if (validationError) return
    downloadBlob(createFretCsv(state), 'fret-layout.csv', 'text/csv;charset=utf-8')
    setStatus('CSV downloaded.')
    tracker.current.track('export_created', 'csv_export')
  }

  function exportSvg() {
    if (validationError) return
    downloadBlob(
      createFretSvg(state, 'Musician Tools fret layout', state),
      'fret-layout-actual-size.svg',
      'image/svg+xml;charset=utf-8',
    )
    setStatus('1:1 SVG downloaded.')
    tracker.current.track('export_created', 'svg_export')
  }

  async function exportPdf() {
    if (validationError || isExportingPdf) return
    setIsExportingPdf(true)
    setStatus('Preparing your print PDF...')
    try {
      const { createFretPdf } = await import('../domain/fret-pdf')
      const bytes = await createFretPdf(state, {
        paper,
        title: 'Musician Tools fret layout',
        template: state,
      })
      const pdfBuffer = bytes.buffer.slice(
        bytes.byteOffset,
        bytes.byteOffset + bytes.byteLength,
      ) as ArrayBuffer
      downloadBlob(pdfBuffer, `fret-layout-${paper}.pdf`, 'application/pdf')
      setStatus('Tiled PDF downloaded.')
      tracker.current.track('export_created', 'pdf_export')
    } catch {
      setStatus('PDF generation failed. Your layout is unchanged; please try again.')
    } finally {
      setIsExportingPdf(false)
    }
  }

  return (
    <section
      className="fret-calculator"
      data-hydrated={hydrated ? 'true' : 'false'}
      aria-label="Fret spacing calculator"
    >
      <div className="fret-controls">
        <div className="step-heading">
          <span>1</span>
          <div>
            <p className="step-kicker">Instrument</p>
            <h2>Define the scale</h2>
          </div>
        </div>
        <label className="select-field" htmlFor="fret-preset">
          <span>Instrument preset</span>
          <select
            id="fret-preset"
            value={state.preset}
            onChange={(event) => selectPreset(event.target.value)}
          >
            {INSTRUMENT_PRESETS.map((preset) => (
              <option key={preset.id} value={preset.id}>{preset.name}</option>
            ))}
            <option value="custom">Custom scale</option>
          </select>
        </label>
        <div className="field-pair">
          <label className="stacked-field" htmlFor="scale-length">
            <span>Scale length</span>
            <div>
              <input
                id="scale-length"
                type="number"
                min={state.unit === 'mm' ? 254 : 10}
                max={state.unit === 'mm' ? 1016 : 40}
                step={state.unit === 'mm' ? 0.01 : 0.001}
                value={scaleInput}
                onChange={(event) => updateScale(event.target.value)}
                aria-invalid={invalidField === 'scale'}
                aria-describedby={invalidField === 'scale' ? 'fret-validation-error' : undefined}
              />
              <strong>{state.unit}</strong>
            </div>
          </label>
          <label className="stacked-field" htmlFor="fret-count">
            <span>Frets</span>
            <div>
              <input
                id="fret-count"
                type="number"
                min="1"
                max="36"
                step="1"
                value={fretInput}
                onChange={(event) => updateFrets(event.target.value)}
                aria-invalid={invalidField === 'frets'}
                aria-describedby={invalidField === 'frets' ? 'fret-validation-error' : undefined}
              />
            </div>
          </label>
        </div>
        <div className="segmented-control" aria-label="Length unit">
          {(['in', 'mm'] as LengthUnit[]).map((unit) => (
            <button
              key={unit}
              type="button"
              className={state.unit === unit ? 'is-selected' : ''}
              onClick={() => changeUnit(unit)}
            >
              <Ruler size={18} />{unit === 'in' ? 'Inches' : 'Millimeters'}
            </button>
          ))}
        </div>

        <details className="template-settings">
          <summary>
            <span>
              <strong>Workshop template options</strong>
              <small>{extentLabel} / {formatFretValue(state.nutWidthMm, state.unit)} to {formatFretValue(state.endWidthMm, state.unit)} {state.unit}</small>
            </span>
            <CaretDown size={18} aria-hidden="true" />
          </summary>
          <div className="template-settings-body">
            <fieldset>
              <legend>Template extent</legend>
              <p>Choose the shortest drawing that supports the job at your bench.</p>
              <div className="extent-options">
            <button type="button" aria-pressed={state.extent === 'last-fret'} className={state.extent === 'last-fret' ? 'is-selected' : ''} onClick={() => changeExtent('last-fret')}>
              <strong>Last fret</strong><span>Compact print template</span>
            </button>
            <button type="button" aria-pressed={state.extent === 'board-end'} className={state.extent === 'board-end' ? 'is-selected' : ''} onClick={() => changeExtent('board-end')}>
              <strong>Board end</strong><span>Add material after the final fret</span>
            </button>
            <button type="button" aria-pressed={state.extent === 'bridge'} className={state.extent === 'bridge' ? 'is-selected' : ''} onClick={() => changeExtent('bridge')}>
              <strong>Bridge reference</strong><span>Full theoretical scale</span>
            </button>
              </div>
              <div className="template-geometry-heading">
                <strong>Fretboard geometry</strong>
                <span>Presets set scale length only. Enter widths from your drawing.</span>
              </div>
              <div className="geometry-grid">
            <label className="stacked-field" htmlFor="nut-width">
              <span>Nut width</span>
              <div><input id="nut-width" type="number" min={state.unit === 'mm' ? 20 : 0.787} max={state.unit === 'mm' ? 100 : 3.937} step={state.unit === 'mm' ? 0.01 : 0.001} value={nutWidthInput} onChange={(event) => updateGeometry('nutWidthMm', event.target.value)} aria-invalid={invalidField === 'nut'} aria-describedby={invalidField === 'nut' ? 'fret-validation-error' : undefined} /><strong>{state.unit}</strong></div>
            </label>
            <label className="stacked-field" htmlFor="end-width">
              <span>Width at board end</span>
              <div><input id="end-width" type="number" min={state.unit === 'mm' ? 20 : 0.787} max={state.unit === 'mm' ? 100 : 3.937} step={state.unit === 'mm' ? 0.01 : 0.001} value={endWidthInput} onChange={(event) => updateGeometry('endWidthMm', event.target.value)} aria-invalid={invalidField === 'end'} aria-describedby={invalidField === 'end' ? 'fret-validation-error' : undefined} /><strong>{state.unit}</strong></div>
            </label>
            {state.extent !== 'last-fret' ? (
              <label className="stacked-field" htmlFor="board-end-margin">
                <span>Margin after final fret</span>
                <div><input id="board-end-margin" type="number" min="0" max={state.unit === 'mm' ? 100 : 3.937} step={state.unit === 'mm' ? 0.01 : 0.001} value={endMarginInput} onChange={(event) => updateGeometry('endMarginMm', event.target.value)} aria-invalid={invalidField === 'margin'} aria-describedby={invalidField === 'margin' ? 'fret-validation-error' : undefined} /><strong>{state.unit}</strong></div>
              </label>
            ) : null}
              </div>
              <button type="button" className="reset-template-button" onClick={resetTemplate}>
                <ArrowCounterClockwise size={17} />Reset template
              </button>
            </fieldset>
          </div>
        </details>

        {validationError ? <p className="field-error" id="fret-validation-error">{validationError}</p> : null}
        <p className="measurement-note">
          Measure every fret from the nut. Do not accumulate fret-to-fret distances.
        </p>
      </div>

      <section className="fret-preview-panel">
        <div className="patch-result-heading fret-preview-heading">
          <div>
            <p className="eyebrow">Calculated layout</p>
            <h2>{state.scaleLength.toFixed(state.unit === 'mm' ? 2 : 3)} {state.unit}</h2>
            <p>{state.fretCount} fret centerlines - {formatFretValue(template.lengthMm, state.unit)} {state.unit} template</p>
          </div>
          <div className="zoom-controls" aria-label="Fretboard preview zoom">
            <button type="button" onClick={() => setZoom((current) => Math.max(1, current - 0.25))} disabled={zoom <= 1} aria-label="Zoom out">
              <MagnifyingGlassMinus size={19} />
            </button>
            <button type="button" className="zoom-fit" onClick={fitPreview}>Fit</button>
            <span aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom((current) => Math.min(3, current + 0.25))} disabled={zoom >= 3} aria-label="Zoom in">
              <MagnifyingGlassPlus size={19} />
            </button>
          </div>
        </div>
        {selected ? (
          <div className="selected-fret-card">
            <div><span>Selected fret</span><strong>{selected.fret}</strong></div>
            <div><span>From nut</span><strong>{formatFretValue(selected.distanceFromNutMm, state.unit)} {state.unit}</strong></div>
            <div><span>Previous spacing</span><strong>{formatFretValue(selected.spacingFromPreviousMm, state.unit)} {state.unit}</strong></div>
            <div><span>Remaining scale</span><strong>{formatFretValue(selected.remainingScaleMm, state.unit)} {state.unit}</strong></div>
          </div>
        ) : null}
        <div className="fretboard-scroll" ref={fretboardScrollRef}>
          <svg
            className="fretboard-visual"
            viewBox="0 0 1000 210"
            style={{ width: `${zoom * 100}%` }}
          >
            <title>Tapered fretboard template showing calculated fret centerlines</title>
            <polygon
              points={`20,${previewCenterY - previewNutHalf} ${previewBoardEndX},${previewCenterY - previewEndHalf} ${previewBoardEndX},${previewCenterY + previewEndHalf} 20,${previewCenterY + previewNutHalf}`}
              className="fretboard-body"
            />
            <line x1="20" y1={previewCenterY - previewNutHalf - 5} x2="20" y2={previewCenterY + previewNutHalf + 5} className="nut-line" />
            <line x1="20" y1={previewCenterY} x2={previewBoardEndX} y2={previewCenterY} className="fret-centerline" />
            {template.bridgePositionMm !== undefined ? <line x1={previewBoardEndX} y1={previewCenterY} x2="980" y2={previewCenterY} className="bridge-extension-preview" /> : null}
            {positions.filter((position) => position.distanceFromNutMm <= template.boardEndMm + 0.001).map((position) => {
              const x = 20 + (position.distanceFromNutMm / template.lengthMm) * 960
              const halfWidth = templateWidthAt(template, position.distanceFromNutMm) * previewScaleY / 2
              const active = position.fret === selectedFret
              return (
                <g
                  key={position.fret}
                  className={active ? 'fret-line-group is-selected' : 'fret-line-group'}
                  onClick={() => setSelectedFret(position.fret)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setSelectedFret(position.fret)
                    }
                  }}
                  aria-label={`Select fret ${position.fret}`}
                >
                  <line className="fret-hit-area" x1={x} y1={previewCenterY - halfWidth} x2={x} y2={previewCenterY + halfWidth} />
                  <line className="fret-visible-line" x1={x} y1={previewCenterY - halfWidth} x2={x} y2={previewCenterY + halfWidth} />
                  <text x={x} y={previewCenterY - halfWidth - 10}>{position.fret}</text>
                </g>
              )
            })}
            {template.bridgePositionMm !== undefined ? (
              <g className="bridge-reference">
                <line x1="980" y1={previewCenterY - previewEndHalf - 8} x2="980" y2={previewCenterY + previewEndHalf + 8} />
                <text x="968" y={previewCenterY + previewEndHalf + 22}>Theoretical bridge - no compensation</text>
              </g>
            ) : null}
          </svg>
        </div>
        <p className="preview-help">Zoom changes the on-screen inspection only. SVG and PDF exports remain true 1:1 size.</p>
        <div className="verification-line">
          <CheckCircle size={20} weight="fill" />
          12th fret check: {formatFretValue(scaleMm / 2, state.unit)} {state.unit} - exactly half the scale.
        </div>
        <button type="button" className="secondary-button share-layout" onClick={shareLayout} disabled={validationError !== ''}>
          <LinkSimple size={19} />Share this layout
        </button>
      </section>

      <section className="fret-results-panel">
        <div className="step-heading">
          <span>2</span>
          <div>
            <p className="step-kicker">Measurements</p>
            <h2>Nut-based positions</h2>
          </div>
        </div>
        <div className="table-scroll fret-table-scroll" tabIndex={0} aria-label="Scrollable fret measurements">
          <table>
            <caption className="sr-only">Fret positions measured from the nut</caption>
            <thead><tr><th>Fret</th><th>From nut</th><th>Previous spacing</th><th>Remaining</th></tr></thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.fret} className={position.fret === selectedFret ? 'is-selected' : ''} aria-selected={position.fret === selectedFret} onClick={() => setSelectedFret(position.fret)}>
                  <th><button type="button" className="fret-select-button" onClick={() => setSelectedFret(position.fret)} aria-label={`Select fret ${position.fret}`}>{position.fret}</button></th>
                  <td className="mono-cell">{formatFretValue(position.distanceFromNutMm, state.unit)} {state.unit}</td>
                  <td className="mono-cell">{formatFretValue(position.spacingFromPreviousMm, state.unit)} {state.unit}</td>
                  <td className="mono-cell">{formatFretValue(position.remainingScaleMm, state.unit)} {state.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="export-panel">
        <div className="step-heading">
          <span>3</span>
          <div>
            <p className="step-kicker">Workshop exports</p>
            <h2>Take it to the bench</h2>
          </div>
        </div>
        <div className="export-grid">
          <button type="button" onClick={exportCsv} disabled={validationError !== ''}><FileCsv size={26} weight="duotone" /><span><strong>CSV measurements</strong><small>For spreadsheets and checks</small></span><DownloadSimple size={18} /></button>
          <button type="button" onClick={exportSvg} disabled={validationError !== ''}><FileSvg size={26} weight="duotone" /><span><strong>1:1 tapered SVG</strong><small>Physical dimensions and calibration rulers</small></span><DownloadSimple size={18} /></button>
        </div>
        <div className="print-card">
          <div className="print-card-heading"><Printer size={25} weight="duotone" /><div><strong>Tiled print PDF</strong><span>{pdfLayout.pages.length} pages - 10 mm overlap</span></div></div>
          <div className="segmented-control" aria-label="Print paper">
            {(['letter', 'a4'] as PrintPaper[]).map((paperOption) => (
              <button key={paperOption} type="button" className={paper === paperOption ? 'is-selected' : ''} onClick={() => setPaper(paperOption)}>{paperOption === 'letter' ? 'US Letter' : 'A4'}</button>
            ))}
          </div>
          <p>Print at <strong>100% / Actual Size</strong> and disable Fit to Page. Align the registration marks, then verify a ruler on every sheet.</p>
          <button type="button" className="primary-button" aria-busy={isExportingPdf} disabled={validationError !== '' || isExportingPdf} onClick={() => void exportPdf()}><FilePdf size={20} />{isExportingPdf ? 'Preparing PDF...' : 'Download print PDF'}</button>
        </div>
        <p className="screen-status" aria-live="polite">{status}</p>
      </section>
    </section>
  )
}
