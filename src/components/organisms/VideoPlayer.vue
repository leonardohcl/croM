<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

/**
 * Wraps a native `<video>` element with a local file picker: lets the user choose a
 * video file, plays it, and reports duration/current-time changes. DOM/File-API
 * dependent — no Storybook story; covered by Vitest instead.
 */
const emit = defineEmits<{
  /** Fired when the user selects a new video file. */
  fileSelected: [file: File]
  /** Fired once the video's metadata has loaded, with its total duration in seconds. */
  loadedMetadata: [duration: number]
  /** Fired periodically as the video plays, with its current time in seconds. */
  timeUpdate: [currentTime: number]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const videoSrc = ref<string | null>(null)

function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (videoSrc.value) URL.revokeObjectURL(videoSrc.value)
  videoSrc.value = URL.createObjectURL(file)
  emit('fileSelected', file)
}

function handleLoadedMetadata() {
  if (videoRef.value) emit('loadedMetadata', videoRef.value.duration)
}

function handleTimeUpdate() {
  if (videoRef.value) emit('timeUpdate', videoRef.value.currentTime)
}

/** Reads the video element's current playback time directly, for precise interval timestamps. */
function getCurrentTime(): number {
  return videoRef.value?.currentTime ?? 0
}

defineExpose({ getCurrentTime })

onBeforeUnmount(() => {
  if (videoSrc.value) URL.revokeObjectURL(videoSrc.value)
})
</script>

<template>
  <div class="video-player">
    <input type="file" accept="video/*" @change="handleFileChange" />
    <video
      v-if="videoSrc"
      ref="videoRef"
      class="video-player__video"
      :src="videoSrc"
      controls
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
    />
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.video-player {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;

  &__video {
    width: 100%;
    max-height: 480px;
  }
}
</style>
