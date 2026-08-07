import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import App from './App.vue'

describe('App', () => {
  it('renders the croM heading', () => {
    const wrapper = mount(App)

    expect(wrapper.text()).toContain('croM')
  })
})
