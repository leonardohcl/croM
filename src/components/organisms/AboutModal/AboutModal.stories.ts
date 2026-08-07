import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AboutModal from './AboutModal.vue'

const meta: Meta<typeof AboutModal> = {
  title: 'Organisms/AboutModal',
  component: AboutModal,
  tags: ['autodocs'],
  argTypes: {
    show: {
      description: 'Whether the modal is visible.',
      control: 'boolean',
    },
    'onUpdate:show': {
      description: 'Fired when the visibility should change (e.g. dismissed).',
    },
  },
}

export default meta
type Story = StoryObj<typeof AboutModal>

/** Modal visible, showing the project description and license. */
export const Visible: Story = {
  args: { show: true },
}
