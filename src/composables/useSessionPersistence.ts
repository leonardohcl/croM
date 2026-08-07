import { watch } from 'vue'
import type { SessionSnapshot } from '@/types'

/** Reads a previously saved session snapshot for the given storage key, if any. */
export function loadSession(key: string): SessionSnapshot | null {
  const raw = localStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as SessionSnapshot
  } catch {
    return null
  }
}

/** Saves a session snapshot to localStorage under the given storage key. */
export function saveSession(key: string, snapshot: SessionSnapshot) {
  localStorage.setItem(key, JSON.stringify(snapshot))
}

/**
 * Auto-saves a session snapshot to localStorage under a reactive storage key, whenever
 * the key or the snapshot's contents change. No-ops while the key is null (e.g. before
 * a video has been loaded). `key` and `snapshot` are getters so any reactive source
 * (a Pinia store, a ref) can be passed in without this composable depending on it.
 */
export function useSessionPersistence(key: () => string | null, snapshot: () => SessionSnapshot) {
  watch(
    [key, snapshot],
    ([currentKey, currentSnapshot]) => {
      if (!currentKey) return
      saveSession(currentKey, currentSnapshot)
    },
    { deep: true },
  )
}
