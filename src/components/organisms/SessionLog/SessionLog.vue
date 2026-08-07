<script setup lang="ts">
import { computed } from 'vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval, Subject } from '@/types'

interface SubjectIntervals {
  subject: Subject
  intervals: Interval[]
}

/**
 * Chronological log of every trigger/release event across all subjects.
 */
const props = defineProps<{
  /** One entry per subject, with its recorded intervals. */
  entries: SubjectIntervals[]
}>()

interface LogEntry {
  time: number
  text: string
}

const log = computed<LogEntry[]>(() => {
  const events: LogEntry[] = []
  for (const entry of props.entries) {
    for (const interval of entry.intervals) {
      events.push({
        time: interval.start,
        text: `${entry.subject.label} was triggered at ${formatTime(interval.start)}`,
      })
      if (interval.end !== null) {
        events.push({
          time: interval.end,
          text: `${entry.subject.label} was released at ${formatTime(interval.end)}`,
        })
      }
    }
  }
  return events.sort((a, b) => a.time - b.time)
})
</script>

<template>
  <ul class="session-log">
    <li v-if="log.length === 0" class="session-log__empty">No activity recorded yet.</li>
    <li v-for="(entry, index) in log" :key="index">{{ entry.text }}</li>
  </ul>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-log {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-xs;

  &__empty {
    color: vars.$timeline-tick-color;
  }
}
</style>
