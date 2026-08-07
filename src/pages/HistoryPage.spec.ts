import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HistoryPage from './HistoryPage.vue'
import { upsertSessionHistoryEntry } from '@/utils/sessionHistory'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [
    { id: 'a1', label: 'Grooming', key: 'g' },
    { id: 'a2', label: 'Feeding', key: 'f' },
  ],
  intervals: { a1: [{ start: 0, end: 10 }], a2: [] },
}

describe('HistoryPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('shows an empty state when no sessions are saved', () => {
    const wrapper = mount(HistoryPage)

    expect(wrapper.text()).toContain('No sessions saved yet.')
  })

  it('lists a saved session with the video name and subject count', () => {
    upsertSessionHistoryEntry('s1', snapshot)

    const wrapper = mount(HistoryPage)

    expect(wrapper.text()).toContain('clip.mp4')
    expect(wrapper.text()).toContain('2 subjects')
  })

  it('opens the read-only view modal with the session contents when View is clicked', async () => {
    upsertSessionHistoryEntry('s1', snapshot)
    const wrapper = mount(HistoryPage, { attachTo: document.body })

    const viewButton = wrapper.findAll('button').find((button) => button.text() === 'View')
    await viewButton?.trigger('click')

    expect(document.body.textContent).toContain('Grooming')
    expect(document.body.textContent).toContain('Feeding')
  })
})
