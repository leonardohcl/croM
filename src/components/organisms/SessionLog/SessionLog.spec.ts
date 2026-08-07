import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionLog from './SessionLog.vue'

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

describe('SessionLog', () => {
  it('lists trigger and release events in chronological order', () => {
    const wrapper = mount(SessionLog, { props: { entries } })

    const items = wrapper.findAll('li').map((item) => item.text())
    expect(items).toEqual([
      'Feeding was triggered at 00:05',
      'Grooming was triggered at 00:10',
      'Grooming was released at 00:40',
    ])
  })

  it('shows a placeholder when there is no activity yet', () => {
    const wrapper = mount(SessionLog, { props: { entries: [] } })

    expect(wrapper.text()).toContain('No activity recorded yet.')
  })
})
