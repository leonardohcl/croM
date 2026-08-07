<script setup lang="ts">
import { ref } from 'vue'
import HomePage from '@/pages/HomePage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'
import MobileNotice from '@/components/organisms/MobileNotice/MobileNotice.vue'
import AppNavbar, { type AppPage } from '@/components/organisms/AppNavbar/AppNavbar.vue'
import { useIsDesktop } from '@/composables/useIsDesktop'
import { useSessionStore } from '@/stores/session'

const isDesktop = useIsDesktop()
const store = useSessionStore()
const page = ref<AppPage>('session')

function handleNewSession() {
  store.resetToDefaults()
  page.value = 'session'
}
</script>

<template>
  <div class="app">
    <template v-if="isDesktop">
      <AppNavbar :active="page" @navigate="(value) => (page = value)" @new-session="handleNewSession" />
      <HomePage v-if="page === 'session'" class="app__content" />
      <HistoryPage v-else class="app__content" />
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
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }
}
</style>
