import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SessionReport from './SessionReport.vue'

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

describe('SessionReport', () => {
  it('lists trigger and release events in chronological order', () => {
    const wrapper = mount(SessionReport, { props: { entries, duration: 100 } })

    const items = wrapper.findAll('.session-report__log li').map((item) => item.text())
    expect(items).toEqual([
      'Feeding was triggered at 00:05',
      'Grooming was triggered at 00:10',
      'Grooming was released at 00:40',
    ])
  })

  it('shows a placeholder when there is no activity yet', () => {
    const wrapper = mount(SessionReport, { props: { entries: [], duration: 100 } })

    expect(wrapper.text()).toContain('No activity recorded yet.')
  })

  it('renders a table per subject in the Table tab', async () => {
    const wrapper = mount(SessionReport, { props: { entries, duration: 100 } })

    const tableTab = wrapper.findAll('.n-tabs-tab').find((tab) => tab.text() === 'Table')
    await tableTab?.trigger('click')
    await nextTick()

    expect(wrapper.findAll('.session-report__table-title').map((title) => title.text())).toEqual([
      'Grooming',
      'Feeding',
    ])
  })
})
