<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NInput, NModal } from 'naive-ui'
import ToggleButton from '@/components/molecules/ToggleButton/ToggleButton.vue'
import IntervalTimeline from '@/components/organisms/IntervalTimeline/IntervalTimeline.vue'
import type { Interval, Subject } from '@/types'

/**
 * A single subject's card in the recording column: its toggle button, an optional
 * description, a timeline of the intervals captured so far, and controls to edit,
 * remove, or collapse the subject. Editing happens inline on the card — the edit
 * button swaps the label and description for input fields until saved or cancelled.
 * Collapsed, the card shrinks to a wide, short tile showing just the name/key and a
 * compact, text-free timeline. The timeline only reflects closed intervals, so it updates
 * once a timer is deactivated rather than animating while it's running. Cards start
 * collapsed and expand on demand.
 */
const props = defineProps<{
  /** The subject/timer this card represents. */
  subject: Subject
  /** Recorded intervals for this subject, in seconds. */
  intervals: Interval[]
  /** Total video duration, in seconds. */
  duration: number
  /** Whether this subject currently has an open interval. */
  active: boolean
  /** Disables the toggle button, e.g. while the video isn't playing. */
  disabled?: boolean
  /** Whether the video is currently playing. Disables editing, removing, and collapsing the subject while true. */
  playing?: boolean
}>()

const emit = defineEmits<{
  /** Fired when the toggle button is clicked. */
  toggle: []
  /** Fired when removal is confirmed — immediately if the subject has no recorded intervals, otherwise after the confirmation dialog is accepted. */
  remove: []
  /** Fired when an in-progress edit is saved, with the new label and description. */
  edit: [changes: { label: string; description: string }]
}>()

const expanded = ref(false)
const editing = ref(false)
const editLabel = ref('')
const editDescription = ref('')
const showRemoveConfirm = ref(false)

const canSaveEdit = computed(() => editLabel.value.trim() !== '')

function toggleExpanded() {
  expanded.value = !expanded.value
  if (!expanded.value) editing.value = false
}

function startEdit() {
  expanded.value = true
  editLabel.value = props.subject.label
  editDescription.value = props.subject.description ?? ''
  editing.value = true
}

function handleRemoveClick() {
  if (props.intervals.length > 0) {
    showRemoveConfirm.value = true
  } else {
    emit('remove')
  }
}

function confirmRemove() {
  showRemoveConfirm.value = false
  emit('remove')
}

function saveEdit() {
  if (!canSaveEdit.value) return
  emit('edit', { label: editLabel.value.trim(), description: editDescription.value.trim() })
  editing.value = false
}

function cancelEdit() {
  editing.value = false
}
</script>

<template>
  <div class="subject-card" :class="{ 'subject-card--collapsed': !expanded }">
    <div class="subject-card__header">
      <ToggleButton
        v-if="!editing"
        class="subject-card__toggle"
        :label="subject.label"
        :key-label="subject.key"
        :active="active"
        :disabled="disabled"
        @toggle="emit('toggle')"
      />
      <NInput
        v-else
        v-model:value="editLabel"
        class="subject-card__edit-label"
        size="small"
        placeholder="Label"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
      />
      <div class="subject-card__actions">
        <NButton
          v-if="!editing"
          class="subject-card__edit"
          size="tiny"
          circle
          quaternary
          :disabled="playing"
          aria-label="Edit subject"
          @click="startEdit"
        >
          ✎
        </NButton>
        <NButton
          class="subject-card__remove"
          size="tiny"
          circle
          quaternary
          type="error"
          :disabled="playing"
          aria-label="Remove subject"
          @click="handleRemoveClick"
        >
          ✕
        </NButton>
        <NButton
          class="subject-card__expand-toggle"
          size="tiny"
          circle
          quaternary
          :disabled="playing"
          :aria-label="expanded ? 'Collapse subject card' : 'Expand subject card'"
          @click="toggleExpanded"
        >
          {{ expanded ? '⤡' : '⤢' }}
        </NButton>
      </div>
    </div>
    <p v-if="expanded && !editing && subject.description" class="subject-card__description">
      {{ subject.description }}
    </p>
    <template v-if="expanded && editing">
      <NInput
        v-model:value="editDescription"
        class="subject-card__edit-description"
        type="textarea"
        size="small"
        placeholder="Description (optional)"
        :autosize="{ minRows: 2, maxRows: 4 }"
        @keyup.esc="cancelEdit"
      />
      <div class="subject-card__edit-actions">
        <NButton
          class="subject-card__save"
          size="tiny"
          type="primary"
          :disabled="!canSaveEdit"
          @click="saveEdit"
        >
          Save
        </NButton>
        <NButton class="subject-card__cancel" size="tiny" quaternary @click="cancelEdit">Cancel</NButton>
      </div>
    </template>
    <IntervalTimeline
      class="subject-card__timeline"
      :duration="duration"
      :intervals="intervals.filter((interval) => interval.end !== null)"
      :tick-count="3"
      :active="active"
      :compact="!expanded"
    />
    <NModal
      class="subject-card__remove-confirm"
      preset="dialog"
      type="warning"
      title="Remove subject?"
      :content="`Remove &quot;${subject.label}&quot;? Its recorded intervals will be lost.`"
      positive-text="Remove"
      negative-text="Cancel"
      :show="showRemoveConfirm"
      @update:show="(value) => (showRemoveConfirm = value)"
      @positive-click="confirmRemove"
      @negative-click="showRemoveConfirm = false"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.subject-card {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;
  padding: vars.$spacing-md;
  border: 1px solid vars.$timeline-track-color;
  border-radius: 8px;
  background: vars.$surface-color;
  box-shadow: vars.$surface-shadow;
  grid-column: span 2;

  &--collapsed {
    position: relative;
    grid-column: span 1;
    aspect-ratio: 2 / 1;
    justify-content: center;
    overflow: hidden;

    .subject-card__header {
      justify-content: center;
    }

    .subject-card__actions {
      position: absolute;
      top: vars.$spacing-sm;
      right: vars.$spacing-sm;
    }

    .subject-card__timeline {
      margin-top: 0;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: vars.$spacing-sm;
  }

  &__toggle {
    flex: 0 1 auto;
    min-width: 0;
  }

  &__edit-label {
    flex: 1 1 auto;
    min-width: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: vars.$spacing-xs;
    flex: 0 0 auto;
  }

  &__description {
    margin: 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }

  &__edit-actions {
    display: flex;
    gap: vars.$spacing-sm;
  }
}
</style>
