<script setup lang="ts">
import { computed } from 'vue'
import { NModal } from 'naive-ui'
import SessionSnapshotView from '@/components/organisms/SessionSnapshotView/SessionSnapshotView.vue'
import type { SessionSnapshot } from '@/types'

/**
 * Read-only view of an archived session's subjects, log, and table — mirrors the
 * tabs shown while recording, but with no toggling, editing, or removing allowed.
 */
const props = defineProps<{
  /** Whether the modal is visible. */
  show: boolean
  /** The archived session to display, or null while none is selected. */
  snapshot: SessionSnapshot | null
}>()

const emit = defineEmits<{
  /** Fired when the visibility should change, e.g. dismissed. */
  'update:show': [value: boolean]
}>()

const title = computed(() => props.snapshot?.video?.name ?? 'Session')
</script>

<template>
  <NModal
    class="session-view-modal"
    preset="card"
    :title="title"
    style="width: 900px; max-width: 90vw; height: 80vh"
    content-style="display: flex; flex-direction: column; flex: 1; min-height: 0; overflow: hidden;"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
  >
    <SessionSnapshotView :snapshot="snapshot" />
  </NModal>
</template>
