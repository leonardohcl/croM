<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useKeybinds } from '@/composables/useKeybinds'
import { loadSession, useSessionPersistence } from '@/composables/useSessionPersistence'
import { storageKey } from '@/utils/storageKey'
import { toCsv } from '@/utils/csv'
import { toJson } from '@/utils/json'
import SessionLayout from '@/components/templates/SessionLayout/SessionLayout.vue'
import ResumeDialog from '@/components/organisms/ResumeDialog/ResumeDialog.vue'
import type { SessionSnapshot } from '@/types'

const DEFAULT_SUBJECTS = [
  { label: 'Subject 1', key: '1' },
  { label: 'Subject 2', key: '2' },
  { label: 'Subject 3', key: '3' },
  { label: 'Subject 4', key: '4' },
]

const store = useSessionStore()

const currentTime = ref(0)
const playing = ref(false)
const newSubjectLabel = ref('')
const newSubjectKey = ref('')

const showResumeDialog = ref(false)
const pendingSnapshot = ref<SessionSnapshot | null>(null)
const pendingVideoName = ref('')

const currentStorageKey = computed(() => (store.video ? storageKey(store.video) : null))

const timerEntries = computed(() =>
  store.subjects.map((subject) => ({
    subject,
    active: store.isActive(subject.id),
    intervals: store.intervals[subject.id] ?? [],
  })),
)

const existingKeys = computed(() => store.subjects.map((subject) => subject.key))

function snapshotOf(): SessionSnapshot {
  return { video: store.video, subjects: store.subjects, intervals: store.intervals }
}

function seedDefaultSubjects() {
  for (const subject of DEFAULT_SUBJECTS) store.addSubject(subject.label, subject.key)
}

onMounted(() => {
  if (store.subjects.length === 0) seedDefaultSubjects()
})

useKeybinds(
  () => store.subjects,
  (subjectId) => {
    if (playing.value) store.toggleSubject(subjectId, currentTime.value)
  },
)

useSessionPersistence(
  () => currentStorageKey.value,
  () => snapshotOf(),
)

function handleFileSelected(file: File) {
  const key = storageKey(file)
  const saved = loadSession(key)

  if (saved) {
    pendingSnapshot.value = saved
    pendingVideoName.value = file.name
    showResumeDialog.value = true
    return
  }

  store.reset()
  seedDefaultSubjects()
  store.setVideo({ name: file.name, size: file.size, lastModified: file.lastModified, duration: 0 })
}

function handleLoadedMetadata(duration: number) {
  store.setVideoDuration(duration)
}

function handleTimeUpdate(time: number) {
  currentTime.value = time
}

function handlePlay() {
  playing.value = true
}

function handlePause() {
  playing.value = false
}

function handleToggleSubject(subjectId: string) {
  if (!playing.value) return
  store.toggleSubject(subjectId, currentTime.value)
}

function handleRemoveSubject(subjectId: string) {
  store.removeSubject(subjectId)
}

function handleEditSubject(subjectId: string, changes: { label: string; description: string }) {
  store.updateSubject(subjectId, changes)
}

function handleResume() {
  if (pendingSnapshot.value) store.loadSnapshot(pendingSnapshot.value)
  showResumeDialog.value = false
  pendingSnapshot.value = null
}

function handleDiscardResume() {
  showResumeDialog.value = false
  pendingSnapshot.value = null
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function handleExportCsv() {
  downloadFile(toCsv(snapshotOf()), 'crom-session.csv', 'text/csv')
}

function handleExportJson() {
  downloadFile(toJson(snapshotOf()), 'crom-session.json', 'application/json')
}

function handleReset() {
  store.reset()
  seedDefaultSubjects()
}

function handleAddSubject(subject: { label: string; key: string }) {
  store.addSubject(subject.label, subject.key)
  newSubjectLabel.value = ''
  newSubjectKey.value = ''
}
</script>

<template>
  <div class="home-page">
    <SessionLayout
      :subjects="timerEntries"
      :toolbar-disabled="!store.video"
      :playing="playing"
      :new-subject-label="newSubjectLabel"
      :new-subject-key="newSubjectKey"
      :existing-keys="existingKeys"
      @export-csv="handleExportCsv"
      @export-json="handleExportJson"
      @reset="handleReset"
      @file-selected="handleFileSelected"
      @loaded-metadata="handleLoadedMetadata"
      @time-update="handleTimeUpdate"
      @play="handlePlay"
      @pause="handlePause"
      @toggle-subject="handleToggleSubject"
      @remove-subject="handleRemoveSubject"
      @edit-subject="handleEditSubject"
      @update:new-subject-label="(value) => (newSubjectLabel = value)"
      @update:new-subject-key="(value) => (newSubjectKey = value)"
      @add-subject="handleAddSubject"
    />
    <ResumeDialog
      :show="showResumeDialog"
      :video-name="pendingVideoName"
      @update:show="(value) => (showResumeDialog = value)"
      @resume="handleResume"
      @discard="handleDiscardResume"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.home-page {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-md;
}
</style>
