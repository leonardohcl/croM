<script setup lang="ts">
/**
 * A single tick mark with a timestamp label, positioned at a percentage offset
 * along a parent timeline. The parent must be `position: relative`.
 */
defineProps<{
  /** Horizontal position along the timeline, as a percentage (0-100) of its width. */
  offsetPercent: number
  /** Formatted timestamp text shown below the tick, e.g. `"01:23"`. */
  label: string
}>()
</script>

<template>
  <div class="timeline-tick" :style="{ left: `${offsetPercent}%` }">
    <span class="timeline-tick__mark" />
    <span class="timeline-tick__label">{{ label }}</span>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.timeline-tick {
  position: absolute;
  top: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
  color: vars.$timeline-tick-color;

  &__mark {
    width: 1px;
    height: vars.$spacing-xs;
    background: vars.$timeline-tick-color;
  }

  &__label {
    margin-top: vars.$spacing-xs;
    font-size: 0.7rem;
    white-space: nowrap;
  }
}
</style>
