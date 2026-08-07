import type { Meta, StoryObj } from '@storybook/vue3-vite'
import MobileNotice from './MobileNotice.vue'

const meta: Meta<typeof MobileNotice> = {
  title: 'Organisms/MobileNotice',
  component: MobileNotice,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MobileNotice>

/** Shown in place of the app when the viewport doesn't match desktop width. */
export const Default: Story = {}
