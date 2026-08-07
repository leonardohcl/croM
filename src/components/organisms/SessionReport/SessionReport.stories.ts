import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionReport from './SessionReport.vue'

const meta: Meta<typeof SessionReport> = {
  title: 'Organisms/SessionReport',
  component: SessionReport,
  tags: ['autodocs'],
  argTypes: {
    entries: {
      description: 'One entry per subject, with its recorded intervals.',
      control: 'object',
    },
    duration: {
      description: 'Total video duration, in seconds.',
      control: 'number',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 480px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof SessionReport>

/** A log of trigger/release events across subjects, plus a per-subject table tab. */
export const Default: Story = {
  args: {
    duration: 180,
    entries: [
      {
        subject: { id: 'a1', label: 'Grooming', key: 'g' },
        intervals: [{ start: 10, end: 40 }],
      },
      {
        subject: { id: 'a2', label: 'Feeding', key: 'f' },
        intervals: [{ start: 100, end: null }],
      },
    ],
  },
}

/** No activity recorded yet. */
export const Empty: Story = {
  args: {
    duration: 180,
    entries: [],
  },
}
