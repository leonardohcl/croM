<script setup lang="ts">
import { NButton } from 'naive-ui'
import ToggleButton from '@/components/molecules/ToggleButton/ToggleButton.vue'
import IntervalTimeline from '@/components/organisms/IntervalTimeline/IntervalTimeline.vue'
import type { Interval, Subject } from '@/types'

/**
 * A single subject's card in the recording column: its toggle button, a compact
 * timeline of the intervals captured so far, and a button to remove the subject
 * entirely. The timeline only reflects closed intervals, so it updates once a
 * timer is deactivated rather than animating while it's running.
 */
defineProps<{
  /** The subject/timer this card represents. */
  subject: Subject
  /** Recorded intervals for this subject, in seconds. */
  intervals: Interval[]
  /** Total video duration, in seconds. */
  duration: number
  /** Whether this subject currently has an open interval. */
  active: boolean
  /** Disables the toggle button, e.g. while the video isn't playing. */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /** Fired when the toggle button is clicked. */
  toggle: []
  /** Fired when the remove button is clicked. */
  remove: []
}>()
</script>

<template>
  <div class="subject-card">
    <NButton
      class="subject-card__remove"
      size="tiny"
      circle
      quaternary
      type="error"
      aria-label="Remove subject"
      @click="emit('remove')"
    >
      ✕
    </NButton>
    <ToggleButton
      :label="subject.label"
      :key-label="subject.key"
      :active="active"
      :disabled="disabled"
      @toggle="emit('toggle')"
    />
    <IntervalTimeline
      :duration="duration"
      :intervals="intervals.filter((interval) => interval.end !== null)"
      :tick-count="3"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.subject-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;
  padding: vars.$spacing-md;
  border: 1px solid vars.$timeline-track-color;
  border-radius: 8px;
  background: #fff;

  &__remove {
    position: absolute;
    top: vars.$spacing-sm;
    right: vars.$spacing-sm;
  }
}
</style>
