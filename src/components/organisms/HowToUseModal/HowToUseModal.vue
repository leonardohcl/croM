<script setup lang="ts">
import { NModal } from 'naive-ui'

/**
 * Static walkthrough of the core session workflow, mirroring the README's
 * "How to use" section.
 */
defineProps<{
  /** Whether the modal is visible. */
  show: boolean
}>()

const emit = defineEmits<{
  /** Fired when the visibility should change (e.g. dismissed). */
  'update:show': [value: boolean]
}>()
</script>

<template>
  <NModal
    class="how-to-use-modal"
    preset="card"
    title="How to use"
    style="width: 480px; max-width: 90vw; max-height: 80vh"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
  >
    <ol>
      <li>
        <strong>Load a video.</strong> On the Session tab, pick a local video file in the player.
        If a saved session already exists for that file, you'll be asked to resume it or start
        over.
      </li>
      <li>
        <strong>Set up subjects.</strong> Four default subjects (keys 1–4) are seeded
        automatically. Use "+ Add subject" to add more. Each card has buttons to edit or remove
        it, plus an expand/collapse icon that just resizes the card — it has no effect on
        recording.
      </li>
      <li>
        <strong>Record.</strong> Play the video, then press a subject's bound key or click its
        toggle button (showing its label and key) to start an interval; press/click again to end
        it. Recording only works while the video is playing.
      </li>
      <li>
        <strong>Check the report.</strong> The Log tab lists every trigger/release event; the
        Table tab shows per-subject intervals and totals.
      </li>
      <li>
        <strong>Save or export.</strong> Use "Save to history" (or "Auto-save to history") to
        keep a copy, and "Export CSV" / "Export JSON" to download the session. "Reset" clears the
        current session.
      </li>
      <li>
        <strong>Revisit past sessions.</strong> The History tab lists saved sessions for
        read-only viewing or export. The Load JSON tab opens a previously exported JSON file.
      </li>
    </ol>
  </NModal>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.how-to-use-modal {
  ol {
    margin: 0;
    padding-left: vars.$spacing-lg;
  }

  li {
    margin-bottom: vars.$spacing-sm;
    line-height: 1.5;

    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(.n-card__content) {
    max-height: 60vh;
    overflow-y: auto;
  }
}
</style>
