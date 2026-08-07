<script setup lang="ts">
import { NButton } from 'naive-ui'
import logoUrl from '@/assets/logo.svg'

export type AppPage = 'session' | 'history' | 'load'

/**
 * Persistent top navigation bar shown above every page: the brand, links between
 * pages (built as a plain list rather than router-links, since there's no router),
 * and a New session action that clears the live session and jumps to it.
 */
defineProps<{
  /** The currently shown page, highlighted in the link list. */
  active: AppPage
}>()

const emit = defineEmits<{
  /** Fired when a page link is clicked, with the page to navigate to. */
  navigate: [page: AppPage]
  /** Fired when the user requests to start a fresh session. */
  newSession: []
  /** Fired when the user requests to open the About dialog. */
  openAbout: []
  /** Fired when the user requests to open the How to use dialog. */
  openHowToUse: []
}>()
</script>

<template>
  <nav class="app-navbar">
    <span class="app-navbar__brand">
      <img class="app-navbar__logo" :src="logoUrl" alt="" />
      croM
    </span>
    <ul class="app-navbar__links">
      <li
        class="app-navbar__link"
        :class="{ 'app-navbar__link--active': active === 'session' }"
        @click="emit('navigate', 'session')"
      >
        Session
      </li>
      <li
        class="app-navbar__link"
        :class="{ 'app-navbar__link--active': active === 'history' }"
        @click="emit('navigate', 'history')"
      >
        History
      </li>
      <li
        class="app-navbar__link"
        :class="{ 'app-navbar__link--active': active === 'load' }"
        @click="emit('navigate', 'load')"
      >
        Load JSON
      </li>
      <li class="app-navbar__link" @click="emit('openHowToUse')">How to use</li>
      <li class="app-navbar__link" @click="emit('openAbout')">About</li>
    </ul>
    <NButton size="small" @click="emit('newSession')">+ New session</NButton>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.app-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: vars.$spacing-lg;
  padding: vars.$spacing-sm vars.$spacing-lg;
  border-bottom: 1px solid vars.$timeline-track-color;
  background: vars.$surface-color;

  &__brand {
    display: flex;
    align-items: center;
    gap: vars.$spacing-xs;
    font-size: 1.25rem;
    font-weight: 700;
  }

  &__logo {
    width: 24px;
    height: 24px;
  }

  &__links {
    display: flex;
    gap: vars.$spacing-sm;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__link {
    padding: vars.$spacing-xs vars.$spacing-sm;
    border-radius: 6px;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
    cursor: pointer;

    &--active {
      color: #1f2937;
      font-weight: 600;
      background: vars.$timeline-track-color;
    }
  }
}
</style>
