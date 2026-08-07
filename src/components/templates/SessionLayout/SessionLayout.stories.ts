import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionLayout from './SessionLayout.vue'

const meta: Meta<typeof SessionLayout> = {
  title: 'Templates/SessionLayout',
  component: SessionLayout,
  tags: ['autodocs'],
  argTypes: {
    subjects: {
      description: 'One entry per subject to render as a toggle button in the grid.',
      control: 'object',
    },
    toolbarDisabled: {
      description: "Disables the toolbar's export/reset actions, e.g. before a video is loaded.",
      control: 'boolean',
    },
    onExportCsv: {
      description: 'Fired when the user requests a CSV export.',
    },
    onExportJson: {
      description: 'Fired when the user requests a JSON export.',
    },
    onReset: {
      description: 'Fired when the user requests to reset the session.',
    },
    onFileSelected: {
      description: 'Fired when the user selects a new video file.',
    },
    onLoadedMetadata: {
      description: "Fired once the video's metadata has loaded, with its total duration in seconds.",
    },
    onTimeUpdate: {
      description: 'Fired periodically as the video plays, with its current time in seconds.',
    },
    onToggleSubject: {
      description: "Fired when a subject's toggle button is clicked, with that subject's id.",
    },
  },
}

export default meta
type Story = StoryObj<typeof SessionLayout>

/** Video on the left, a grid of subject toggle buttons on the right. */
export const Default: Story = {
  args: {
    toolbarDisabled: false,
    subjects: [
      { subject: { id: 'a1', label: 'Grooming', key: 'g' }, active: false },
      { subject: { id: 'a2', label: 'Feeding', key: 'f' }, active: true },
      { subject: { id: 'a3', label: 'Resting', key: 'r' }, active: false },
      { subject: { id: 'a4', label: 'Vocalizing', key: 'v' }, active: false },
    ],
  },
}
