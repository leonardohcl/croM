import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import LoadJsonPage from './LoadJsonPage.vue'
import { toJson } from '@/utils/json'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
  intervals: { a1: [{ start: 0, end: 10 }] },
}

async function selectFile(wrapper: ReturnType<typeof mount>, file: File) {
  const input = wrapper.get('input[type="file"]')
  Object.defineProperty(input.element, 'files', { value: [file] })
  await input.trigger('change')
}

describe('LoadJsonPage', () => {
  it('shows an empty state before a file is loaded', () => {
    const wrapper = mount(LoadJsonPage)

    expect(wrapper.text()).toContain('No session loaded yet.')
  })

  it('shows the session read-only after loading a valid session JSON file', async () => {
    const wrapper = mount(LoadJsonPage)
    const file = new File([toJson(snapshot)], 'clip.json', { type: 'application/json' })

    await selectFile(wrapper, file)
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.text()).toContain('clip.mp4')
    expect(wrapper.text()).toContain('Grooming')
  })

  it('shows an error when the file is not a valid session', async () => {
    const wrapper = mount(LoadJsonPage)
    const file = new File(['not json'], 'notes.json', { type: 'application/json' })

    await selectFile(wrapper, file)
    await new Promise((resolve) => setTimeout(resolve))

    expect(wrapper.text()).toContain('Couldn\'t read "notes.json" as a session file.')
  })
})
