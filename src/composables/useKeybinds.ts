import { onBeforeUnmount, onMounted } from 'vue'
import type { Subject } from '@/types'

const TEXT_INPUT_TAGS = ['INPUT', 'TEXTAREA']

/**
 * Binds a global keydown listener that matches the pressed key against each subject's
 * bound key and invokes `onToggle` with that subject's id. Ignores keydown events that
 * originate from text inputs, so typing in a form field doesn't accidentally toggle a
 * timer. `subjects` is a getter so the latest list is read on every keydown.
 */
export function useKeybinds(subjects: () => Subject[], onToggle: (subjectId: string) => void) {
  function handleKeydown(event: KeyboardEvent) {
    const target = event.target as HTMLElement | null
    if (target && TEXT_INPUT_TAGS.includes(target.tagName)) return

    const subject = subjects().find((candidate) => candidate.key === event.key)
    if (subject) onToggle(subject.id)
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
}
