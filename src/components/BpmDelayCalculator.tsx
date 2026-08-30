import { useEffect, useMemo, useRef, useState } from 'react'
import { TapTempo, type TapTempoResult } from '../domain/tap-tempo'
import {
  bpmFromQuarterNoteMs,
  calculateDelayRows,
  type TimingFeel,
  type TimingRow,
} from '../domain/timing'
import {
  createProductEventTracker,
  type ProductEventDetail,
} from '../lib/product-events'

const COMMON_TIMING_IDS = [
  '1/4-straight',
  '1/8-straight',
  '1/8-dotted',
  '1/8-triplet',
  '1/16-straight',
]

const FEELS: TimingFeel[] = ['straight', 'dotted', 'triplet']

function isValidBpm(value: number): boolean {
  return Number.isFinite(value) && value >= 20 && value <= 400
}

function formatMilliseconds(value: number): string {
  if (value >= 100) return value.toFixed(1)
  if (value >= 10) return value.toFixed(2)
  return value.toFixed(3)
}

async function writeTextToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text)
    return
  } catch {
    const fallback = document.createElement('textarea')
    fallback.value = text
    fallback.setAttribute('readonly', '')
    fallback.style.position = 'fixed'
    fallback.style.opacity = '0'
    document.body.appendChild(fallback)
    fallback.select()
    const copied = document.execCommand('copy')
    fallback.remove()
    if (!copied) throw new Error('Clipboard permission denied.')
  }
}

function Availability({
  isAvailable,
}: {
  isAvailable: boolean
}) {
  return isAvailable ? (
    <span className="availability availability-ok">
      <span aria-hidden="true">✓</span> In range
    </span>
  ) : (
    <span className="availability availability-over">
      <span aria-hidden="true">!</span> Over device max
    </span>
  )
}

function TimingCard({
  row,
  copied,
  onCopy,
}: {
  row: TimingRow
  copied: boolean
  onCopy: (row: TimingRow) => void
}) {
  return (
    <article className={row.isAvailable ? 'timing-card' : 'timing-card is-over'}>
      <div className="timing-card-heading">
        <div>
          <p className="note-fraction">{row.note}</p>
          <h3>{row.label}</h3>
        </div>
        <span className="feel-chip">{row.feel}</span>
      </div>
      <p className="timing-value">
        {formatMilliseconds(row.milliseconds)}
        <span> ms</span>
      </p>
      <div className="timing-meta">
        <span>{row.hertz.toFixed(3)} Hz</span>
        <Availability isAvailable={row.isAvailable} />
      </div>
      <button
        type="button"
        className="copy-button"
        onClick={() => onCopy(row)}
        aria-label={`Copy ${formatMilliseconds(row.milliseconds)} milliseconds for ${row.label}`}
      >
        {copied ? 'Copied' : 'Copy value'}
      </button>
    </article>
  )
}

