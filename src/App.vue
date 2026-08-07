<script setup lang="ts">
import { ref } from 'vue'
import HomePage from '@/pages/HomePage.vue'
import HistoryPage from '@/pages/HistoryPage.vue'
import LoadJsonPage from '@/pages/LoadJsonPage.vue'
import MobileNotice from '@/components/organisms/MobileNotice/MobileNotice.vue'
import AboutModal from '@/components/organisms/AboutModal/AboutModal.vue'
import HowToUseModal from '@/components/organisms/HowToUseModal/HowToUseModal.vue'
import AppNavbar, { type AppPage } from '@/components/organisms/AppNavbar/AppNavbar.vue'
import { useIsDesktop } from '@/composables/useIsDesktop'
import { useSessionStore } from '@/stores/session'

const isDesktop = useIsDesktop()
const store = useSessionStore()
const page = ref<AppPage>('session')
const showAbout = ref(false)
const showHowToUse = ref(false)

function handleNewSession() {
  store.resetToDefaults()
  page.value = 'session'
}
</script>

<template>
  <div class="app">
    <template v-if="isDesktop">
      <AppNavbar
        :active="page"
        @navigate="(value) => (page = value)"
        @new-session="handleNewSession"
        @open-how-to-use="showHowToUse = true"
        @open-about="showAbout = true"
      />
      <HomePage v-if="page === 'session'" class="app__content" />
      <HistoryPage v-else-if="page === 'history'" class="app__content" />
      <LoadJsonPage v-else class="app__content" />
    </template>
    <MobileNotice v-else />
    <AboutModal v-model:show="showAbout" />
    <HowToUseModal v-model:show="showHowToUse" />
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
