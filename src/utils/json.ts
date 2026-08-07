import type { SessionSnapshot } from '@/types'

/** Serializes a session into a pretty-printed JSON string, suitable for file export. */
export function toJson(snapshot: SessionSnapshot): string {
  return JSON.stringify(snapshot, null, 2)
}

/** Parses a session snapshot from JSON text, throwing if the content isn't a valid snapshot. */
export function fromJson(text: string): SessionSnapshot {
  const data = JSON.parse(text)
  const isValid =
    typeof data === 'object' &&
    data !== null &&
    (data.video === null || typeof data.video === 'object') &&
    Array.isArray(data.subjects) &&
    typeof data.intervals === 'object' &&
    data.intervals !== null

  if (!isValid) throw new Error('Not a valid session snapshot.')
  return data as SessionSnapshot
}
