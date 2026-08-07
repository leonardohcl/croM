import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionTable from './SessionTable.vue'

const meta: Meta<typeof SessionTable> = {
  title: 'Organisms/SessionTable',
  component: SessionTable,
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
type Story = StoryObj<typeof SessionTable>

/** A per-subject table of recorded intervals with running totals. */
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

/** No subjects yet. */
export const Empty: Story = {
  args: {
    duration: 180,
    entries: [],
  },
}
