import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ResumeDialog from './ResumeDialog.vue'

const meta: Meta<typeof ResumeDialog> = {
  title: 'Organisms/ResumeDialog',
  component: ResumeDialog,
  tags: ['autodocs'],
  argTypes: {
    show: {
      description: 'Whether the dialog is visible.',
      control: 'boolean',
    },
    videoName: {
      description: 'Name of the video file the saved session belongs to, shown in the prompt.',
      control: 'text',
    },
    'onUpdate:show': {
      description: 'Fired when the visibility should change (e.g. dismissed without a choice).',
    },
    onResume: {
      description: 'Fired when the user chooses to resume the saved session.',
    },
    onDiscard: {
      description: 'Fired when the user chooses to discard it and start fresh.',
    },
  },
}

export default meta
type Story = StoryObj<typeof ResumeDialog>

/** Prompt visible, asking whether to resume a saved session for the given video. */
export const Visible: Story = {
  args: { show: true, videoName: 'behavior-clip.mp4' },
}
