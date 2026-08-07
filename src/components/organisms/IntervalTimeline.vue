<script setup lang="ts">
import { computed } from 'vue'
import TimelineSegment from '@/components/atoms/TimelineSegment.vue'
import TimelineTick from '@/components/atoms/TimelineTick.vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval } from '@/types'

/**
 * Renders a subject's full interval history as a single timeline: painted segments
 * for every recorded interval (an open one styled distinctly) plus evenly spaced,
 * timestamp-labeled tick marks spanning the video's duration.
 */
const props = withDefaults(
  defineProps<{
    /** Total duration of the video, in seconds. Used to convert interval times to percentages. */
    duration: number
    /** Recorded intervals for this subject, in seconds. An interval with `end: null` is still open. */
    intervals: Interval[]
    /** Number of tick marks to render along the timeline, evenly spaced (including both ends). */
    tickCount?: number
  }>(),
  {
    tickCount: 5,
  },
)

function toPercent(seconds: number): number {
  if (props.duration <= 0) return 0
  return Math.min(100, Math.max(0, (seconds / props.duration) * 100))
}

const segments = computed(() =>
  props.intervals.map((interval) => {
    const endSeconds = interval.end ?? props.duration
    const startPercent = toPercent(interval.start)
    return {
      startPercent,
      widthPercent: toPercent(endSeconds) - startPercent,
      open: interval.end === null,
    }
  }),
)

const ticks = computed(() => {
  const count = Math.max(2, props.tickCount)
  return Array.from({ length: count }, (_, index) => {
    const time = (props.duration * index) / (count - 1)
    return { offsetPercent: toPercent(time), label: formatTime(time) }
  })
})
</script>

<template>
  <div class="interval-timeline">
    <div class="interval-timeline__track">
      <TimelineSegment :intervals="segments" />
      <TimelineTick
        v-for="(tick, index) in ticks"
        :key="index"
        :offset-percent="tick.offsetPercent"
        :label="tick.label"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.interval-timeline {
  padding-bottom: vars.$spacing-lg;

  &__track {
    position: relative;
    height: 24px;
    background: vars.$timeline-track-color;
    border-radius: 4px;
  }
}
</style>
