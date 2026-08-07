/** A configured timer bound to a subject/behavior, toggled by key press or button. */
export interface Subject {
  id: string
  label: string
  /** Keyboard key that toggles this subject (e.g. `"a"`, `" "`, `"Enter"`). */
  key: string
  /** Optional free-text notes about the subject/behavior, shown on its card. */
  description?: string
}

/** A single recorded span on a subject's timeline. `end === null` means the interval is still open. */
export interface Interval {
  start: number
  end: number | null
}

/** Metadata about the currently loaded video, used both for display and as part of the storage key. */
export interface VideoMeta {
  name: string
  size: number
  lastModified: number
  duration: number
}

/** The full serializable state of a session, persisted to and restored from localStorage. */
export interface SessionSnapshot {
  video: VideoMeta | null
  subjects: Subject[]
  intervals: Record<string, Interval[]>
}

/** A session snapshot archived to the history list, identified by when it was saved. */
export interface SessionHistoryEntry {
  id: string
  savedAt: string
  snapshot: SessionSnapshot
}
