<script setup lang="ts">
import { computed } from 'vue'
import { NModal, NTabPane, NTabs } from 'naive-ui'
import SubjectCard from '@/components/organisms/SubjectCard/SubjectCard.vue'
import SessionLog from '@/components/organisms/SessionLog/SessionLog.vue'
import SessionTable from '@/components/organisms/SessionTable/SessionTable.vue'
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
const duration = computed(() => props.snapshot?.video?.duration ?? 0)

const entries = computed(() => {
  const snapshot = props.snapshot
  if (!snapshot) return []
  return snapshot.subjects.map((subject) => ({
    subject,
    intervals: snapshot.intervals[subject.id] ?? [],
  }))
})
</script>

<template>
  <NModal
    class="session-view-modal"
    preset="card"
    :title="title"
    style="width: 900px; max-width: 90vw; height: 80vh"
    :show="show"
    @update:show="(value) => emit('update:show', value)"
  >
    <NTabs class="session-view-modal__tabs" type="line" default-value="subjects" animated>
      <NTabPane name="subjects" tab="Subjects">
        <section class="session-view-modal__subjects">
          <SubjectCard
            v-for="entry in entries"
            :key="entry.subject.id"
            :subject="entry.subject"
            :intervals="entry.intervals"
            :duration="duration"
            :active="false"
            :disabled="true"
            readonly
          />
        </section>
      </NTabPane>
      <NTabPane name="log" tab="Log">
        <SessionLog :entries="entries" />
      </NTabPane>
      <NTabPane name="table" tab="Table">
        <SessionTable :entries="entries" :duration="duration" />
      </NTabPane>
    </NTabs>
  </NModal>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-view-modal {
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }

  &__tabs {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;

    :deep(.n-tabs-nav) {
      flex: none;
    }

    :deep(.n-tabs-pane-wrapper) {
      flex: 1;
      min-height: 0;
      overflow-y: auto;
    }
  }

  &__subjects {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: vars.$spacing-sm;
    align-items: start;
  }
}
</style>
