import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SessionLayout from './SessionLayout.vue'

const meta: Meta<typeof SessionLayout> = {
  title: 'Templates/SessionLayout',
  component: SessionLayout,
  tags: ['autodocs'],
  argTypes: {
    subjects: {
      description: 'One entry per subject to render as a card, with its recorded intervals.',
      control: 'object',
    },
    toolbarDisabled: {
      description: "Disables the toolbar's export/reset actions, e.g. before a video is loaded.",
      control: 'boolean',
    },
    playing: {
      description: 'Whether the video is currently playing. Subject cards are disabled while it isn\'t.',
      control: 'boolean',
    },
    newSubjectLabel: {
      description: "Current value of the new-subject form's label input.",
      control: 'text',
    },
    newSubjectKey: {
      description: "Current value of the new-subject form's key input.",
      control: 'text',
    },
    existingKeys: {
      description: 'Keys already bound to other subjects, used to flag duplicates in the form.',
      control: 'object',
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
    onPlay: {
      description: 'Fired when playback starts or resumes.',
    },
    onPause: {
      description: 'Fired when playback pauses or the video ends.',
    },
    onToggleSubject: {
      description: "Fired when a subject's card is toggled, with that subject's id.",
    },
    onRemoveSubject: {
      description: "Fired when a subject's remove button is clicked, with that subject's id.",
    },
    onEditSubject: {
      description:
        "Fired when a subject's inline edit is saved, with that subject's id and the new label/description.",
    },
    'onUpdate:newSubjectLabel': {
      description: "Fired when the new-subject form's label input is edited.",
    },
    'onUpdate:newSubjectKey': {
      description: "Fired when the new-subject form's key input is edited.",
    },
    onAddSubject: {
      description: 'Fired when the new-subject form is submitted with a valid, non-duplicate label + key.',
    },
  },
}

export default meta
type Story = StoryObj<typeof SessionLayout>

/** Video and toolbar on top; a tabbed panel on the right switches between subject cards (collapsed by default) + an add-subject button that opens a modal, the event log, and the per-subject table. */
export const Default: Story = {
  args: {
    toolbarDisabled: false,
    playing: true,
    newSubjectLabel: '',
    newSubjectKey: '',
    existingKeys: ['1', '2', '3', '4'],
    subjects: [
      {
        subject: { id: 'a1', label: 'Subject 1', key: '1' },
        active: false,
        intervals: [{ start: 10, end: 40 }],
      },
      {
        subject: { id: 'a2', label: 'Subject 2', key: '2' },
        active: true,
        intervals: [{ start: 100, end: null }],
      },
      {
        subject: { id: 'a3', label: 'Subject 3', key: '3' },
        active: false,
        intervals: [],
      },
      {
        subject: { id: 'a4', label: 'Subject 4', key: '4' },
        active: false,
        intervals: [],
      },
    ],
  },
}
