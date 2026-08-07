<script setup lang="ts">
import { computed, ref } from 'vue'
import AppToolbar from '@/components/organisms/AppToolbar/AppToolbar.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer/VideoPlayer.vue'
import SubjectCard from '@/components/organisms/SubjectCard/SubjectCard.vue'
import SubjectForm from '@/components/organisms/SubjectForm/SubjectForm.vue'
import SessionReport from '@/components/organisms/SessionReport/SessionReport.vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval, Subject } from '@/types'

interface TimerEntry {
  subject: Subject
  active: boolean
  intervals: Interval[]
}

/**
 * Live recording view: a toolbar, the video (with a file name / time readout) on
 * the left, a column of subject cards plus an "add subject" card on the right,
 * and a session-wide log/table report below both. Purely presentational — no
 * store connection.
 */
const props = defineProps<{
  /** One entry per subject to render as a card, with its recorded intervals. */
  subjects: TimerEntry[]
  /** Disables the toolbar's export/reset actions, e.g. before a video is loaded. */
  toolbarDisabled?: boolean
  /** Whether the video is currently playing. Subject cards are disabled while it isn't. */
  playing?: boolean
  /** Current value of the new-subject form's label input. */
  newSubjectLabel: string
  /** Current value of the new-subject form's key input. */
  newSubjectKey: string
  /** Keys already bound to other subjects, used to flag duplicates in the form. */
  existingKeys: string[]
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
  /** Fired when playback starts or resumes. */
  play: []
  /** Fired when playback pauses or the video ends. */
  pause: []
  /** Fired when a subject's card is toggled, with that subject's id. */
  toggleSubject: [subjectId: string]
  /** Fired when a subject's remove button is clicked, with that subject's id. */
  removeSubject: [subjectId: string]
  /** Fired when the new-subject form's label input is edited. */
  'update:newSubjectLabel': [value: string]
  /** Fired when the new-subject form's key input is edited. */
  'update:newSubjectKey': [value: string]
  /** Fired when the new-subject form is submitted with a valid, non-duplicate label + key. */
  addSubject: [subject: { label: string; key: string }]
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

const reportEntries = computed(() =>
  props.subjects.map((entry) => ({ subject: entry.subject, intervals: entry.intervals })),
)
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
          @play="emit('play')"
          @pause="emit('pause')"
        />
        <p v-if="fileName" class="session-layout__video-details">
          {{ fileName }} — {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
        </p>
      </section>
      <section class="session-layout__subjects">
        <SubjectCard
          v-for="entry in subjects"
          :key="entry.subject.id"
          :subject="entry.subject"
          :intervals="entry.intervals"
          :duration="duration"
          :active="entry.active"
          :disabled="!playing"
          @toggle="emit('toggleSubject', entry.subject.id)"
          @remove="emit('removeSubject', entry.subject.id)"
        />
        <div class="session-layout__form-card">
          <SubjectForm
            :label="newSubjectLabel"
            :key-value="newSubjectKey"
            :existing-keys="existingKeys"
            @update:label="emit('update:newSubjectLabel', $event)"
            @update:key-value="emit('update:newSubjectKey', $event)"
            @submit="emit('addSubject', $event)"
          />
        </div>
      </section>
    </div>
    <section class="session-layout__report">
      <SessionReport :entries="reportEntries" :duration="duration" />
    </section>
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

  &__subjects {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-sm;
  }

  &__form-card {
    padding: vars.$spacing-md;
    border: 1px solid vars.$timeline-track-color;
    border-radius: 8px;
    background: #fff;
  }
}
</style>
