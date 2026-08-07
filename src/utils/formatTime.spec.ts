import { describe, expect, it } from 'vitest'
import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('formats zero seconds', () => {
    expect(formatTime(0)).toBe('00:00')
  })

  it('formats seconds under a minute', () => {
    expect(formatTime(45)).toBe('00:45')
  })

  it('formats minutes and seconds', () => {
    expect(formatTime(83)).toBe('01:23')
  })

  it('rounds fractional seconds', () => {
    expect(formatTime(59.6)).toBe('01:00')
  })

  it('clamps negative input to zero', () => {
    expect(formatTime(-5)).toBe('00:00')
  })
})
