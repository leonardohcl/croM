<script setup lang="ts">
import { computed } from 'vue'
import { NDataTable } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import { formatTime } from '@/utils/formatTime'
import type { Interval } from '@/types'

/**
 * Tabular view of a subject's recorded intervals: start, end, and duration per row,
 * plus a summary row with the total duration. An open interval (no end yet) shows a
 * placeholder instead of an end/duration value, unless `openEndsAtDuration` is set.
 */
const props = defineProps<{
  /** Recorded intervals for this subject, in seconds. An interval with `end: null` is still open. */
  intervals: Interval[]
  /** Total video duration, in seconds. Only used when `openEndsAtDuration` is true. */
  duration?: number
  /** When true, an open interval's end/duration are computed as if it ran until `duration`, instead of showing a placeholder. */
  openEndsAtDuration?: boolean
}>()

interface Row {
  key: number
  start: number
  end: number | null
}

function resolveEnd(end: number | null): number | null {
  if (end !== null) return end
  return props.openEndsAtDuration && props.duration !== undefined ? props.duration : null
}

const rows = computed<Row[]>(() =>
  props.intervals.map((interval, index) => ({ key: index, start: interval.start, end: interval.end })),
)

const columns: DataTableColumns<Row> = [
  { title: 'Start', key: 'start', render: (row) => formatTime(row.start) },
  {
    title: 'End',
    key: 'end',
    render: (row) => {
      const end = resolveEnd(row.end)
      return end === null ? '—' : formatTime(end)
    },
  },
  {
    title: 'Duration',
    key: 'duration',
    render: (row) => {
      const end = resolveEnd(row.end)
      return end === null ? '—' : formatTime(end - row.start)
    },
  },
]

const totalDuration = computed(() =>
  props.intervals.reduce((total, interval) => {
    const end = resolveEnd(interval.end)
    return end === null ? total : total + (end - interval.start)
  }, 0),
)

function summary() {
  return {
    start: { value: 'Total' },
    end: { value: '' },
    duration: { value: formatTime(totalDuration.value) },
  }
}
</script>

<template>
  <NDataTable
    class="interval-table"
    :columns="columns"
    :data="rows"
    :summary="summary"
    :bordered="false"
    size="small"
  />
</template>

<style lang="scss" scoped>
.interval-table {
  width: 100%;
}
</style>
