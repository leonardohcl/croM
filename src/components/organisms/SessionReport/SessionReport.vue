<script setup lang="ts">
import { computed } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'
import IntervalTable from '@/components/organisms/IntervalTable/IntervalTable.vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval, Subject } from '@/types'

interface SubjectIntervals {
  subject: Subject
  intervals: Interval[]
}

/**
 * Session-wide report below the video and subject cards: a chronological log of
 * every trigger/release event across all subjects (open by default), and a table
 * tab with per-subject interval detail and totals.
 */
const props = defineProps<{
  /** One entry per subject, with its recorded intervals. */
  entries: SubjectIntervals[]
  /** Total video duration, in seconds. */
  duration: number
}>()

interface LogEntry {
  time: number
  text: string
}

const log = computed<LogEntry[]>(() => {
  const events: LogEntry[] = []
  for (const entry of props.entries) {
    for (const interval of entry.intervals) {
      events.push({ time: interval.start, text: `${entry.subject.label} was triggered at ${formatTime(interval.start)}` })
      if (interval.end !== null) {
        events.push({ time: interval.end, text: `${entry.subject.label} was released at ${formatTime(interval.end)}` })
      }
    }
  }
  return events.sort((a, b) => a.time - b.time)
})
</script>

<template>
  <NTabs class="session-report" type="line" default-value="log" animated>
    <NTabPane name="log" tab="Log">
      <ul class="session-report__log">
        <li v-if="log.length === 0" class="session-report__empty">No activity recorded yet.</li>
        <li v-for="(entry, index) in log" :key="index">{{ entry.text }}</li>
      </ul>
    </NTabPane>
    <NTabPane name="table" tab="Table">
      <div v-if="entries.length === 0" class="session-report__empty">No subjects yet.</div>
      <div v-for="entry in entries" :key="entry.subject.id" class="session-report__table-group">
        <h3 class="session-report__table-title">{{ entry.subject.label }}</h3>
        <IntervalTable :intervals="entry.intervals" :duration="duration" />
      </div>
    </NTabPane>
  </NTabs>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-report {
  &__log {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-xs;
  }

  &__empty {
    color: vars.$timeline-tick-color;
  }

  &__table-group {
    margin-bottom: vars.$spacing-md;
  }

  &__table-title {
    margin: 0 0 vars.$spacing-xs;
    font-size: 1rem;
  }
}
</style>
