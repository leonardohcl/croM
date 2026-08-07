import type { Meta, StoryObj } from '@storybook/vue3-vite'
import AppNavbar from './AppNavbar.vue'

const meta: Meta<typeof AppNavbar> = {
  title: 'Organisms/AppNavbar',
  component: AppNavbar,
  tags: ['autodocs'],
  argTypes: {
    active: {
      description: 'The currently shown page, highlighted in the link list.',
      control: 'radio',
      options: ['session', 'history', 'load'],
    },
    onNavigate: {
      description: 'Fired when a page link is clicked, with the page to navigate to.',
    },
    onNewSession: {
      description: 'Fired when the user requests to start a fresh session.',
    },
    onOpenHowToUse: {
      description: 'Fired when the user requests to open the How to use dialog.',
    },
    onOpenAbout: {
      description: 'Fired when the user requests to open the About dialog.',
    },
  },
}

export default meta
type Story = StoryObj<typeof AppNavbar>

/** Brand, page links, and the New session action, shown above every page. */
export const Default: Story = {
  args: { active: 'session' },
}

/** The History link highlighted as the active page. */
export const OnHistoryPage: Story = {
  args: { active: 'history' },
}

/** The Load JSON link highlighted as the active page. */
export const OnLoadJsonPage: Story = {
  args: { active: 'load' },
}
