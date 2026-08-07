<script setup lang="ts">
import { NFormItem, NInput } from 'naive-ui'
import KeyBadge from '@/components/atoms/KeyBadge.vue'

/**
 * A labeled key-binding field: a single-character text input, a live KeyBadge preview
 * of the current value, and an optional validation message (e.g. a duplicate key).
 */
defineProps<{
  /** Current value of the key field. */
  modelValue: string
  /** Validation error message to display below the field, if any. */
  error?: string
}>()

const emit = defineEmits<{
  /** Fired when the user edits the key value. */
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <NFormItem
    class="subject-key-field"
    :show-label="false"
    :validation-status="error ? 'error' : undefined"
    :feedback="error"
  >
    <div class="subject-key-field__row">
      <NInput
        :value="modelValue"
        :status="error ? 'error' : undefined"
        :maxlength="1"
        placeholder="Key"
        @update:value="(value) => emit('update:modelValue', value)"
      />
      <KeyBadge v-if="modelValue" :key-label="modelValue" />
    </div>
  </NFormItem>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.subject-key-field {
  &__row {
    display: flex;
    align-items: center;
    gap: vars.$spacing-sm;
  }
}
</style>
