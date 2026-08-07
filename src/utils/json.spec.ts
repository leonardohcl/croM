import { describe, expect, it } from 'vitest'
import { toJson } from './json'
import type { SessionSnapshot } from '@/types'

describe('toJson', () => {
  it('round-trips a session snapshot', () => {
    const snapshot: SessionSnapshot = {
      video: { name: 'video.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
      subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
      intervals: { a1: [{ start: 0, end: 10 }] },
    }

    expect(JSON.parse(toJson(snapshot))).toEqual(snapshot)
  })

  it('pretty-prints with two-space indentation', () => {
    const snapshot: SessionSnapshot = { video: null, subjects: [], intervals: {} }

    expect(toJson(snapshot)).toBe('{\n  "video": null,\n  "subjects": [],\n  "intervals": {}\n}')
  })
})
