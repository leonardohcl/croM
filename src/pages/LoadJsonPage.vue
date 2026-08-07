<script setup lang="ts">
import { ref } from 'vue'
import { fromJson } from '@/utils/json'
import LoadJsonLayout from '@/components/templates/LoadJsonLayout/LoadJsonLayout.vue'
import type { SessionSnapshot } from '@/types'

const snapshot = ref<SessionSnapshot | null>(null)
const error = ref('')

async function handleFileSelected(file: File) {
  try {
    snapshot.value = fromJson(await file.text())
    error.value = ''
  } catch {
    snapshot.value = null
    error.value = `Couldn't read "${file.name}" as a session file.`
  }
}
</script>

<template>
  <LoadJsonLayout
    class="load-json-page"
    :snapshot="snapshot"
    :error="error"
    @file-selected="handleFileSelected"
  />
</template>

<style lang="scss" scoped>
.load-json-page {
  height: 100%;
  min-height: 0;
}
</style>
