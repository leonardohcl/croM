import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSessionStore } from './session'
import type { SessionSnapshot } from '@/types'

describe('session store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds a subject with an empty interval list', () => {
    const store = useSessionStore()

    const subject = store.addSubject('Grooming', 'g')

    expect(store.subjects).toEqual([subject])
    expect(store.intervals[subject.id]).toEqual([])
    expect(store.isActive(subject.id)).toBe(false)
  })

  it('removes a subject and its intervals', () => {
    const store = useSessionStore()
    const subject = store.addSubject('Grooming', 'g')

    store.removeSubject(subject.id)

    expect(store.subjects).toEqual([])
    expect(store.intervals[subject.id]).toBeUndefined()
  })

  it('opens an interval on first toggle and closes it on the second', () => {
    const store = useSessionStore()
    const subject = store.addSubject('Grooming', 'g')

    store.toggleSubject(subject.id, 10)
    expect(store.intervals[subject.id]).toEqual([{ start: 10, end: null }])
    expect(store.isActive(subject.id)).toBe(true)

    store.toggleSubject(subject.id, 25)
    expect(store.intervals[subject.id]).toEqual([{ start: 10, end: 25 }])
    expect(store.isActive(subject.id)).toBe(false)
    expect(store.totalDuration(subject.id)).toBe(15)
  })

  it('supports multiple open/close cycles, accumulating duration', () => {
    const store = useSessionStore()
    const subject = store.addSubject('Grooming', 'g')

    store.toggleSubject(subject.id, 0)
    store.toggleSubject(subject.id, 5)
    store.toggleSubject(subject.id, 20)
    store.toggleSubject(subject.id, 30)

    expect(store.intervals[subject.id]).toEqual([
      { start: 0, end: 5 },
      { start: 20, end: 30 },
    ])
    expect(store.totalDuration(subject.id)).toBe(15)
  })

  it('toggles multiple subjects independently', () => {
    const store = useSessionStore()
    const grooming = store.addSubject('Grooming', 'g')
    const feeding = store.addSubject('Feeding', 'f')

    store.toggleSubject(grooming.id, 0)
    store.toggleSubject(feeding.id, 2)
    store.toggleSubject(feeding.id, 12)

    expect(store.isActive(grooming.id)).toBe(true)
    expect(store.isActive(feeding.id)).toBe(false)
    expect(store.totalDuration(feeding.id)).toBe(10)
    expect(store.totalDuration(grooming.id)).toBe(0)
  })

  it('ignores an open interval when computing total duration', () => {
    const store = useSessionStore()
    const subject = store.addSubject('Grooming', 'g')

    store.toggleSubject(subject.id, 0)

    expect(store.totalDuration(subject.id)).toBe(0)
  })

  it('loads a snapshot, replacing existing state', () => {
    const store = useSessionStore()
    store.addSubject('Stale', 'x')

    const snapshot: SessionSnapshot = {
      video: { name: 'video.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
      subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
      intervals: { a1: [{ start: 0, end: 10 }] },
    }

    store.loadSnapshot(snapshot)

    expect(store.video).toEqual(snapshot.video)
    expect(store.subjects).toEqual(snapshot.subjects)
    expect(store.intervals).toEqual(snapshot.intervals)
  })

  it('resets to the initial empty state', () => {
    const store = useSessionStore()
    store.addSubject('Grooming', 'g')
    store.setVideo({ name: 'v.mp4', size: 1, lastModified: 1, duration: 1 })

    store.reset()

    expect(store.video).toBeNull()
    expect(store.subjects).toEqual([])
    expect(store.intervals).toEqual({})
  })
})
