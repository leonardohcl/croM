<script setup lang="ts">
import { ref } from 'vue'
import { listSessionHistory } from '@/utils/sessionHistory'
import { toCsv } from '@/utils/csv'
import { toJson } from '@/utils/json'
import { downloadFile } from '@/utils/download'
import HistoryLayout from '@/components/templates/HistoryLayout/HistoryLayout.vue'
import type { SessionHistoryEntry } from '@/types'

const entries = ref<SessionHistoryEntry[]>(listSessionHistory())

function videoName(entry: SessionHistoryEntry): string {
  return entry.snapshot.video?.name ?? 'Untitled session'
}

function handleExportCsv(entry: SessionHistoryEntry) {
  downloadFile(toCsv(entry.snapshot), `${videoName(entry)}.csv`, 'text/csv')
}

function handleExportJson(entry: SessionHistoryEntry) {
  downloadFile(toJson(entry.snapshot), `${videoName(entry)}.json`, 'application/json')
}
</script>

<template>
  <HistoryLayout class="history-page" :entries="entries" @export-csv="handleExportCsv" @export-json="handleExportJson" />
</template>

<style lang="scss" scoped>
.history-page {
  height: 100%;
  min-height: 0;
}
</style>
