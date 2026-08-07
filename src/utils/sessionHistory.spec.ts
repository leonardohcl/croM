import { beforeEach, describe, expect, it } from 'vitest'
import { listSessionHistory, upsertSessionHistoryEntry } from './sessionHistory'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
  intervals: { a1: [{ start: 0, end: 10 }] },
}

describe('sessionHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns an empty list when nothing has been saved', () => {
    expect(listSessionHistory()).toEqual([])
  })

  it('adds a new entry for a new id', () => {
    const entry = upsertSessionHistoryEntry('s1', snapshot)

    expect(entry.id).toBe('s1')
    expect(entry.snapshot).toEqual(snapshot)
    expect(listSessionHistory()).toEqual([entry])
  })

  it('replaces the existing entry for an id rather than duplicating it', () => {
    upsertSessionHistoryEntry('s1', snapshot)
    const updatedSnapshot: SessionSnapshot = { ...snapshot, subjects: [] }

    const updated = upsertSessionHistoryEntry('s1', updatedSnapshot)

    const all = listSessionHistory()
    expect(all).toHaveLength(1)
    expect(all[0].snapshot).toEqual(updatedSnapshot)
    expect(all[0].id).toBe(updated.id)
  })

  it('keeps separate entries for different ids', () => {
    upsertSessionHistoryEntry('s1', snapshot)
    upsertSessionHistoryEntry('s2', snapshot)

    expect(listSessionHistory()).toHaveLength(2)
  })

  it('lists entries most recently saved first', () => {
    localStorage.setItem(
      'crom:history',
      JSON.stringify([
        { id: 'older', savedAt: '2026-01-01T00:00:00.000Z', snapshot },
        { id: 'newer', savedAt: '2026-01-02T00:00:00.000Z', snapshot },
      ]),
    )

    expect(listSessionHistory().map((entry) => entry.id)).toEqual(['newer', 'older'])
  })

  it('returns an empty list for corrupted JSON', () => {
    localStorage.setItem('crom:history', '{not valid json')

    expect(listSessionHistory()).toEqual([])
  })
})
