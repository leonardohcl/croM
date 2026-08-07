<script setup lang="ts">
import { computed } from 'vue'
import TimelineSegment from '@/components/atoms/TimelineSegment/TimelineSegment.vue'
import TimelineTick from '@/components/atoms/TimelineTick/TimelineTick.vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval } from '@/types'

/**
 * Renders a subject's full interval history as a single timeline: painted segments
 * for every recorded interval (an open one styled distinctly) plus evenly spaced,
 * timestamp-labeled tick marks spanning the video's duration. While the subject has
 * an open interval, a softly pulsing "Recording" label overlays the track. In compact
 * mode (used by collapsed subject cards) the track is thinner and shows only the
 * colored intervals, without ticks or the "Recording" label.
 */
const props = withDefaults(
  defineProps<{
    /** Total duration of the video, in seconds. Used to convert interval times to percentages. */
    duration: number
    /** Recorded intervals for this subject, in seconds. An interval with `end: null` is still open. */
    intervals: Interval[]
    /** Number of tick marks to render along the timeline, evenly spaced (including both ends). */
    tickCount?: number
    /** Whether this subject currently has an open interval. Overlays a pulsing "Recording" label. */
    active?: boolean
    /** Renders a thinner track with no ticks or text — just the colored intervals. */
    compact?: boolean
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
  <div class="interval-timeline" :class="{ 'interval-timeline--compact': compact }">
    <div class="interval-timeline__track" :class="{ 'interval-timeline__track--compact': compact }">
      <div class="interval-timeline__track-content" :class="{ 'interval-timeline__track-content--active': active }">
        <TimelineSegment :intervals="segments" />
        <template v-if="!compact">
          <TimelineTick
            v-for="(tick, index) in ticks"
            :key="index"
            :offset-percent="tick.offsetPercent"
            :label="tick.label"
          />
        </template>
      </div>
      <span v-if="active && !compact" class="interval-timeline__active-label">Recording…</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.interval-timeline {
  padding-bottom: vars.$spacing-lg;

  &--compact {
    padding-bottom: 0;
  }

  &__track {
    position: relative;
    height: 24px;
    background: vars.$timeline-track-color;
    border-radius: 4px;

    &--compact {
      height: 6px;
      border-radius: 3px;
    }
  }

  &__track-content {
    position: absolute;
    inset: 0;

    &--active {
      animation: interval-timeline-fade 3.2s ease-in-out infinite;
    }
  }

  &__active-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 0 vars.$spacing-xs;
    border-radius: 3px;
    background: rgba(17, 24, 39, 0.75);
    color: #fff;
    font-size: 0.7rem;
    font-weight: 600;
    line-height: 1.6;
    white-space: nowrap;
    pointer-events: none;
  }
}

@keyframes interval-timeline-fade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
</style>
