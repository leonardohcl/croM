<script setup lang="ts">
/** One painted interval within a TimelineSegment track, positioned by percentage of the track's width. */
export interface TimelineSegmentInterval {
  /** Left edge of the segment, as a percentage (0-100) of the timeline's width. */
  startPercent: number
  /** Width of the segment, as a percentage (0-100) of the timeline's width. */
  widthPercent: number
  /** Whether this interval is still open (no end recorded yet). Open segments are styled distinctly. */
  open: boolean
}

/**
 * A timeline track that paints every recorded interval for a subject at once,
 * each positioned and sized by percentage of the track's width.
 */
defineProps<{
  /** Intervals to paint on this track, in any order. */
  intervals: TimelineSegmentInterval[]
}>()
</script>

<template>
  <div class="timeline-segment-track">
    <div
      v-for="(interval, index) in intervals"
      :key="index"
      class="timeline-segment"
      :class="{ 'timeline-segment--open': interval.open }"
      :style="{ left: `${interval.startPercent}%`, width: `${interval.widthPercent}%` }"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.timeline-segment-track {
  position: relative;
  width: 100%;
  height: 100%;
}

.timeline-segment {
  position: absolute;
  top: 0;
  height: 100%;
  background: vars.$timeline-segment-color;

  &--open {
    background: vars.$timeline-segment-open-color;
  }
}
</style>
