<script setup lang="ts">
import { NModal } from 'naive-ui'

/**
 * Static info dialog describing what croM is and where it came from.
 */
defineProps<{
  /** Whether the modal is visible. */
  show: boolean
}>()

const emit = defineEmits<{
  /** Fired when the visibility should change (e.g. dismissed). */
  'update:show': [value: boolean]
}>()
</script>

<template>
  <NModal
    class="about-modal"
    preset="card"
    title="About croM"
    style="width: 420px; max-width: 90vw"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
  >
    <p>
      croM is a browser-based tool for coding intervals on a video: load a local video file, bind
      subjects/behaviors to keys, and toggle each one as you watch to record open/close
      timestamps. Everything runs client-side — no upload, no backend.
    </p>
    <p>
      Originally developed for
      <a href="https://doi.org/10.1016/j.ijppaw.2024.101023" target="_blank" rel="noopener noreferrer"
        >this study</a
      >.
    </p>
    <p class="about-modal__meta">MIT License</p>
  </NModal>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.about-modal {
  p {
    margin: 0 0 vars.$spacing-sm;
    line-height: 1.5;
  }

  &__meta {
    margin-bottom: 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }
}
</style>
