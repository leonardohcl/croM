import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { DESKTOP_MIN_WIDTH_QUERY, useIsDesktop } from './useIsDesktop'

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<(event: MediaQueryListEvent) => void>()
  const mediaQueryList = {
    matches: initialMatches,
    media: DESKTOP_MIN_WIDTH_QUERY,
    addEventListener: (_: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.add(listener)
    },
    removeEventListener: (_: 'change', listener: (event: MediaQueryListEvent) => void) => {
      listeners.delete(listener)
    },
  }
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mediaQueryList))

  return {
    fireChange(matches: boolean) {
      mediaQueryList.matches = matches
      for (const listener of listeners) listener({ matches } as MediaQueryListEvent)
    },
  }
}

function mountWithIsDesktop() {
  let isDesktopRef: ReturnType<typeof useIsDesktop>
  const TestComponent = defineComponent({
    setup() {
      isDesktopRef = useIsDesktop()
      return () => h('div')
    },
  })
  mount(TestComponent)
  return isDesktopRef!
}

describe('useIsDesktop', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('reflects the initial media query match', () => {
    mockMatchMedia(true)

    expect(mountWithIsDesktop().value).toBe(true)
  })

  it('reflects a non-matching initial media query', () => {
    mockMatchMedia(false)

    expect(mountWithIsDesktop().value).toBe(false)
  })

  it('updates live when the media query changes', () => {
    const { fireChange } = mockMatchMedia(true)
    const isDesktop = mountWithIsDesktop()

    fireChange(false)

    expect(isDesktop.value).toBe(false)
  })
})
