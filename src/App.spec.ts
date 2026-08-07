import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import App from './App.vue'

describe('App', () => {
  it('renders the croM heading', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('croM')
  })
})
