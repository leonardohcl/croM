import type { Meta, StoryObj } from '@storybook/vue3-vite'
import IntervalTable from './IntervalTable.vue'

const meta: Meta<typeof IntervalTable> = {
  title: 'Organisms/IntervalTable',
  component: IntervalTable,
  tags: ['autodocs'],
  argTypes: {
    intervals: {
      description: "Recorded intervals for this subject, in seconds. An interval with `end: null` is still open.",
      control: 'object',
    },
    duration: {
      description: 'Total video duration, in seconds. Only used when `openEndsAtDuration` is true.',
      control: 'number',
    },
    openEndsAtDuration: {
      description:
        "When true, an open interval's end/duration are computed as if it ran until `duration`, instead of showing a placeholder.",
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
type Story = StoryObj<typeof IntervalTable>

/** No intervals recorded yet. */
export const Empty: Story = {
  args: { intervals: [] },
}

/** Several closed intervals plus a currently open one, shown as unresolved ("—"). */
export const MixedIntervals: Story = {
  args: {
    intervals: [
      { start: 5, end: 15 },
      { start: 30, end: 40 },
      { start: 90, end: null },
    ],
  },
}

/** The open interval's end/duration are computed as running until the video's end. */
export const OpenIntervalEndsAtDuration: Story = {
  args: {
    intervals: [
      { start: 5, end: 15 },
      { start: 90, end: null },
    ],
    duration: 180,
    openEndsAtDuration: true,
  },
}
