import { beforeEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, reactive } from 'vue'
import { mount } from '@vue/test-utils'
import { loadSession, saveSession, useSessionPersistence } from './useSessionPersistence'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
  intervals: { a1: [{ start: 0, end: 10 }] },
}

describe('saveSession / loadSession', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when nothing is saved for the key', () => {
    expect(loadSession('missing-key')).toBeNull()
  })

  it('round-trips a saved snapshot', () => {
    saveSession('crom:clip.mp4:1024:1700000000000', snapshot)

    expect(loadSession('crom:clip.mp4:1024:1700000000000')).toEqual(snapshot)
  })

  it('returns null for corrupted JSON', () => {
    localStorage.setItem('bad-key', '{not valid json')

    expect(loadSession('bad-key')).toBeNull()
  })
})

describe('useSessionPersistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function mountWithPersistence(state: { key: string | null; snapshot: SessionSnapshot }) {
    const TestComponent = defineComponent({
      setup() {
        useSessionPersistence(
          () => state.key,
          () => state.snapshot,
        )
        return () => h('div')
      },
    })
    return mount(TestComponent)
  }

  it('saves to localStorage when the snapshot changes and a key is set', async () => {
    const state = reactive({
      key: 'crom:clip.mp4:1024:1700000000000' as string | null,
      snapshot: { video: null, subjects: [], intervals: {} } as SessionSnapshot,
    })
    mountWithPersistence(state)

    state.snapshot.subjects.push({ id: 'a1', label: 'Grooming', key: 'g' })
    await nextTick()

    expect(loadSession(state.key as string)).toEqual(state.snapshot)
  })

  it('does not save while the key is null', async () => {
    const state = reactive({
      key: null as string | null,
      snapshot: { video: null, subjects: [], intervals: {} } as SessionSnapshot,
    })
    mountWithPersistence(state)

    state.snapshot.subjects.push({ id: 'a1', label: 'Grooming', key: 'g' })
    await nextTick()

    expect(localStorage.length).toBe(0)
  })
})
