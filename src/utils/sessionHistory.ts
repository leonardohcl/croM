import type { SessionHistoryEntry, SessionSnapshot } from '@/types'

const HISTORY_KEY = 'crom:history'

function readHistory(): SessionHistoryEntry[] {
  const raw = localStorage.getItem(HISTORY_KEY)
  if (!raw) return []

  try {
    return JSON.parse(raw) as SessionHistoryEntry[]
  } catch {
    return []
  }
}

function writeHistory(entries: SessionHistoryEntry[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries))
}

/** Returns all archived sessions, most recently saved first. */
export function listSessionHistory(): SessionHistoryEntry[] {
  return readHistory().sort((a, b) => b.savedAt.localeCompare(a.savedAt))
}

/**
 * Saves a session snapshot to history under the given id, updating the save time.
 * Replaces the existing entry for that id if one exists, otherwise adds a new one —
 * so repeated saves for the same in-progress session update a single entry rather
 * than piling up duplicates.
 */
export function upsertSessionHistoryEntry(id: string, snapshot: SessionSnapshot): SessionHistoryEntry {
  const entries = readHistory()
  const entry: SessionHistoryEntry = { id, savedAt: new Date().toISOString(), snapshot }
  const index = entries.findIndex((existing) => existing.id === id)

  if (index === -1) entries.push(entry)
  else entries[index] = entry

  writeHistory(entries)
  return entry
}
