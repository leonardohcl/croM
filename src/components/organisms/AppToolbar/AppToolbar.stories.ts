import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppToolbar from './AppToolbar.vue'

const meta: Meta<typeof AppToolbar> = {
  title: 'Organisms/AppToolbar',
  component: AppToolbar,
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      description: 'Disables all actions, e.g. when no video/session data is loaded yet.',
      control: 'boolean',
    },
    autoSaveHistory: {
      description: 'Whether the session is automatically saved to history on every change.',
      control: 'boolean',
    },
    onExportCsv: {
      description: 'Fired when the user requests a CSV export.',
    },
    onExportJson: {
      description: 'Fired when the user requests a JSON export.',
    },
    onSaveHistory: {
      description: 'Fired when the user requests to save the current session to history.',
    },
    'onUpdate:autoSaveHistory': {
      description: 'Fired when the auto-save-to-history toggle is flipped.',
    },
    onReset: {
      description: 'Fired when the user requests to reset the session.',
    },
  },
}

export default meta
type Story = StoryObj<typeof AppToolbar>

/** All actions enabled. */
export const Default: Story = {
  args: { disabled: false, autoSaveHistory: false },
}
