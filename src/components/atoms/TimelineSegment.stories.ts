import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TimelineSegment from './TimelineSegment.vue'

const meta: Meta<typeof TimelineSegment> = {
  title: 'Atoms/TimelineSegment',
  component: TimelineSegment,
  tags: ['autodocs'],
  argTypes: {
    intervals: {
      description: 'Intervals to paint on this track, in any order.',
      control: 'object',
    },
  },
  decorators: [
    () => ({
      template: '<div style="position: relative; width: 320px; height: 24px; background: #e5e7eb;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof TimelineSegment>

/** No intervals recorded yet — an empty track. */
export const Empty: Story = {
  args: { intervals: [] },
}

/** A single closed interval — both a start and an end were recorded. */
export const SingleClosed: Story = {
  args: { intervals: [{ startPercent: 20, widthPercent: 30, open: false }] },
}

/** An interval still in progress, styled distinctly from closed ones. */
export const SingleOpen: Story = {
  args: { intervals: [{ startPercent: 60, widthPercent: 40, open: true }] },
}

/** Several closed intervals plus a currently open one, all painted on the same track. */
export const Multiple: Story = {
  args: {
    intervals: [
      { startPercent: 5, widthPercent: 15, open: false },
      { startPercent: 30, widthPercent: 10, open: false },
      { startPercent: 55, widthPercent: 20, open: false },
      { startPercent: 85, widthPercent: 15, open: true },
    ],
  },
}
