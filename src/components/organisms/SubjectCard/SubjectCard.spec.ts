import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import SubjectCard from './SubjectCard.vue'

const subject = { id: 'a1', label: 'Grooming', key: 'g' }

function findBodyButtonByText(text: string) {
  return Array.from(document.body.querySelectorAll('button')).find((button) => button.textContent?.trim() === text)
}

describe('SubjectCard', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('emits toggle when the toggle button is clicked', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.toggle-button').trigger('click')

    expect(wrapper.emitted('toggle')).toHaveLength(1)
  })

  it('emits remove immediately when the subject has no recorded intervals', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('asks for confirmation before removing a subject with recorded intervals', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [{ start: 0, end: 10 }], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
    expect(findBodyButtonByText('Remove')).toBeDefined()
  })

  it('emits remove once the confirmation dialog is accepted', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [{ start: 0, end: 10 }], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')
    findBodyButtonByText('Remove')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('does not emit remove if the confirmation dialog is cancelled', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [{ start: 0, end: 10 }], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')
    findBodyButtonByText('Cancel')?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()

    expect(wrapper.emitted('remove')).toBeUndefined()
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

  it('renders the description when present, once expanded', async () => {
    const wrapper = mount(SubjectCard, {
      props: {
        subject: { ...subject, description: 'Self-directed grooming behavior' },
        intervals: [],
        duration: 100,
        active: false,
      },
    })

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.text()).toContain('Self-directed grooming behavior')
  })

  it('omits the description paragraph when none is set', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    expect(wrapper.find('.subject-card__description').exists()).toBe(false)
  })

  it('emits edit with the trimmed label and description on save', async () => {
    const wrapper = mount(SubjectCard, {
      props: {
        subject: { ...subject, description: 'Old description' },
        intervals: [],
        duration: 100,
        active: false,
      },
    })

    await wrapper.get('button.subject-card__edit').trigger('click')
    await wrapper.get('.subject-card__edit-label input').setValue('  Self-grooming  ')
    await wrapper.get('.subject-card__edit-description textarea').setValue('  New description  ')
    await wrapper.get('button.subject-card__save').trigger('click')

    expect(wrapper.emitted('edit')).toEqual([[{ label: 'Self-grooming', description: 'New description' }]])
    expect(wrapper.find('.subject-card__edit-label').exists()).toBe(false)
  })

  it('discards changes when the edit is cancelled', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__edit').trigger('click')
    await wrapper.get('.subject-card__edit-label input').setValue('Renamed')
    await wrapper.get('button.subject-card__cancel').trigger('click')

    expect(wrapper.emitted('edit')).toBeUndefined()
    expect(wrapper.text()).toContain('Grooming')
  })

  it('disables saving while the edited label is blank', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__edit').trigger('click')
    await wrapper.get('.subject-card__edit-label input').setValue('   ')

    expect(wrapper.get('button.subject-card__save').attributes('disabled')).toBeDefined()
  })

  it('disables the edit and remove buttons while the video is playing', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false, playing: true },
    })

    expect(wrapper.get('button.subject-card__edit').attributes('disabled')).toBeDefined()
    expect(wrapper.get('button.subject-card__remove').attributes('disabled')).toBeDefined()
  })

  it('does not emit remove when clicked while disabled by playback', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false, playing: true },
    })

    await wrapper.get('button.subject-card__remove').trigger('click')

    expect(wrapper.emitted('remove')).toBeUndefined()
  })

  it('starts collapsed, showing the edit/remove buttons and a compact timeline', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    expect(wrapper.find('.subject-card--collapsed').exists()).toBe(true)
    expect(wrapper.find('button.subject-card__edit').exists()).toBe(true)
    expect(wrapper.find('button.subject-card__remove').exists()).toBe(true)
    expect(wrapper.find('.timeline-tick').exists()).toBe(false)
  })

  it('expands to show the description and a full timeline, keeping edit/remove available', async () => {
    const wrapper = mount(SubjectCard, {
      props: {
        subject: { ...subject, description: 'Self-directed grooming behavior' },
        intervals: [],
        duration: 100,
        active: false,
      },
    })

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.find('.subject-card--collapsed').exists()).toBe(false)
    expect(wrapper.find('button.subject-card__edit').exists()).toBe(true)
    expect(wrapper.find('button.subject-card__remove').exists()).toBe(true)
    expect(wrapper.find('.subject-card__description').exists()).toBe(true)
    expect(wrapper.text()).toContain('Grooming')
    expect(wrapper.find('.timeline-tick').exists()).toBe(true)
  })

  it('expands the card when the edit button is clicked while collapsed', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    expect(wrapper.find('.subject-card--collapsed').exists()).toBe(true)

    await wrapper.get('button.subject-card__edit').trigger('click')

    expect(wrapper.find('.subject-card--collapsed').exists()).toBe(false)
    expect(wrapper.find('.subject-card__edit-label').exists()).toBe(true)
  })

  it('discards an in-progress edit when the card is collapsed', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__edit').trigger('click')
    await wrapper.get('.subject-card__edit-label input').setValue('Renamed')

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.emitted('edit')).toBeUndefined()

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.find('.subject-card__edit-label').exists()).toBe(false)
    expect(wrapper.text()).toContain('Grooming')
  })

  it('collapses again when the expand toggle is clicked twice', async () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false },
    })

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')
    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.find('.subject-card--collapsed').exists()).toBe(true)
    expect(wrapper.find('button.subject-card__edit').exists()).toBe(true)
  })

  it('disables the expand toggle while the video is playing', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false, playing: true },
    })

    expect(wrapper.get('button.subject-card__expand-toggle').attributes('disabled')).toBeDefined()
  })

  it('hides the edit and remove buttons when readonly', () => {
    const wrapper = mount(SubjectCard, {
      props: { subject, intervals: [], duration: 100, active: false, readonly: true },
    })

    expect(wrapper.find('button.subject-card__edit').exists()).toBe(false)
    expect(wrapper.find('button.subject-card__remove').exists()).toBe(false)
  })

  it('still allows expanding a readonly card', async () => {
    const wrapper = mount(SubjectCard, {
      props: {
        subject: { ...subject, description: 'Self-directed grooming behavior' },
        intervals: [],
        duration: 100,
        active: false,
        readonly: true,
      },
    })

    await wrapper.get('button.subject-card__expand-toggle').trigger('click')

    expect(wrapper.text()).toContain('Self-directed grooming behavior')
  })
})
