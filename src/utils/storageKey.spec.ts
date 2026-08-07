import { describe, expect, it } from 'vitest'
import { storageKey } from './storageKey'

describe('storageKey', () => {
  it('produces the same key for the same file metadata', () => {
    const a = { name: 'video.mp4', size: 1024, lastModified: 1700000000000 }
    const b = { name: 'video.mp4', size: 1024, lastModified: 1700000000000 }

    expect(storageKey(a)).toBe(storageKey(b))
  })

  it('produces a different key when the name differs', () => {
    const a = { name: 'video.mp4', size: 1024, lastModified: 1700000000000 }
    const b = { name: 'other.mp4', size: 1024, lastModified: 1700000000000 }

    expect(storageKey(a)).not.toBe(storageKey(b))
  })

  it('produces a different key when the size differs', () => {
    const a = { name: 'video.mp4', size: 1024, lastModified: 1700000000000 }
    const b = { name: 'video.mp4', size: 2048, lastModified: 1700000000000 }

    expect(storageKey(a)).not.toBe(storageKey(b))
  })

  it('produces a different key when lastModified differs', () => {
    const a = { name: 'video.mp4', size: 1024, lastModified: 1700000000000 }
    const b = { name: 'video.mp4', size: 1024, lastModified: 1700000000001 }

    expect(storageKey(a)).not.toBe(storageKey(b))
  })
})
