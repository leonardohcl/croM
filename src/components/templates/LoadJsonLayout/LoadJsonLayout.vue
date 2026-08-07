<script setup lang="ts">
import { computed, ref } from 'vue'
import { NAlert, NButton, NEmpty } from 'naive-ui'
import SessionSnapshotView from '@/components/organisms/SessionSnapshotView/SessionSnapshotView.vue'
import type { SessionSnapshot } from '@/types'

/**
 * Lets the user load an exported session JSON file and view it read-only.
 * Purely presentational — file reading and parsing is owned by the page.
 */
const props = defineProps<{
  /** The parsed session to display, or null while none is loaded. */
  snapshot: SessionSnapshot | null
  /** Error message to show if the last selected file failed to load, if any. */
  error: string
}>()

const emit = defineEmits<{
  /** Fired when the user picks a file to load. */
  fileSelected: [file: File]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)

const videoName = computed(() => props.snapshot?.video?.name ?? 'Untitled session')

function openFilePicker() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (file) emit('fileSelected', file)
}
</script>

<template>
  <div class="load-json-layout">
    <div class="load-json-layout__header">
      <h1 class="load-json-layout__title">Load session JSON</h1>
      <input
        ref="fileInputRef"
        class="load-json-layout__file-input"
        type="file"
        accept="application/json,.json"
        @change="handleFileChange"
      />
      <NButton size="small" type="primary" @click="openFilePicker">Choose JSON file</NButton>
    </div>
    <NAlert v-if="error" type="error" :title="error" closable />
    <div class="load-json-layout__main">
      <NEmpty v-if="!snapshot" description="No session loaded yet." class="load-json-layout__empty" />
      <template v-else>
        <p class="load-json-layout__name">{{ videoName }}</p>
        <SessionSnapshotView class="load-json-layout__view" :snapshot="snapshot" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.load-json-layout {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-md;
  height: 100%;
  min-height: 0;
  padding: vars.$spacing-lg;

  &__header {
    display: flex;
    align-items: center;
    gap: vars.$spacing-md;
    flex: none;
  }

  &__title {
    margin: 0;
    font-size: 1.25rem;
    flex: 1;
  }

  &__file-input {
    display: none;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: vars.$spacing-md;
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: vars.$spacing-md;
    background: vars.$surface-color;
    border-radius: 8px;
    box-shadow: vars.$surface-shadow;
    overflow: hidden;
  }

  &__name {
    margin: 0;
    font-weight: 600;
    flex: none;
  }

  &__view {
    flex: 1;
    min-height: 0;
  }

  &__empty {
    margin-top: vars.$spacing-lg;
  }
}
</style>
