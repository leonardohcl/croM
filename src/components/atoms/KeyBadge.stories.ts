import type { Meta, StoryObj } from '@storybook/vue3-vite'
import KeyBadge from './KeyBadge.vue'

const meta: Meta<typeof KeyBadge> = {
  title: 'Atoms/KeyBadge',
  component: KeyBadge,
  tags: ['autodocs'],
  argTypes: {
    keyLabel: {
      description: 'The keyboard key to display. A single space renders as "Space".',
      control: 'text',
    },
  },
}

export default meta
type Story = StoryObj<typeof KeyBadge>

/** A single lowercase letter key. */
export const Letter: Story = {
  args: { keyLabel: 'g' },
}

/** The space bar, rendered as the word "Space" rather than a blank badge. */
export const Space: Story = {
  args: { keyLabel: ' ' },
}

/** A named key, shown as-is. */
export const NamedKey: Story = {
  args: { keyLabel: 'Enter' },
}
