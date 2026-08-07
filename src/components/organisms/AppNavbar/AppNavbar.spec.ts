import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import AppNavbar from './AppNavbar.vue'

describe('AppNavbar', () => {
  it('highlights the active page', () => {
    const wrapper = mount(AppNavbar, { props: { active: 'history' } })
    const links = wrapper.findAll('.app-navbar__link')

    expect(links[0].classes()).not.toContain('app-navbar__link--active')
    expect(links[1].classes()).toContain('app-navbar__link--active')
    expect(links[2].classes()).not.toContain('app-navbar__link--active')
  })

  it('emits navigate with the clicked page', async () => {
    const wrapper = mount(AppNavbar, { props: { active: 'session' } })

    await wrapper.findAll('.app-navbar__link')[1].trigger('click')

    expect(wrapper.emitted('navigate')).toEqual([['history']])
  })

  it('emits navigate with load when the Load JSON link is clicked', async () => {
    const wrapper = mount(AppNavbar, { props: { active: 'session' } })

    await wrapper.findAll('.app-navbar__link')[2].trigger('click')

    expect(wrapper.emitted('navigate')).toEqual([['load']])
  })

  it('emits newSession when the New session button is clicked', async () => {
    const wrapper = mount(AppNavbar, { props: { active: 'history' } })

    await wrapper.get('button').trigger('click')

    expect(wrapper.emitted('newSession')).toHaveLength(1)
  })

  it('emits openHowToUse when the How to use link is clicked', async () => {
    const wrapper = mount(AppNavbar, { props: { active: 'session' } })

    await wrapper.findAll('.app-navbar__link')[3].trigger('click')

    expect(wrapper.emitted('openHowToUse')).toHaveLength(1)
  })

  it('emits openAbout when the About link is clicked', async () => {
    const wrapper = mount(AppNavbar, { props: { active: 'session' } })

    await wrapper.findAll('.app-navbar__link')[4].trigger('click')

    expect(wrapper.emitted('openAbout')).toHaveLength(1)
  })
})
