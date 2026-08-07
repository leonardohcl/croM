<script setup lang="ts">
import IntervalTable from '@/components/organisms/IntervalTable/IntervalTable.vue'
import type { Interval, Subject } from '@/types'

interface SubjectIntervals {
  subject: Subject
  intervals: Interval[]
}

/**
 * Per-subject table of recorded intervals, each with a running total duration.
 */
defineProps<{
  /** One entry per subject, with its recorded intervals. */
  entries: SubjectIntervals[]
  /** Total video duration, in seconds. */
  duration: number
}>()
</script>

<template>
  <div class="session-table">
    <p v-if="entries.length === 0" class="session-table__empty">No subjects yet.</p>
    <div v-for="entry in entries" :key="entry.subject.id" class="session-table__group">
      <h3 class="session-table__title">{{ entry.subject.label }}</h3>
      <IntervalTable :intervals="entry.intervals" :duration="duration" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-table {
  &__empty {
    margin: 0;
    color: vars.$timeline-tick-color;
  }

  &__group {
    margin-bottom: vars.$spacing-md;
  }

  &__title {
    margin: 0 0 vars.$spacing-xs;
    font-size: 1rem;
  }
}
</style>
