<script setup lang="ts">
import { ref } from 'vue'
import AppToolbar from '@/components/organisms/AppToolbar/AppToolbar.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer/VideoPlayer.vue'
import ToggleButton from '@/components/molecules/ToggleButton/ToggleButton.vue'
import { formatTime } from '@/utils/formatTime'
import type { Subject } from '@/types'

interface TimerEntry {
  subject: Subject
  active: boolean
}

/**
 * Live recording view: the toolbar, the video on the left, and a grid of toggle
 * buttons (one per subject) on the right. Purely presentational — no store
 * connection, and no per-subject timeline/table detail (that lives elsewhere).
 */
defineProps<{
  /** One entry per subject to render as a toggle button in the grid. */
  subjects: TimerEntry[]
  /** Disables the toolbar's export/reset actions, e.g. before a video is loaded. */
  toolbarDisabled?: boolean
}>()

const emit = defineEmits<{
  /** Fired when the user requests a CSV export. */
  exportCsv: []
  /** Fired when the user requests a JSON export. */
  exportJson: []
  /** Fired when the user requests to reset the session. */
  reset: []
  /** Fired when the user selects a new video file. */
  fileSelected: [file: File]
  /** Fired once the video's metadata has loaded, with its total duration in seconds. */
  loadedMetadata: [duration: number]
  /** Fired periodically as the video plays, with its current time in seconds. */
  timeUpdate: [currentTime: number]
  /** Fired when a subject's toggle button is clicked, with that subject's id. */
  toggleSubject: [subjectId: string]
}>()

const fileName = ref<string | null>(null)
const currentTime = ref(0)
const duration = ref(0)

function handleFileSelected(file: File) {
  fileName.value = file.name
  emit('fileSelected', file)
}

function handleLoadedMetadata(value: number) {
  duration.value = value
  emit('loadedMetadata', value)
}

function handleTimeUpdate(value: number) {
  currentTime.value = value
  emit('timeUpdate', value)
}
</script>

<template>
  <div class="session-layout">
    <header class="session-layout__header">
      <h1 class="session-layout__title">croM</h1>
      <AppToolbar
        :disabled="toolbarDisabled"
        @export-csv="emit('exportCsv')"
        @export-json="emit('exportJson')"
        @reset="emit('reset')"
      />
    </header>
    <div class="session-layout__main">
      <section class="session-layout__video">
        <VideoPlayer
          @file-selected="handleFileSelected"
          @loaded-metadata="handleLoadedMetadata"
          @time-update="handleTimeUpdate"
        />
        <p v-if="fileName" class="session-layout__video-details">
          {{ fileName }} — {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </p>
      </section>
      <section class="session-layout__timers">
        <div v-for="entry in subjects" :key="entry.subject.id" class="session-layout__timer">
          <ToggleButton
            :label="entry.subject.label"
            :key-label="entry.subject.key"
            :active="entry.active"
            @toggle="emit('toggleSubject', entry.subject.id)"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-layout {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-lg;
  padding: vars.$spacing-lg;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: vars.$spacing-md;
  }

  &__title {
    margin: 0;
  }

  &__main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: vars.$spacing-lg;
    align-items: start;
  }

  &__video-details {
    margin: vars.$spacing-sm 0 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }

  &__timers {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: vars.$spacing-sm;
  }

  &__timer {
    aspect-ratio: 1;

    :deep(.toggle-button) {
      width: 100%;
      height: 100%;
    }

    :deep(.toggle-button__content) {
      height: 100%;
      flex-direction: column;
      justify-content: center;
    }
  }
}
</style>
