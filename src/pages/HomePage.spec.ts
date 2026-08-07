import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DOMWrapper, mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createTestingPinia } from '@pinia/testing'
import HomePage from './HomePage.vue'
import { useSessionStore } from '@/stores/session'
import { listSessionHistory } from '@/utils/sessionHistory'

function mountHomePage() {
  const pinia = createTestingPinia({ createSpy: vi.fn, stubActions: false })
  const wrapper = mount(HomePage, { global: { plugins: [pinia] } })
  const store = useSessionStore(pinia)
  return { wrapper, store }
}

async function loadVideo(wrapper: ReturnType<typeof mount>) {
  const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' })
  const input = wrapper.get('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: [file] })
  await input.trigger('change')
  await wrapper.get('video').trigger('play')
  await nextTick()
}

describe('HomePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('seeds 4 default subjects with keys 1-4 on mount', () => {
    const { store } = mountHomePage()

    expect(store.subjects.map((subject) => subject.key)).toEqual(['1', '2', '3', '4'])
  })

  it('adds a subject through the form card and shows it among the subject cards', async () => {
    const { wrapper } = mountHomePage()
    const addButton = wrapper.findAll('button').find((button) => button.text() === '+ Add subject')
    await addButton?.trigger('click')
    await nextTick()

    await new DOMWrapper(document.body.querySelector('input[placeholder="e.g. Grooming"]')!).setValue('Grooming')
    await new DOMWrapper(document.body.querySelector('input[placeholder="Key"]')!).setValue('g')
    await new DOMWrapper(document.body.querySelector('form')!).trigger('submit')

    expect(wrapper.text()).toContain('Grooming')
  })

  it('removes a subject when its card remove button is clicked', async () => {
    const { wrapper, store } = mountHomePage()
    const [firstSubject] = store.subjects
    await nextTick()

    const removeButtons = wrapper.findAll('.subject-card__remove')
    await removeButtons[0]?.trigger('click')

    expect(store.subjects.find((subject) => subject.id === firstSubject.id)).toBeUndefined()
  })

  it('does not toggle a subject via its bound key while the video is not playing', () => {
    const { store } = mountHomePage()
    const [subject] = store.subjects

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))

    expect(store.isActive(subject.id)).toBe(false)
  })

  it('toggles a subject via its bound key once the video is playing', async () => {
    const { wrapper, store } = mountHomePage()
    await loadVideo(wrapper)
    const subject = store.subjects.find((candidate) => candidate.key === '1')!

    window.dispatchEvent(new KeyboardEvent('keydown', { key: '1' }))

    expect(store.isActive(subject.id)).toBe(true)
  })

  it('sets the video in the store when a file is selected', async () => {
    const { wrapper, store } = mountHomePage()
    const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    expect(store.video?.name).toBe('clip.mp4')
  })

  it('resets the store and reseeds default subjects when the toolbar reset action fires', async () => {
    const { wrapper, store } = mountHomePage()
    store.setVideo({ name: 'clip.mp4', size: 1, lastModified: 1, duration: 10 })
    await nextTick()

    const resetButton = wrapper.findAll('button').find((button) => button.text() === 'Reset')
    await resetButton?.trigger('click')

    expect(store.video).toBeNull()
    expect(store.subjects.map((subject) => subject.key)).toEqual(['1', '2', '3', '4'])
  })

  it('saves the current session to history when Save to history is clicked', async () => {
    const { wrapper } = mountHomePage()
    const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    const saveButton = wrapper.findAll('button').find((button) => button.text() === 'Save to history')
    await saveButton?.trigger('click')

    const history = listSessionHistory()
    expect(history).toHaveLength(1)
    expect(history[0].snapshot.video?.name).toBe('clip.mp4')
  })

  it('updates the same history entry on repeated manual saves instead of duplicating it', async () => {
    const { wrapper, store } = mountHomePage()
    const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    const saveButton = wrapper.findAll('button').find((button) => button.text() === 'Save to history')
    await saveButton?.trigger('click')
    store.addSubject('Grooming', 'g')
    await saveButton?.trigger('click')

    expect(listSessionHistory()).toHaveLength(1)
  })

  it('starts a new history entry once a new video replaces the current session', async () => {
    const { wrapper } = mountHomePage()
    const saveButton = () => wrapper.findAll('button').find((button) => button.text() === 'Save to history')

    const firstFile = new File(['data'], 'clip-1.mp4', { type: 'video/mp4' })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [firstFile], configurable: true })
    await input.trigger('change')
    await saveButton()?.trigger('click')

    const secondFile = new File(['data'], 'clip-2.mp4', { type: 'video/mp4' })
    Object.defineProperty(input.element, 'files', { value: [secondFile], configurable: true })
    await input.trigger('change')
    await saveButton()?.trigger('click')

    expect(listSessionHistory()).toHaveLength(2)
  })

  it('auto-saves to history on every change once the auto-save toggle is enabled', async () => {
    const { wrapper, store } = mountHomePage()
    const file = new File(['data'], 'clip.mp4', { type: 'video/mp4' })
    const input = wrapper.get('input[type="file"]')
    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    await wrapper.get('.n-switch').trigger('click')
    store.addSubject('Grooming', 'g')
    await nextTick()

    const history = listSessionHistory()
    expect(history).toHaveLength(1)
    expect(history[0].snapshot.subjects.map((subject) => subject.label)).toContain('Grooming')
  })

  it('does not save to history when no video is loaded', async () => {
    const { wrapper } = mountHomePage()

    const saveButton = wrapper.findAll('button').find((button) => button.text() === 'Save to history')
    await saveButton?.trigger('click')

    expect(listSessionHistory()).toEqual([])
  })
})
