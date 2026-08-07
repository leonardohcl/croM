import type { SessionSnapshot } from '@/types'

/** Serializes a session into a pretty-printed JSON string, suitable for file export. */
export function toJson(snapshot: SessionSnapshot): string {
  return JSON.stringify(snapshot, null, 2)
}
