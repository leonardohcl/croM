import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionLog from './SessionLog.vue'

const meta: Meta<typeof SessionLog> = {
  title: 'Organisms/SessionLog',
  component: SessionLog,
  tags: ['autodocs'],
  argTypes: {
    entries: {
      description: 'One entry per subject, with its recorded intervals.',
      control: 'object',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 480px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof SessionLog>

/** A chronological log of trigger/release events across subjects. */
export const Default: Story = {
  args: {
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
    entries: [],
  },
}
