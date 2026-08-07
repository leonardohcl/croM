import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionSnapshotView from './SessionSnapshotView.vue'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
  intervals: { a1: [{ start: 0, end: 10 }] },
}

describe('SessionSnapshotView', () => {
  it('renders the subject read-only', () => {
    const wrapper = mount(SessionSnapshotView, { props: { snapshot } })

    expect(wrapper.text()).toContain('Grooming')
    expect(wrapper.find('button.subject-card__edit').exists()).toBe(false)
    expect(wrapper.find('button.subject-card__remove').exists()).toBe(false)
  })

  it('renders no subject cards when there is no snapshot', () => {
    const wrapper = mount(SessionSnapshotView, { props: { snapshot: null } })

    expect(wrapper.find('.subject-card').exists()).toBe(false)
  })
})
