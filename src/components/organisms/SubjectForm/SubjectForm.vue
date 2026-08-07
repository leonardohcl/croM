<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NFormItem, NInput } from 'naive-ui'
import SubjectKeyField from '@/components/molecules/SubjectKeyField/SubjectKeyField.vue'

/**
 * Controlled form to add a new subject/timer: a label field and a key-binding field
 * (with duplicate-key validation against already-configured subjects), plus an add
 * button. Purely presentational — the parent owns the label/key input state.
 */
const props = defineProps<{
  /** Current value of the label input. */
  label: string
  /** Current value of the key input. */
  keyValue: string
  /** Keys already bound to other subjects, used to flag duplicates before submitting. */
  existingKeys: string[]
}>()

const emit = defineEmits<{
  /** Fired when the user edits the label input. */
  'update:label': [value: string]
  /** Fired when the user edits the key input. */
  'update:keyValue': [value: string]
  /** Fired when the form is submitted with a valid, non-duplicate label + key. */
  submit: [subject: { label: string; key: string }]
}>()

const keyError = computed(() => {
  if (!props.keyValue) return undefined
  return props.existingKeys.includes(props.keyValue)
    ? `"${props.keyValue}" is already bound to another subject.`
    : undefined
})

const canSubmit = computed(() => props.label.trim() !== '' && props.keyValue !== '' && !keyError.value)

function handleSubmit() {
  if (!canSubmit.value) return
  emit('submit', { label: props.label.trim(), key: props.keyValue })
}
</script>

<template>
  <form class="subject-form" @submit.prevent="handleSubmit">
    <NFormItem label="Label" :show-feedback="false">
      <NInput
        :value="label"
        placeholder="e.g. Grooming"
        @update:value="(value) => emit('update:label', value)"
      />
    </NFormItem>
    <SubjectKeyField
      :model-value="keyValue"
      :error="keyError"
      @update:model-value="(value) => emit('update:keyValue', value)"
    />
    <NButton type="primary" attr-type="submit" :disabled="!canSubmit">Add subject</NButton>
  </form>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.subject-form {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;
  align-items: flex-start;
}
</style>
