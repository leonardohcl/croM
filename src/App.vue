<script setup lang="ts">
import HomePage from '@/pages/HomePage.vue'
import MobileNotice from '@/components/organisms/MobileNotice/MobileNotice.vue'
import AppNavbar from '@/components/organisms/AppNavbar/AppNavbar.vue'
import { useIsDesktop } from '@/composables/useIsDesktop'

const isDesktop = useIsDesktop()
</script>

<template>
  <div class="app">
    <template v-if="isDesktop">
      <AppNavbar />
      <HomePage class="app__content" />
    </template>
    <MobileNotice v-else />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__content {
    flex: 1;
    min-height: 0;
  }
}
</style>
