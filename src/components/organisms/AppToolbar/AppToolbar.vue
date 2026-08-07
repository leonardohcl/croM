<script setup lang="ts">
import { NButton, NSwitch } from 'naive-ui'

/**
 * Toolbar of session-wide actions: export the session as CSV or JSON, save the
 * current session to history (or toggle auto-saving it on every change), or reset.
 */
defineProps<{
  /** Disables all actions, e.g. when no video/session data is loaded yet. */
  disabled?: boolean
  /** Whether the session is automatically saved to history on every change. */
  autoSaveHistory?: boolean
}>()

const emit = defineEmits<{
  /** Fired when the user requests a CSV export. */
  exportCsv: []
  /** Fired when the user requests a JSON export. */
  exportJson: []
  /** Fired when the user requests to save the current session to history. */
  saveHistory: []
  /** Fired when the auto-save-to-history toggle is flipped. */
  'update:autoSaveHistory': [value: boolean]
  /** Fired when the user requests to reset the session. */
  reset: []
}>()
</script>

<template>
  <div class="app-toolbar">
    <NButton :disabled="disabled" @click="emit('exportCsv')">Export CSV</NButton>
    <NButton :disabled="disabled" @click="emit('exportJson')">Export JSON</NButton>
    <NButton :disabled="disabled" @click="emit('saveHistory')">Save to history</NButton>
    <label class="app-toolbar__auto-save">
      <NSwitch
        :disabled="disabled"
        :value="autoSaveHistory"
        @update:value="(value) => emit('update:autoSaveHistory', value)"
      />
      Auto-save to history
    </label>
    <NButton type="error" :disabled="disabled" @click="emit('reset')">Reset</NButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.app-toolbar {
  display: flex;
  align-items: center;
  gap: vars.$spacing-sm;

  &__auto-save {
    display: flex;
    align-items: center;
    gap: vars.$spacing-xs;
    font-size: 0.875rem;
    color: vars.$timeline-tick-color;
  }
}
</style>
