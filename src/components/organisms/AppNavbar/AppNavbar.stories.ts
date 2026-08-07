import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppNavbar from './AppNavbar.vue'

const meta: Meta<typeof AppNavbar> = {
  title: 'Organisms/AppNavbar',
  component: AppNavbar,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AppNavbar>

/** Brand plus the current section, shown above every page. */
export const Default: Story = {}
