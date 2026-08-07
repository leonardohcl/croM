import { describe, expect, it } from 'vitest'
import { toCsv } from './csv'
import type { SessionSnapshot } from '@/types'

describe('toCsv', () => {
  it('produces a header-only string when there are no subjects', () => {
    const snapshot: SessionSnapshot = { video: null, subjects: [], intervals: {} }

    expect(toCsv(snapshot)).toBe('Subject,Key,Start (s),End (s),Duration (s)')
  })

  it('produces one row per interval, across subjects, leaving end/duration blank when open', () => {
    const snapshot: SessionSnapshot = {
      video: null,
      subjects: [
        { id: 'a1', label: 'Grooming', key: 'g' },
        { id: 'a2', label: 'Feeding', key: 'f' },
      ],
      intervals: {
        a1: [
          { start: 0, end: 10 },
          { start: 20, end: null },
        ],
        a2: [{ start: 5, end: 15 }],
      },
    }

    expect(toCsv(snapshot)).toBe(
      [
        'Subject,Key,Start (s),End (s),Duration (s)',
        'Grooming,g,0,10,10',
        'Grooming,g,20,,',
        'Feeding,f,5,15,10',
      ].join('\n'),
    )
  })

  it('quotes fields containing commas or quotes', () => {
    const snapshot: SessionSnapshot = {
      video: null,
      subjects: [{ id: 'a1', label: 'Grooming, "self"', key: 'g' }],
      intervals: { a1: [{ start: 0, end: 1 }] },
    }

    expect(toCsv(snapshot)).toBe(
      ['Subject,Key,Start (s),End (s),Duration (s)', '"Grooming, ""self""",g,0,1,1'].join('\n'),
    )
  })
})
