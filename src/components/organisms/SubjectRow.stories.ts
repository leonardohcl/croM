import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SubjectRow from './SubjectRow.vue'

const meta: Meta<typeof SubjectRow> = {
  title: 'Organisms/SubjectRow',
  component: SubjectRow,
  tags: ['autodocs'],
  argTypes: {
    subject: {
      description: 'The subject/timer this row represents.',
      control: 'object',
    },
    intervals: {
      description: 'Recorded intervals for this subject, in seconds.',
      control: 'object',
    },
    duration: {
      description: 'Total video duration, in seconds.',
      control: 'number',
    },
    active: {
      description: 'Whether this subject currently has an open interval.',
      control: 'boolean',
    },
    onToggle: {
      description: 'Fired when the toggle button is clicked.',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 480px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof SubjectRow>

/** No open interval — the toggle button is in its default, inactive state. */
export const Inactive: Story = {
  args: {
    subject: { id: 'a1', label: 'Grooming', key: 'g' },
    intervals: [{ start: 10, end: 40 }],
    duration: 180,
    active: false,
  },
}

/** An interval is currently open — the toggle button is styled to stand out. */
export const Active: Story = {
  args: {
    subject: { id: 'a1', label: 'Grooming', key: 'g' },
    intervals: [
      { start: 10, end: 40 },
      { start: 100, end: null },
    ],
    duration: 180,
    active: true,
  },
}
