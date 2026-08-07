import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionSnapshotView from './SessionSnapshotView.vue'

const meta: Meta<typeof SessionSnapshotView> = {
  title: 'Organisms/SessionSnapshotView',
  component: SessionSnapshotView,
  tags: ['autodocs'],
  argTypes: {
    snapshot: {
      description: 'The session to display, or null while none is loaded.',
      control: 'object',
    },
  },
}

export default meta
type Story = StoryObj<typeof SessionSnapshotView>

/** Read-only Subjects/Log/Table tabs for a loaded session. */
export const Default: Story = {
  args: {
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

/** No subject cards are rendered when there is no snapshot. */
export const Empty: Story = {
  args: { snapshot: null },
}
