import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionViewModal from './SessionViewModal.vue'

const meta: Meta<typeof SessionViewModal> = {
  title: 'Organisms/SessionViewModal',
  component: SessionViewModal,
  tags: ['autodocs'],
  argTypes: {
    show: {
      description: 'Whether the modal is visible.',
      control: 'boolean',
    },
    snapshot: {
      description: 'The archived session to display, or null while none is selected.',
      control: 'object',
    },
    'onUpdate:show': {
      description: 'Fired when the visibility should change, e.g. dismissed.',
    },
  },
}

export default meta
type Story = StoryObj<typeof SessionViewModal>

/** A read-only view of an archived session's subjects, log, and table. */
export const Visible: Story = {
  args: {
    show: true,
    snapshot: {
      video: { name: 'behavior-clip.mp4', size: 1024, lastModified: 1700000000000, duration: 180 },
      subjects: [
        { id: 'a1', label: 'Grooming', key: 'g', description: 'Self-directed grooming behavior' },
        { id: 'a2', label: 'Feeding', key: 'f' },
      ],
      intervals: {
        a1: [{ start: 10, end: 40 }],
        a2: [{ start: 100, end: 130 }],
      },
    },
  },
}
