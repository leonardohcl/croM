import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SubjectKeyField from './SubjectKeyField.vue'

const meta: Meta<typeof SubjectKeyField> = {
  title: 'Molecules/SubjectKeyField',
  component: SubjectKeyField,
  tags: ['autodocs'],
  argTypes: {
    modelValue: {
      description: 'Current value of the key field.',
      control: 'text',
    },
    error: {
      description: 'Validation error message to display below the field, if any.',
      control: 'text',
    },
    'onUpdate:modelValue': {
      description: 'Fired when the user edits the key value.',
    },
  },
}

export default meta
type Story = StoryObj<typeof SubjectKeyField>

/** No key has been entered yet. */
export const Empty: Story = {
  args: { modelValue: '' },
}

/** A valid key has been entered, previewed live as a KeyBadge. */
export const Filled: Story = {
  args: { modelValue: 'g' },
}

/** The entered key is already bound to another subject. */
export const DuplicateKeyError: Story = {
  args: { modelValue: 'g', error: 'This key is already used by "Feeding".' },
}
