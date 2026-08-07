import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import IntervalTimeline from './IntervalTimeline.vue'

describe('IntervalTimeline', () => {
  it('renders no segments when there are no intervals', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [] },
    })

    expect(wrapper.findAll('.timeline-segment')).toHaveLength(0)
  })

  it('positions a closed interval as a percentage of the total duration', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [{ start: 20, end: 50 }] },
    })

    const segment = wrapper.get('.timeline-segment')
    expect(segment.attributes('style')).toContain('left: 20%')
    expect(segment.attributes('style')).toContain('width: 30%')
    expect(segment.classes()).not.toContain('timeline-segment--open')
  })

  it('renders an open interval up to the full duration and marks it open', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [{ start: 60, end: null }] },
    })

    const segment = wrapper.get('.timeline-segment')
    expect(segment.attributes('style')).toContain('left: 60%')
    expect(segment.attributes('style')).toContain('width: 40%')
    expect(segment.classes()).toContain('timeline-segment--open')
  })

  it('renders one segment per interval', () => {
    const wrapper = mount(IntervalTimeline, {
      props: {
        duration: 100,
        intervals: [
          { start: 0, end: 10 },
          { start: 20, end: 30 },
          { start: 90, end: null },
        ],
      },
    })

    expect(wrapper.findAll('.timeline-segment')).toHaveLength(3)
  })

  it('renders the requested number of evenly spaced ticks', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [], tickCount: 5 },
    })

    const ticks = wrapper.findAll('.timeline-tick')
    expect(ticks).toHaveLength(5)
    expect(ticks[0]?.attributes('style')).toContain('left: 0%')
    expect(ticks[4]?.attributes('style')).toContain('left: 100%')
  })

  it('defaults to 5 ticks when tickCount is not provided', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 60, intervals: [] },
    })

    expect(wrapper.findAll('.timeline-tick')).toHaveLength(5)
  })

  it('shows the recording label while active', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [{ start: 60, end: null }], active: true },
    })

    expect(wrapper.find('.interval-timeline__active-label').exists()).toBe(true)
  })

  it('hides the recording label when not active', () => {
    const wrapper = mount(IntervalTimeline, {
      props: { duration: 100, intervals: [], active: false },
    })

    expect(wrapper.find('.interval-timeline__active-label').exists()).toBe(false)
  })

  it('omits ticks and the recording label in compact mode, but keeps segments', () => {
    const wrapper = mount(IntervalTimeline, {
      props: {
        duration: 100,
        intervals: [{ start: 60, end: null }],
        active: true,
        compact: true,
      },
    })

    expect(wrapper.findAll('.timeline-tick')).toHaveLength(0)
    expect(wrapper.find('.interval-timeline__active-label').exists()).toBe(false)
    expect(wrapper.findAll('.timeline-segment')).toHaveLength(1)
  })
})
