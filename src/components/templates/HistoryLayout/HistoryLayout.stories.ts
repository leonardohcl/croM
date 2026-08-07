import type { Meta, StoryObj } from '@storybook/vue3-vite'
import HistoryLayout from './HistoryLayout.vue'

const meta: Meta<typeof HistoryLayout> = {
  title: 'Templates/HistoryLayout',
  component: HistoryLayout,
  tags: ['autodocs'],
  argTypes: {
    entries: {
      description: 'Archived sessions to list, most recently saved first.',
      control: 'object',
    },
    onExportCsv: {
      description: 'Fired when the user requests a CSV export of an entry.',
    },
    onExportJson: {
      description: 'Fired when the user requests a JSON export of an entry.',
    },
  },
}

export default meta
type Story = StoryObj<typeof HistoryLayout>

/** A list of archived sessions as cards, each with View/Export actions. */
export const Default: Story = {
  args: {
    entries: [
      {
        id: 'h1',
        savedAt: '2026-08-01T10:00:00.000Z',
        snapshot: {
          video: { name: 'clip-1.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
          subjects: [
            { id: 'a1', label: 'Grooming', key: 'g' },
            { id: 'a2', label: 'Feeding', key: 'f' },
          ],
          intervals: { a1: [{ start: 0, end: 10 }], a2: [] },
        },
      },
      {
        id: 'h2',
        savedAt: '2026-08-02T15:30:00.000Z',
        snapshot: {
          video: { name: 'clip-2.mp4', size: 2048, lastModified: 1700000100000, duration: 200 },
          subjects: [{ id: 'b1', label: 'Resting', key: 'r' }],
          intervals: { b1: [] },
        },
      },
    ],
  },
}

/** Shown when no sessions have been saved yet. */
export const Empty: Story = {
  args: {
    entries: [],
  },
}
