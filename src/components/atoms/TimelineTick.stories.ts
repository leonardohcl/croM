import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TimelineTick from './TimelineTick.vue'

const meta: Meta<typeof TimelineTick> = {
  title: 'Atoms/TimelineTick',
  component: TimelineTick,
  tags: ['autodocs'],
  argTypes: {
    offsetPercent: {
      description: 'Horizontal position along the timeline, as a percentage (0-100) of its width.',
      control: { type: 'range', min: 0, max: 100 },
    },
    label: {
      description: 'Formatted timestamp text shown below the tick, e.g. "01:23".',
      control: 'text',
    },
  },
  decorators: [
    () => ({
      template: '<div style="position: relative; width: 320px; height: 2px; background: #d1d5db; margin-top: 2rem;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof TimelineTick>

/** A tick near the start of the timeline. */
export const Start: Story = {
  args: { offsetPercent: 5, label: '00:00' },
}

/** A tick in the middle of the timeline. */
export const Middle: Story = {
  args: { offsetPercent: 50, label: '01:23' },
}

/** A tick near the end of the timeline, where the label could overflow the track. */
export const End: Story = {
  args: { offsetPercent: 95, label: '02:59' },
}
