<script setup lang="ts">
import HomePage from '@/pages/HomePage.vue'
import MobileNotice from '@/components/organisms/MobileNotice/MobileNotice.vue'
import { useIsDesktop } from '@/composables/useIsDesktop'

const isDesktop = useIsDesktop()
</script>

<template>
  <HomePage v-if="isDesktop" />
  <MobileNotice v-else />
</template>
