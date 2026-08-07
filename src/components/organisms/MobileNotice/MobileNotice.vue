<script setup lang="ts">
import { NResult } from 'naive-ui'
</script>

<template>
  <div class="mobile-notice">
    <NResult
      status="info"
      title="Desktop only"
      description="croM was built for desktop screens and keyboard shortcuts. Please open this page on a desktop or laptop computer to use it."
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.mobile-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: vars.$spacing-lg;
  text-align: center;
}
</style>
