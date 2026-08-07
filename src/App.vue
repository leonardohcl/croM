<script setup lang="ts">
import { NButton } from 'naive-ui'
</script>

<template>
  <main class="app">
    <h1>croM</h1>
    <p>Multi-timer video interval tracking tool — scaffold in progress.</p>
    <NButton>Naive UI is wired up</NButton>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.app {
  padding: vars.$spacing-lg;
}
</style>
