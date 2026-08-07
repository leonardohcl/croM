<script setup lang="ts">
import Button from 'primevue/button'
</script>

<template>
  <main class="app">
    <h1>croM</h1>
    <p>Multi-timer video interval tracking tool — scaffold in progress.</p>
    <Button label="PrimeVue is wired up" />
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.app {
  padding: vars.$spacing-lg;
}
</style>
