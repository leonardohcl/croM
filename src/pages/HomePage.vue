<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useSessionStore } from '@/stores/session'
import { useKeybinds } from '@/composables/useKeybinds'
import { loadSession, useSessionPersistence } from '@/composables/useSessionPersistence'
import { storageKey } from '@/utils/storageKey'
import { toCsv } from '@/utils/csv'
import { toJson } from '@/utils/json'
import { downloadFile } from '@/utils/download'
import { upsertSessionHistoryEntry } from '@/utils/sessionHistory'
import SessionLayout from '@/components/templates/SessionLayout/SessionLayout.vue'
import ResumeDialog from '@/components/organisms/ResumeDialog/ResumeDialog.vue'
import type { SessionSnapshot } from '@/types'

const store = useSessionStore()

const currentTime = ref(0)
const playing = ref(false)
const newSubjectLabel = ref('')
const newSubjectKey = ref('')
const autoSaveHistory = ref(false)
const historyEntryId = ref<string | null>(null)

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

onMounted(() => {
  if (store.subjects.length === 0) store.resetToDefaults()
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

/** A new video (or a reset back to none) starts a fresh session, so it gets its own history entry. */
watch(currentStorageKey, () => {
  historyEntryId.value = null
})

function saveToHistory() {
  if (!store.video) return
  if (!historyEntryId.value) historyEntryId.value = crypto.randomUUID()
  upsertSessionHistoryEntry(historyEntryId.value, snapshotOf())
}

watch(
  () => snapshotOf(),
  () => {
    if (autoSaveHistory.value) saveToHistory()
  },
  { deep: true },
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

  store.resetToDefaults()
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

function handleExportCsv() {
  downloadFile(toCsv(snapshotOf()), 'crom-session.csv', 'text/csv')
}

function handleExportJson() {
  downloadFile(toJson(snapshotOf()), 'crom-session.json', 'application/json')
}

function handleReset() {
  store.resetToDefaults()
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
      :auto-save-history="autoSaveHistory"
      @export-csv="handleExportCsv"
      @export-json="handleExportJson"
      @save-history="saveToHistory"
      @update:auto-save-history="(value) => (autoSaveHistory = value)"
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
  height: 100%;
  min-height: 0;
}
</style>
