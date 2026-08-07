<script setup lang="ts">
/**
 * Small badge that renders a bound keyboard key, styled like a physical keycap.
 * Used next to subjects/timers so users can see which key toggles them.
 */
defineProps<{
  /** The keyboard key to display, e.g. `"a"`, `" "`, or `"Enter"`. A single space is shown as "Space". */
  keyLabel: string
}>()
</script>

<template>
  <span class="key-badge">{{ keyLabel === ' ' ? 'Space' : keyLabel }}</span>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.key-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 vars.$spacing-xs;
  border: 1px solid vars.$timeline-tick-color;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.75rem;
  color: vars.$timeline-tick-color;
  background: #fff;
  box-shadow: 0 1px 0 vars.$timeline-tick-color;
}
</style>
