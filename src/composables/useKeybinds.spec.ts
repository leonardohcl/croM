import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useKeybinds } from './useKeybinds'
import type { Subject } from '@/types'

const subjects: Subject[] = [
  { id: 'a1', label: 'Grooming', key: 'g' },
  { id: 'a2', label: 'Feeding', key: 'f' },
]

function mountWithKeybinds(onToggle: (subjectId: string) => void) {
  const TestComponent = defineComponent({
    setup() {
      useKeybinds(() => subjects, onToggle)
      return () => h('div')
    },
  })
  return mount(TestComponent)
}

describe('useKeybinds', () => {
  it('calls onToggle with the matching subject id when its key is pressed', () => {
    const onToggle = vi.fn()
    mountWithKeybinds(onToggle)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))

    expect(onToggle).toHaveBeenCalledWith('a1')
  })

  it('does not call onToggle for an unbound key', () => {
    const onToggle = vi.fn()
    mountWithKeybinds(onToggle)

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x' }))

    expect(onToggle).not.toHaveBeenCalled()
  })

  it('ignores keydown events originating from a text input', () => {
    const onToggle = vi.fn()
    mountWithKeybinds(onToggle)

    const input = document.createElement('input')
    document.body.appendChild(input)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }))
    document.body.removeChild(input)

    expect(onToggle).not.toHaveBeenCalled()
  })

  it('stops listening after the component unmounts', () => {
    const onToggle = vi.fn()
    const wrapper = mountWithKeybinds(onToggle)
    wrapper.unmount()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'g' }))

    expect(onToggle).not.toHaveBeenCalled()
  })
})
