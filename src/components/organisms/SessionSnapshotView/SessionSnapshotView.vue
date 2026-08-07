<script setup lang="ts">
import { computed } from 'vue'
import { NTabPane, NTabs } from 'naive-ui'
import SubjectCard from '@/components/organisms/SubjectCard/SubjectCard.vue'
import SessionLog from '@/components/organisms/SessionLog/SessionLog.vue'
import SessionTable from '@/components/organisms/SessionTable/SessionTable.vue'
import type { SessionSnapshot } from '@/types'

/**
 * Read-only Subjects/Log/Table tabs for a session snapshot — no toggling, editing,
 * or removing allowed. Shared by the history viewer modal and the loaded-JSON page.
 */
const props = defineProps<{
  /** The session to display, or null while none is loaded. */
  snapshot: SessionSnapshot | null
}>()

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
  <NTabs class="session-snapshot-view" type="line" default-value="subjects" animated>
    <NTabPane name="subjects" tab="Subjects">
      <section class="session-snapshot-view__subjects">
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
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.session-snapshot-view {
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

  &__subjects {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: vars.$spacing-sm;
    align-items: start;
  }
}
</style>
