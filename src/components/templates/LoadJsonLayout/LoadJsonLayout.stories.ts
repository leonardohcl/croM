import type { Meta, StoryObj } from '@storybook/vue3-vite'
import LoadJsonLayout from './LoadJsonLayout.vue'

const meta: Meta<typeof LoadJsonLayout> = {
  title: 'Templates/LoadJsonLayout',
  component: LoadJsonLayout,
  tags: ['autodocs'],
  argTypes: {
    snapshot: {
      description: 'The parsed session to display, or null while none is loaded.',
      control: 'object',
    },
    error: {
      description: "Error message to show if the last selected file failed to load, if any.",
      control: 'text',
    },
    onFileSelected: {
      description: 'Fired when the user picks a file to load.',
    },
  },
}

export default meta
type Story = StoryObj<typeof LoadJsonLayout>

/** Before any file has been chosen. */
export const Empty: Story = {
  args: { snapshot: null, error: '' },
}

/** A successfully loaded session, shown read-only. */
export const Loaded: Story = {
  args: {
    error: '',
    snapshot: {
      video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
      subjects: [
        { id: 'a1', label: 'Grooming', key: 'g' },
        { id: 'a2', label: 'Feeding', key: 'f' },
      ],
      intervals: { a1: [{ start: 0, end: 10 }], a2: [] },
    },
  },
}

/** The last selected file could not be read as a session. */
export const WithError: Story = {
  args: { snapshot: null, error: 'Couldn\'t read "notes.json" as a session file.' },
}
