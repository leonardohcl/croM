import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SubjectRow from './SubjectRow.vue'

const subject = { id: 'a1', label: 'Grooming', key: 'g' }

describe('SubjectRow', () => {
  it('emits toggle when the toggle button is clicked', async () => {
    const wrapper = mount(SubjectRow, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('renders the subject label and key', () => {
    const wrapper = mount(SubjectRow, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    expect(wrapper.text()).toContain('Grooming')
    expect(wrapper.text()).toContain('g')
  })
})
