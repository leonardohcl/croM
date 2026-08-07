import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppToolbar from './AppToolbar.vue'

describe('AppToolbar', () => {
  it('emits saveHistory when the save-to-history button is clicked', async () => {
    const wrapper = mount(AppToolbar)
    const button = wrapper.findAll('button').find((btn) => btn.text() === 'Save to history')

    await button?.trigger('click')

    expect(wrapper.emitted('saveHistory')).toHaveLength(1)
  })

  it('emits update:autoSaveHistory when the auto-save switch is toggled', async () => {
    const wrapper = mount(AppToolbar, { props: { autoSaveHistory: false } })

    await wrapper.get('.n-switch').trigger('click')

    expect(wrapper.emitted('update:autoSaveHistory')).toEqual([[true]])
  })

  it('disables the save-to-history button and switch when disabled', () => {
    const wrapper = mount(AppToolbar, { props: { disabled: true } })
    const button = wrapper.findAll('button').find((btn) => btn.text() === 'Save to history')

    expect(button?.attributes('disabled')).toBeDefined()
    expect(wrapper.get('.n-switch').classes()).toContain('n-switch--disabled')
  })
})
