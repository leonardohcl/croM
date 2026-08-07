<script setup lang="ts">
import { NModal } from 'naive-ui'

/**
 * Prompt shown when a previously-selected video is re-loaded: asks whether to resume
 * the saved session for it or start over.
 */
defineProps<{
  /** Whether the dialog is visible. */
  show: boolean
  /** Name of the video file the saved session belongs to, shown in the prompt. */
  videoName: string
}>()

const emit = defineEmits<{
  /** Fired when the visibility should change (e.g. dismissed without a choice). */
  'update:show': [value: boolean]
  /** Fired when the user chooses to resume the saved session. */
  resume: []
  /** Fired when the user chooses to discard it and start fresh. */
  discard: []
}>()
</script>

<template>
  <NModal
    preset="dialog"
    title="Resume session?"
    :content="`A saved session was found for &quot;${videoName}&quot;. Resume it?`"
    positive-text="Resume"
    negative-text="Start over"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
    @positive-click="emit('resume')"
    @negative-click="emit('discard')"
  />
</template>
