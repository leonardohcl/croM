/** Formats a duration in seconds as `mm:ss`, e.g. `83` -> `"01:23"`. Negative input clamps to zero. */
export function formatTime(seconds: number): string {
  const totalSeconds = Math.max(0, Math.round(seconds))
  const minutes = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}
