<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NModal, NTabPane, NTabs } from 'naive-ui'
import AppToolbar from '@/components/organisms/AppToolbar/AppToolbar.vue'
import VideoPlayer from '@/components/organisms/VideoPlayer/VideoPlayer.vue'
import SubjectCard from '@/components/organisms/SubjectCard/SubjectCard.vue'
import SubjectForm from '@/components/organisms/SubjectForm/SubjectForm.vue'
import SessionLog from '@/components/organisms/SessionLog/SessionLog.vue'
import SessionTable from '@/components/organisms/SessionTable/SessionTable.vue'
import { formatTime } from '@/utils/formatTime'
import type { Interval, Subject } from '@/types'

interface TimerEntry {
  subject: Subject
  active: boolean
  intervals: Interval[]
}

/**
 * Live recording view: a toolbar, the video (with a file name / time readout) on
 * the left, and a tabbed panel on the right — one tab for the subject cards + an
 * "add subject" button (opens a modal with the form), one for the session-wide
 * event log, and one for the per-subject interval table. Purely presentational —
 * no store connection.
 *
 * Sized to fill its container's height (ultimately the viewport) rather than the
 * page's natural content height: the video grows to fill its column, and only the
 * active tab's content scrolls internally — nothing else on the page scrolls.
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
  /** Fired when a subject's inline edit is saved, with that subject's id and the new label/description. */
  editSubject: [subjectId: string, changes: { label: string; description: string }]
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
const showAddSubjectModal = ref(false)

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

function handleAddSubject(subject: { label: string; key: string }) {
  showAddSubjectModal.value = false
  emit('addSubject', subject)
}
</script>

<template>
  <div class="session-layout">
    <header class="session-layout__header">
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
      <NTabs class="session-layout__panel" type="line" default-value="subjects" animated>
        <NTabPane name="subjects" tab="Subjects">
          <section class="session-layout__subjects">
            <SubjectCard
              v-for="entry in subjects"
              :key="entry.subject.id"
              :subject="entry.subject"
              :intervals="entry.intervals"
              :duration="duration"
              :active="entry.active"
              :disabled="!playing"
              :playing="playing"
              @toggle="emit('toggleSubject', entry.subject.id)"
              @remove="emit('removeSubject', entry.subject.id)"
              @edit="(changes) => emit('editSubject', entry.subject.id, changes)"
            />
            <NButton
              class="session-layout__add-subject"
              dashed
              block
              @click="showAddSubjectModal = true"
            >
              + Add subject
            </NButton>
          </section>
        </NTabPane>
        <NTabPane name="log" tab="Log">
          <SessionLog :entries="reportEntries" />
        </NTabPane>
        <NTabPane name="table" tab="Table">
          <SessionTable :entries="reportEntries" :duration="duration" />
        </NTabPane>
      </NTabs>
    </div>
    <NModal
      class="session-layout__add-subject-modal"
      preset="card"
      title="Add subject"
      style="width: 360px"
      :show="showAddSubjectModal"
      @update:show="(value) => (showAddSubjectModal = value)"
    >
      <SubjectForm
        :label="newSubjectLabel"
        :key-value="newSubjectKey"
        :existing-keys="existingKeys"
        @update:label="emit('update:newSubjectLabel', $event)"
        @update:key-value="emit('update:newSubjectKey', $event)"
        @submit="handleAddSubject"
      />
    </NModal>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-layout {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-lg;
  padding: vars.$spacing-lg;
  flex: 1;
  min-height: 0;

  &__header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: vars.$spacing-md;
    flex: none;
  }

  &__main {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-template-rows: minmax(0, 1fr);
    gap: vars.$spacing-lg;
    flex: 1;
    min-height: 0;
  }

  &__video {
    display: flex;
    flex-direction: column;
    min-height: 0;

    :deep(.video-player) {
      flex: 1;
      min-height: 0;
    }
  }

  &__video-details {
    flex: none;
    margin: vars.$spacing-sm 0 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    padding: vars.$spacing-md;
    background: vars.$surface-color;
    border-radius: 8px;
    box-shadow: vars.$surface-shadow;
    overflow: hidden;

    :deep(.n-tabs-nav) {
      flex: none;
    }

    :deep(.n-tabs-pane-wrapper) {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
  }

  &__subjects {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: vars.$spacing-sm;
    align-items: start;
  }

  &__add-subject {
    grid-column: span 2;
  }
}
</style>
