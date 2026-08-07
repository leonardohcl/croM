<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { NButton } from 'naive-ui'

/**
 * Wraps a native `<video>` element with a local file picker: lets the user choose a
 * video file, plays it, and reports duration/current-time changes. Before a file is
 * chosen, shows a dashed placeholder with a "Choose video" button instead of the raw
 * file input; once loaded, the video sits in a rounded, shadowed frame with a
 * "Change video" button below it. The underlying `<input type="file">` stays in the
 * DOM (hidden) so both buttons can trigger it programmatically. DOM/File-API
 * dependent — no Storybook story; covered by Vitest instead.
 */
const emit = defineEmits<{
  /** Fired when the user selects a new video file. */
  fileSelected: [file: File]
  /** Fired once the video's metadata has loaded, with its total duration in seconds. */
  loadedMetadata: [duration: number]
  /** Fired periodically as the video plays, with its current time in seconds. */
  timeUpdate: [currentTime: number]
  /** Fired when playback starts or resumes. */
  play: []
  /** Fired when playback pauses or the video ends. */
  pause: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const videoSrc = ref<string | null>(null)

function openFilePicker() {
  fileInputRef.value?.click()
}

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
    <input
      ref="fileInputRef"
      class="video-player__file-input"
      type="file"
      accept="video/*"
      @change="handleFileChange"
    />
    <div v-if="videoSrc" class="video-player__frame">
      <video
        ref="videoRef"
        class="video-player__video"
        :src="videoSrc"
        controls
        @loadedmetadata="handleLoadedMetadata"
        @timeupdate="handleTimeUpdate"
        @play="emit('play')"
        @pause="emit('pause')"
        @ended="emit('pause')"
      />
    </div>
    <div v-else class="video-player__empty">
      <span class="video-player__empty-icon">🎬</span>
      <span class="video-player__empty-text">Choose a video file to get started</span>
      <NButton size="small" type="primary" @click="openFilePicker">Choose video</NButton>
    </div>
    <NButton
      v-if="videoSrc"
      class="video-player__change"
      size="small"
      quaternary
      @click="openFilePicker"
    >
      Change video
    </NButton>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/variables' as vars;

.video-player {
  display: flex;
  flex-direction: column;
  gap: vars.$spacing-sm;
  height: 100%;
  min-height: 0;

  &__file-input {
    display: none;
  }

  &__frame {
    display: flex;
    flex: 1;
    min-height: 0;
    border-radius: 8px;
    overflow: hidden;
    background: #000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }

  &__video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__empty {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: vars.$spacing-sm;
    box-sizing: border-box;
    width: 100%;
    min-height: 0;
    padding: vars.$spacing-lg;
    border: 1px dashed vars.$timeline-track-color;
    border-radius: 8px;
    background: vars.$surface-color;
  }

  &__empty-icon {
    font-size: 2rem;
    line-height: 1;
  }

  &__empty-text {
    margin: 0;
    color: vars.$timeline-tick-color;
    font-size: 0.875rem;
  }

  &__change {
    align-self: flex-start;
  }
}
</style>
