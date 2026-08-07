import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SubjectCard from './SubjectCard.vue'

const meta: Meta<typeof SubjectCard> = {
  title: 'Organisms/SubjectCard',
  component: SubjectCard,
  tags: ['autodocs'],
  argTypes: {
    subject: {
      description: 'The subject/timer this card represents.',
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
    disabled: {
      description: "Disables the toggle button, e.g. while the video isn't playing.",
      control: 'boolean',
    },
    onToggle: {
      description: 'Fired when the toggle button is clicked.',
    },
    onRemove: {
      description: 'Fired when the remove button is clicked.',
    },
  },
  decorators: [
    () => ({
      template: '<div style="width: 320px;"><story /></div>',
    }),
  ],
}

export default meta
type Story = StoryObj<typeof SubjectCard>

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

/** Disabled while the video isn't playing — the toggle button can't be clicked. */
export const Disabled: Story = {
  args: {
    subject: { id: 'a1', label: 'Grooming', key: 'g' },
    intervals: [{ start: 10, end: 40 }],
    duration: 180,
    active: false,
    disabled: true,
  },
}
