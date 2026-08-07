import type { Meta, StoryObj } from '@storybook/vue3-vite'
import HowToUseModal from './HowToUseModal.vue'

const meta: Meta<typeof HowToUseModal> = {
  title: 'Organisms/HowToUseModal',
  component: HowToUseModal,
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
type Story = StoryObj<typeof HowToUseModal>

/** Modal visible, showing the step-by-step usage walkthrough. */
export const Visible: Story = {
  args: { show: true },
}
