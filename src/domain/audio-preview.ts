import type { DelayPatch } from './delay-patch'

export interface AudioPreviewEvent {
  channel: 'dry' | 'left' | 'right'
  atSeconds: number
  gain: number
}

export function createAudioPreviewSchedule(patch: DelayPatch): {
  durationSeconds: number
  events: AudioPreviewEvent[]
} {
  return {
    durationSeconds: patch.barDurationMs / 1_000,
    events: patch.markers.map((marker) => ({
      channel: marker.channel,
      atSeconds: marker.milliseconds / 1_000,
      gain: marker.channel === 'dry' ? 0.42 : marker.channel === 'left' ? 0.19 : 0.14,
    })),
  }
}

export class OneBarAudioPreview {
  private context: AudioContext | null = null
  private sources: AudioBufferSourceNode[] = []
  private stopTimer: ReturnType<typeof setTimeout> | null = null

  async play(patch: DelayPatch): Promise<number> {
    this.stop()
    const AudioContextClass = window.AudioContext
    this.context = new AudioContextClass()
    await this.context.resume()
    const schedule = createAudioPreviewSchedule(patch)
    const sampleRate = this.context.sampleRate
    const buffer = this.context.createBuffer(1, Math.round(sampleRate * 0.16), sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) {
      const decay = Math.exp((-index / sampleRate) * 28)
      data[index] = (Math.random() * 2 - 1) * decay
    }

    const startAt = this.context.currentTime + 0.04
    for (const event of schedule.events) {
      const source = this.context.createBufferSource()
      const filter = this.context.createBiquadFilter()
      const gain = this.context.createGain()
      const pan = this.context.createStereoPanner()
      source.buffer = buffer
      filter.type = 'lowpass'
      filter.frequency.value = event.channel === 'dry' ? 2600 : 1800
      gain.gain.value = event.gain
      pan.pan.value = event.channel === 'left' ? -0.55 : event.channel === 'right' ? 0.55 : 0
      source.connect(filter).connect(gain).connect(pan).connect(this.context.destination)
      source.start(startAt + event.atSeconds)
      this.sources.push(source)
    }

    const durationMs = Math.ceil((schedule.durationSeconds + 0.3) * 1_000)
    this.stopTimer = setTimeout(() => this.stop(), durationMs)
    return durationMs
  }

  stop(): void {
    if (this.stopTimer !== null) clearTimeout(this.stopTimer)
    this.stopTimer = null
    for (const source of this.sources) {
      try { source.stop() } catch { /* already stopped */ }
    }
    this.sources = []
    if (this.context !== null) void this.context.close()
    this.context = null
  }
}
