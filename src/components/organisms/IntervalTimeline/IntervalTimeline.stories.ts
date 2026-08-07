import type { Meta, StoryObj } from '@storybook/vue3-vite'
import IntervalTimeline from './IntervalTimeline.vue'

const meta: Meta<typeof IntervalTimeline> = {
  title: 'Organisms/IntervalTimeline',
  component: IntervalTimeline,
  tags: ['autodocs'],
  argTypes: {
    duration: {
      description: "Total duration of the video, in seconds. Used to convert interval times to percentages.",
      control: 'number',
    },
    intervals: {
      description: "Recorded intervals for this subject, in seconds. An interval with `end: null` is still open.",
      control: 'object',
    },
    tickCount: {
      description: 'Number of tick marks to render along the timeline, evenly spaced (including both ends).',
      control: 'number',
    },
    active: {
      description: 'Whether this subject currently has an open interval. Overlays a pulsing "Recording" label.',
      control: 'boolean',
    },
    compact: {
      description: 'Renders a thinner track with no ticks or text — just the colored intervals.',
      control: 'boolean',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 480px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof IntervalTimeline>

/** No intervals have been recorded yet — an empty track with only tick marks. */
export const NoIntervals: Story = {
  args: { duration: 180, intervals: [] },
}

/** A single interval that was opened and closed. */
export const OneClosedInterval: Story = {
  args: { duration: 180, intervals: [{ start: 40, end: 95 }] },
}

/** A single interval still open — no end recorded yet, styled distinctly. */
export const OneOpenInterval: Story = {
  args: { duration: 180, intervals: [{ start: 120, end: null }] },
}

/** Actively recording — a softly pulsing "Recording" label overlays the track. */
export const Active: Story = {
  args: { duration: 180, intervals: [{ start: 120, end: null }], active: true },
}

/** Compact mode, used on collapsed subject cards — thinner track, no ticks or text. */
export const Compact: Story = {
  args: {
    duration: 180,
    intervals: [
      { start: 40, end: 95 },
      { start: 120, end: null },
    ],
    active: true,
    compact: true,
  },
}

/** Many intervals close together, so tick labels risk overlapping. */
export const ManyIntervals: Story = {
  args: {
    duration: 180,
    tickCount: 9,
    intervals: [
      { start: 5, end: 15 },
      { start: 20, end: 28 },
      { start: 30, end: 40 },
      { start: 60, end: 65 },
      { start: 100, end: 130 },
      { start: 150, end: null },
    ],
  },
}
