<script setup lang="ts">
import { NButton } from 'naive-ui'

/**
 * Toolbar of session-wide actions: export the session as CSV or JSON, or reset it.
 */
defineProps<{
  /** Disables all actions, e.g. when no video/session data is loaded yet. */
  disabled?: boolean
}>()

const emit = defineEmits<{
  /** Fired when the user requests a CSV export. */
  exportCsv: []
  /** Fired when the user requests a JSON export. */
  exportJson: []
  /** Fired when the user requests to reset the session. */
  reset: []
}>()
</script>

<template>
  <div class="app-toolbar">
    <NButton :disabled="disabled" @click="emit('exportCsv')">Export CSV</NButton>
    <NButton :disabled="disabled" @click="emit('exportJson')">Export JSON</NButton>
    <NButton type="error" :disabled="disabled" @click="emit('reset')">Reset</NButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.app-toolbar {
  display: flex;
  gap: vars.$spacing-sm;
}
</style>
