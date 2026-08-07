/** The subset of `File` (or `VideoMeta`) needed to derive a stable per-video storage key. */
export interface StorageKeySource {
  name: string
  size: number
  lastModified: number
}

/** Derives a localStorage key that identifies a specific video file, so a session can be resumed when it's re-selected. */
export function storageKey(file: StorageKeySource): string {
  return `crom:${file.name}:${file.size}:${file.lastModified}`
}
