import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionTable from './SessionTable.vue'

const entries = [
  {
    subject: { id: 'a1', label: 'Grooming', key: 'g' },
    intervals: [{ start: 10, end: 40 }],
  },
  {
    subject: { id: 'a2', label: 'Feeding', key: 'f' },
    intervals: [{ start: 5, end: null }],
  },
]

describe('SessionTable', () => {
  it('renders a table per subject', () => {
    const wrapper = mount(SessionTable, { props: { entries, duration: 100 } })

    expect(wrapper.findAll('.session-table__title').map((title) => title.text())).toEqual([
      'Grooming',
      'Feeding',
    ])
  })

  it('shows a placeholder when there are no subjects', () => {
    const wrapper = mount(SessionTable, { props: { entries: [], duration: 100 } })

    expect(wrapper.text()).toContain('No subjects yet.')
  })
})
