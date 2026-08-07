import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import App from './App.vue'

describe('App', () => {
  it('renders the croM heading', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [PrimeVue],
      },
    })

    expect(wrapper.text()).toContain('croM')
  })
})
