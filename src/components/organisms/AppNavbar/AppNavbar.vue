<script setup lang="ts">
/**
 * Persistent top navigation bar shown above every page. There's only one page
 * today, so this just brands the app and highlights it as the current section —
 * built as a plain list rather than router-links so more items can be added
 * once additional pages exist.
 */
</script>

<template>
  <nav class="app-navbar">
    <span class="app-navbar__brand">croM</span>
    <ul class="app-navbar__links">
      <li class="app-navbar__link app-navbar__link--active">Session</li>
    </ul>
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
    font-size: 1.25rem;
    font-weight: 700;
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

    &--active {
      color: #1f2937;
      font-weight: 600;
      background: vars.$timeline-track-color;
    }
  }
}
</style>
