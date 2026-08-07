<script setup lang="ts">
import ToggleButton from '@/components/molecules/ToggleButton/ToggleButton.vue'
import IntervalTimeline from '@/components/organisms/IntervalTimeline/IntervalTimeline.vue'
import IntervalTable from '@/components/organisms/IntervalTable/IntervalTable.vue'
import type { Interval, Subject } from '@/types'

/**
 * A full report row for one subject: its toggle button, a painted timeline of its
 * recorded intervals, and a table with per-interval detail and a total.
 */
defineProps<{
  /** The subject/timer this row represents. */
  subject: Subject
  /** Recorded intervals for this subject, in seconds. */
  intervals: Interval[]
  /** Total video duration, in seconds. */
  duration: number
  /** Whether this subject currently has an open interval. */
  active: boolean
}>()

const emit = defineEmits<{
  /** Fired when the toggle button is clicked. */
  toggle: []
}>()
</script>

<template>
  <div class="subject-row">
    <ToggleButton
      :label="subject.label"
      :key-label="subject.key"
      :active="active"
      @toggle="emit('toggle')"
    />
    <IntervalTimeline :duration="duration" :intervals="intervals" />
    <IntervalTable :intervals="intervals" />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.subject-row {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;
}
</style>
