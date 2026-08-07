import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SubjectForm from './SubjectForm.vue'

const meta: Meta<typeof SubjectForm> = {
  title: 'Organisms/SubjectForm',
  component: SubjectForm,
  tags: ['autodocs'],
  argTypes: {
    label: {
      description: 'Current value of the label input.',
      control: 'text',
    },
    keyValue: {
      description: 'Current value of the key input.',
      control: 'text',
    },
    existingKeys: {
      description: 'Keys already bound to other subjects, used to flag duplicates before submitting.',
      control: 'object',
    },
    'onUpdate:label': {
      description: 'Fired when the user edits the label input.',
    },
    'onUpdate:keyValue': {
      description: 'Fired when the user edits the key input.',
    },
    onSubmit: {
      description: 'Fired when the form is submitted with a valid, non-duplicate label + key.',
    },
  },
}

export default meta
type Story = StoryObj<typeof SubjectForm>

/** No label or key entered yet; the add button is disabled. */
export const Empty: Story = {
  args: { label: '', keyValue: '', existingKeys: ['g', 'f'] },
}

/** The entered key is already bound to another subject; the add button stays disabled. */
export const DuplicateKeyError: Story = {
  args: { label: 'Feeding', keyValue: 'g', existingKeys: ['g', 'f'] },
}
