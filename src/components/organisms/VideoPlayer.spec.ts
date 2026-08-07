import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import VideoPlayer from './VideoPlayer.vue'

interface Exposed {
  getCurrentTime: () => number
}

function createFile(name = 'clip.mp4'): File {
  return new File(['fake video content'], name, { type: 'video/mp4' })
}

describe('VideoPlayer', () => {
  it('emits fileSelected with the chosen file', async () => {
    const wrapper = mount(VideoPlayer)
    const file = createFile()
    const input = wrapper.get('input[type="file"]')

    Object.defineProperty(input.element, 'files', { value: [file] })
    await input.trigger('change')

    expect(wrapper.emitted('fileSelected')?.[0]?.[0]).toBe(file)
  })

  it('does not emit fileSelected when the file input has no file', async () => {
    const wrapper = mount(VideoPlayer)
    const input = wrapper.get('input[type="file"]')

    Object.defineProperty(input.element, 'files', { value: [] })
    await input.trigger('change')

    expect(wrapper.emitted('fileSelected')).toBeUndefined()
  })

  it('exposes getCurrentTime, defaulting to 0 before a video is loaded', () => {
    const wrapper = mount(VideoPlayer)

    expect((wrapper.vm as unknown as Exposed).getCurrentTime()).toBe(0)
  })
})