export default function BpmDelayCalculator() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [bpmInput, setBpmInput] = useState('120.0')
  const [deviceMaxInput, setDeviceMaxInput] = useState('')
  const [quarterNoteInput, setQuarterNoteInput] = useState('500')
  const [enabledFeels, setEnabledFeels] = useState<Set<TimingFeel>>(
    () => new Set(FEELS),
  )
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [shareStatus, setShareStatus] = useState('')
  const [tapResult, setTapResult] = useState<TapTempoResult>({
    bpm: null,
    status: 'waiting',
    intervalCount: 0,
    didReset: false,
  })
  const tapTempo = useRef(new TapTempo())
  const eventTracker = useRef<ReturnType<
    typeof createProductEventTracker
  > | null>(null)
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (eventTracker.current === null) {
    eventTracker.current = createProductEventTracker()
  }

  useEffect(() => {
    setIsHydrated(true)
    const params = new URLSearchParams(window.location.search)
    const sharedBpm = Number(params.get('bpm'))
    const sharedDeviceMax = Number(params.get('max'))

    if (isValidBpm(sharedBpm)) {
      setBpmInput(sharedBpm.toFixed(1))
      setQuarterNoteInput((60_000 / sharedBpm).toFixed(1))
    }
    if (Number.isFinite(sharedDeviceMax) && sharedDeviceMax > 0) {
      setDeviceMaxInput(String(sharedDeviceMax))
    }
  }, [])

  useEffect(
    () => () => {
      if (copyTimer.current !== null) clearTimeout(copyTimer.current)
    },
    [],
  )

  const parsedBpm = Number(bpmInput)
  const bpm = isValidBpm(parsedBpm) ? parsedBpm : null
  const parsedDeviceMax = Number(deviceMaxInput)
  const deviceMax =
    deviceMaxInput === '' ||
    !Number.isFinite(parsedDeviceMax) ||
    parsedDeviceMax <= 0
      ? undefined
      : parsedDeviceMax

  const rows = useMemo(
    () => (bpm === null ? [] : calculateDelayRows(bpm, deviceMax)),
    [bpm, deviceMax],
  )
  const commonRows = COMMON_TIMING_IDS.map((id) =>
    rows.find((row) => row.id === id),
  ).filter((row): row is TimingRow => row !== undefined)
  const filteredRows = rows.filter((row) => enabledFeels.has(row.feel))
  const longestAvailable = rows.reduce<TimingRow | undefined>(
    (longest, row) => {
      if (!row.isAvailable) return longest
      if (longest === undefined || row.milliseconds > longest.milliseconds) {
        return row
      }
      return longest
    },
    undefined,
  )

  function updateBpm(nextValue: string) {
    setBpmInput(nextValue)
    const numericValue = Number(nextValue)
    if (isValidBpm(numericValue)) {
      setQuarterNoteInput((60_000 / numericValue).toFixed(1))
    }
  }

  function track(
    eventName: Parameters<
      ReturnType<typeof createProductEventTracker>['track']
    >[0],
    detail: ProductEventDetail,
  ) {
    eventTracker.current?.track(eventName, detail)
  }

  function handleBpmInput(nextValue: string) {
    updateBpm(nextValue)
    track('tool_started', 'bpm_input')
    if (isValidBpm(Number(nextValue))) {
      track('calculation_completed', 'bpm_changed')
    }
  }

  function handleTap() {
    track('tool_started', 'tap_tempo')
    const result = tapTempo.current.tap(performance.now())
    setTapResult(result)
    if (result.bpm !== null && isValidBpm(result.bpm)) {
      updateBpm(result.bpm.toFixed(1))
      track(
        'tap_used',
        result.status === 'stable' ? 'stable' : 'provisional',
      )
      track('calculation_completed', 'tap_result')
    }
  }

  function resetTap() {
    setTapResult(tapTempo.current.reset())
  }

  async function copyTiming(
    row: TimingRow,
    source: 'common_card' | 'full_table' = 'common_card',
  ) {
    try {
      await writeTextToClipboard(
        `${formatMilliseconds(row.milliseconds)} ms`,
      )
      setCopiedId(row.id)
      setShareStatus('')
      track('value_copied', source)
      if (copyTimer.current !== null) clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopiedId(null), 1_600)
    } catch {
      setShareStatus('Clipboard access is unavailable in this browser.')
    }
  }

  async function shareConfiguration() {
    if (bpm === null) return

    const url = new URL(window.location.href)
    url.search = ''
    url.searchParams.set('bpm', bpm.toFixed(1))
    if (deviceMax !== undefined) url.searchParams.set('max', String(deviceMax))

    const shareData = {
      title: 'BPM to MS calculator',
      text: `${bpm.toFixed(1)} BPM delay timing table`,
      url: url.toString(),
    }

    if (navigator.share !== undefined) {
      try {
        await navigator.share(shareData)
        setShareStatus('Shared.')
        track('share_clicked', 'native_share')
        return
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          setShareStatus('Share canceled.')
          return
        }
      }
    }

    try {
      await writeTextToClipboard(url.toString())
      setShareStatus('Share link copied.')
      track('share_clicked', 'link_copy')
    } catch {
      setShareStatus('Clipboard access is unavailable in this browser.')
    }
  }

  function toggleFeel(feel: TimingFeel) {
    setEnabledFeels((current) => {
      const next = new Set(current)
      if (next.has(feel)) {
        if (next.size > 1) next.delete(feel)
      } else {
        next.add(feel)
      }
      return next
    })
  }

  function useQuarterNoteDuration() {
    const milliseconds = Number(quarterNoteInput)
    if (!Number.isFinite(milliseconds) || milliseconds <= 0) return
    const convertedBpm = bpmFromQuarterNoteMs(milliseconds)
    track('tool_started', 'ms_to_bpm')
    if (isValidBpm(convertedBpm)) {
      updateBpm(convertedBpm.toFixed(1))
      track('calculation_completed', 'ms_to_bpm')
    }
  }

  const bpmError =
    bpm === null ? 'Enter a BPM from 20 to 400.' : ''
  const tapStatus =
    tapResult.status === 'waiting'
      ? 'Tap at least twice'
      : tapResult.status === 'provisional'
        ? 'Provisional — tap again'
        : tapResult.status === 'stable'
          ? 'Stable timing'
          : 'Keep tapping for a steadier result'

  return (
    <section
      className="calculator-workspace"
      aria-label="BPM delay calculator"
      data-hydrated={isHydrated ? 'true' : 'false'}
    >
      <div className="control-panel">
        <div className="control-block">
          <label htmlFor="bpm" className="field-label">
            Tempo
          </label>
          <div className="number-field">
            <input
              id="bpm"
              name="bpm"
              type="number"
              min="20"
              max="400"
              step="0.1"
              inputMode="decimal"
              value={bpmInput}
              onChange={(event) => handleBpmInput(event.target.value)}
              aria-describedby={bpmError ? 'bpm-error' : 'bpm-help'}
              aria-invalid={bpmError !== ''}
            />
            <span>BPM</span>
          </div>
          {bpmError ? (
            <p id="bpm-error" className="field-error">
              {bpmError}
            </p>
          ) : (
            <p id="bpm-help" className="field-help">
              20–400 BPM · one decimal supported
            </p>
          )}
        </div>

        <div className="tap-block">
          <div className="tap-heading">
            <div>
              <p className="field-label">Tap tempo</p>
              <p className={`tap-status tap-status-${tapResult.status}`}>
                {tapStatus}
              </p>
            </div>
            <button type="button" className="text-button" onClick={resetTap}>
              Reset
            </button>
          </div>
          <button
            type="button"
            className="tap-button"
            onClick={handleTap}
            aria-describedby="tap-instruction"
          >
            <span className="tap-pulse" aria-hidden="true" />
            <span>Tap</span>
            <span className="tap-reading">
              {tapResult.bpm === null ? '—' : `${tapResult.bpm.toFixed(1)} BPM`}
            </span>
          </button>
          <p id="tap-instruction" className="field-help">
            Click or focus and press Space. No microphone required.
          </p>
        </div>

        <div className="control-block device-control">
          <label htmlFor="device-max" className="field-label">
            Device max delay <span>Optional</span>
          </label>
          <div className="number-field number-field-secondary">
            <input
              id="device-max"
              name="max"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 2000"
              value={deviceMaxInput}
              onChange={(event) => {
                setDeviceMaxInput(event.target.value)
                track('tool_started', 'device_limit')
              }}
            />
            <span>ms</span>
          </div>
          <p className="field-help">
            Check your pedal or plugin manual for its maximum delay time.
          </p>
          {deviceMax !== undefined && longestAvailable !== undefined ? (
            <p className="device-hint">
              <span aria-hidden="true">✓</span> Longest in-range setting:{' '}
              <strong>{longestAvailable.label}</strong>
            </p>
          ) : null}
        </div>

        <details className="reverse-converter">
          <summary>Convert ms to BPM</summary>
          <div className="reverse-converter-body">
            <label htmlFor="quarter-note-ms">Quarter-note duration</label>
            <div className="inline-converter">
              <div className="number-field number-field-secondary">
                <input
                  id="quarter-note-ms"
                  type="number"
                  min="150"
                  max="3000"
                  step="0.1"
                  value={quarterNoteInput}
                  onChange={(event) => setQuarterNoteInput(event.target.value)}
                />
                <span>ms</span>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={useQuarterNoteDuration}
              >
                Use this BPM
              </button>
            </div>
          </div>
        </details>
      </div>

      <div className="results-panel">
        <div className="results-heading">
          <div>
            <p className="eyebrow">Common delay times</p>
            <h2>
              {bpm === null ? 'Waiting for a valid tempo' : `At ${bpm.toFixed(1)} BPM`}
            </h2>
          </div>
          <button
            type="button"
            className="share-button"
            onClick={shareConfiguration}
            disabled={bpm === null}
          >
            Share setup
          </button>
        </div>

        <div className="timing-grid" aria-live="polite">
          {commonRows.map((row) => (
            <TimingCard
              key={row.id}
              row={row}
              copied={copiedId === row.id}
              onCopy={copyTiming}
            />
          ))}
        </div>

        <details className="full-table">
          <summary>View full timing table</summary>
          <div className="table-toolbar">
            <p>Filter feel</p>
            <div className="feel-filters">
              {FEELS.map((feel) => (
                <label key={feel}>
                  <input
                    type="checkbox"
                    checked={enabledFeels.has(feel)}
                    onChange={() => toggleFeel(feel)}
                  />
                  <span>{feel}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="table-scroll">
            <table>
              <caption className="sr-only">
                Note timing values in fixed musical order
              </caption>
              <thead>
                <tr>
                  <th scope="col">Note</th>
                  <th scope="col">Feel</th>
                  <th scope="col">Time</th>
                  <th scope="col">Rate</th>
                  <th scope="col">Device</th>
                  <th scope="col">
                    <span className="sr-only">Copy</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} className={row.isAvailable ? '' : 'is-over'}>
                    <th scope="row">{row.note}</th>
                    <td>{row.feel}</td>
                    <td className="mono-cell">
                      {formatMilliseconds(row.milliseconds)} ms
                    </td>
                    <td className="mono-cell">{row.hertz.toFixed(3)} Hz</td>
                    <td>
                      <Availability isAvailable={row.isAvailable} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="table-copy"
                        onClick={() => copyTiming(row, 'full_table')}
                      >
                        {copiedId === row.id ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>

        <p className="screen-status" aria-live="polite">
          {shareStatus}
        </p>
      </div>
    </section>
  )
}
