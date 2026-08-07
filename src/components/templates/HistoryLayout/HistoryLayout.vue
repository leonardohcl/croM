<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NEmpty } from 'naive-ui'
import SessionViewModal from '@/components/organisms/SessionViewModal/SessionViewModal.vue'
import type { SessionHistoryEntry } from '@/types'

/**
 * Session history view: a list of archived sessions as cards (name + date, subject
 * count, and View/export actions), with a read-only viewer modal for the selected
 * entry. Purely presentational — no store or localStorage access.
 */
const props = defineProps<{
  /** Archived sessions to list, most recently saved first. */
  entries: SessionHistoryEntry[]
}>()

const emit = defineEmits<{
  /** Fired when the user requests a CSV export of an entry. */
  exportCsv: [entry: SessionHistoryEntry]
  /** Fired when the user requests a JSON export of an entry. */
  exportJson: [entry: SessionHistoryEntry]
}>()

const showViewModal = ref(false)
const activeEntry = ref<SessionHistoryEntry | null>(null)

function videoName(entry: SessionHistoryEntry): string {
  return entry.snapshot.video?.name ?? 'Untitled session'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString()
}

const cards = computed(() =>
  props.entries.map((entry) => ({
    entry,
    title: `${videoName(entry)} — ${formatDate(entry.savedAt)}`,
    subjectCount: entry.snapshot.subjects.length,
  })),
)

function view(entry: SessionHistoryEntry) {
  activeEntry.value = entry
  showViewModal.value = true
}
</script>

<template>
  <div class="history-layout">
    <h1 class="history-layout__title">Session history</h1>
    <NEmpty v-if="cards.length === 0" description="No sessions saved yet." class="history-layout__empty" />
    <ul v-else class="history-layout__list">
      <li v-for="card in cards" :key="card.entry.id" class="history-layout__card">
        <div class="history-layout__info">
          <p class="history-layout__name">{{ card.title }}</p>
          <p class="history-layout__count">{{ card.subjectCount }} subject{{ card.subjectCount === 1 ? '' : 's' }}</p>
        </div>
        <div class="history-layout__actions">
          <NButton size="small" @click="view(card.entry)">View</NButton>
          <NButton size="small" @click="emit('exportCsv', card.entry)">Export CSV</NButton>
          <NButton size="small" @click="emit('exportJson', card.entry)">Export JSON</NButton>
        </div>
      </li>
    </ul>
    <SessionViewModal
      :show="showViewModal"
      :snapshot="activeEntry?.snapshot ?? null"
      @update:show="(value) => (showViewModal = value)"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.history-layout {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-md;
  height: 100%;
  min-height: 0;
  padding: vars.$spacing-lg;
  overflow-y: auto;

  &__title {
    margin: 0;
    font-size: 1.25rem;
  }

  &__empty {
    margin-top: vars.$spacing-lg;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-sm;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: vars.$spacing-md;
    padding: vars.$spacing-md;
    border: 1px solid vars.$timeline-track-color;
    border-radius: 8px;
    background: vars.$surface-color;
    box-shadow: vars.$surface-shadow;
  }

  &__name {
    margin: 0;
    font-weight: 600;
  }

  &__count {
    margin: 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }

  &__actions {
    display: flex;
    gap: vars.$spacing-sm;
    flex: none;
  }
}
</style>
