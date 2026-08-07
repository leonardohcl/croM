import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SubjectCard from './SubjectCard.vue'

const subject = { id: 'a1', label: 'Grooming', key: 'g' }

describe('SubjectCard', () => {
  it('emits toggle when the toggle button is clicked', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.toggle-button').trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('emits remove when the remove button is clicked', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('renders the subject label and key', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    expect(wrapper.text()).toContain('Grooming')
    expect(wrapper.text()).toContain('g')
  })

  it('excludes the open interval from the timeline until it closes', () => {
    const wrapper = mount(SubjectCard, {
      props: {
        subject,
        intervals: [
          { start: 10, end: 40 },
          { start: 100, end: null },
        ],
        duration: 180,
        active: true,
      },
    })

    expect(wrapper.findAll('.timeline-segment')).toHaveLength(1)
  })
})
