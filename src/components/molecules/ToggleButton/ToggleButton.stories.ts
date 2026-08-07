import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ToggleButton from './ToggleButton.vue'

const meta: Meta<typeof ToggleButton> = {
  title: 'Molecules/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Display label for the subject/behavior.',
      control: 'text',
    },
    keyLabel: {
      description: 'The keyboard key bound to this subject, shown as a KeyBadge.',
      control: 'text',
    },
    active: {
      description: "Whether this subject's timer currently has an open interval.",
      control: 'boolean',
    },
    disabled: {
      description: "Disables the button, e.g. while the video isn't playing.",
      control: 'boolean',
    },
    onToggle: {
      description: 'Fired when the button is clicked.',
    },
  },
}

export default meta
type Story = StoryObj<typeof ToggleButton>

/** No interval currently open for this subject. */
export const Inactive: Story = {
  args: { label: 'Grooming', keyLabel: 'g', active: false },
}

/** An interval is currently open — the button is styled to stand out. */
export const Active: Story = {
  args: { label: 'Grooming', keyLabel: 'g', active: true },
}

/** Disabled, e.g. while the video isn't playing. */
export const Disabled: Story = {
  args: { label: 'Grooming', keyLabel: 'g', active: false, disabled: true },
}
