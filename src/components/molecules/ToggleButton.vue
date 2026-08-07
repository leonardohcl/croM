<script setup lang="ts">
import { NButton } from 'naive-ui'
import KeyBadge from '@/components/atoms/KeyBadge.vue'

/**
 * A subject's on-screen toggle control: shows its label and bound key, and reflects
 * whether its timer currently has an open interval. Clicking it toggles the subject.
 */
defineProps<{
  /** Display label for the subject/behavior. */
  label: string
  /** The keyboard key bound to this subject, shown as a KeyBadge. */
  keyLabel: string
  /** Whether this subject's timer currently has an open interval. */
  active: boolean
}>()

const emit = defineEmits<{
  /** Fired when the button is clicked. */
  toggle: []
}>()
</script>

<template>
  <NButton class="toggle-button" :type="active ? 'success' : 'default'" @click="emit('toggle')">
    <span class="toggle-button__content">
      <span class="toggle-button__label">{{ label }}</span>
      <KeyBadge :key-label="keyLabel" />
    </span>
  </NButton>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.toggle-button {
  &__content {
    display: inline-flex;
    align-items: center;
    gap: vars.$spacing-sm;
  }

  &__label {
    font-weight: 600;
  }
}
</style>
