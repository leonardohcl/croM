import { onBeforeUnmount, onMounted, ref } from 'vue'

export const DESKTOP_MIN_WIDTH_QUERY = '(min-width: 1024px)'

/**
 * Reactively tracks whether the viewport currently matches desktop width. croM relies on
 * keyboard shortcuts and a dense layout that don't translate to mobile, so this gates
 * access rather than only checking once on load, since resizing (e.g. devtools responsive
 * mode) should react live too.
 */
export function useIsDesktop() {
  const mediaQuery = window.matchMedia(DESKTOP_MIN_WIDTH_QUERY)
  const isDesktop = ref(mediaQuery.matches)

  function handleChange(event: MediaQueryListEvent) {
    isDesktop.value = event.matches
  }

  onMounted(() => mediaQuery.addEventListener('change', handleChange))
  onBeforeUnmount(() => mediaQuery.removeEventListener('change', handleChange))

  return isDesktop
}
