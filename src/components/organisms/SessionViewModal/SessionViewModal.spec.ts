import { afterEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SessionViewModal from './SessionViewModal.vue'
import type { SessionSnapshot } from '@/types'

const snapshot: SessionSnapshot = {
  video: { name: 'clip.mp4', size: 1024, lastModified: 1700000000000, duration: 120 },
  subjects: [{ id: 'a1', label: 'Grooming', key: 'g' }],
  intervals: { a1: [{ start: 0, end: 10 }] },
}

describe('SessionViewModal', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders the video name as the title and the subject when shown', () => {
    mount(SessionViewModal, { props: { show: true, snapshot }, attachTo: document.body })

    expect(document.body.textContent).toContain('clip.mp4')
    expect(document.body.textContent).toContain('Grooming')
  })

  it('hides edit and remove controls on subject cards', () => {
    mount(SessionViewModal, { props: { show: true, snapshot }, attachTo: document.body })

    expect(document.body.querySelector('button.subject-card__edit')).toBeNull()
    expect(document.body.querySelector('button.subject-card__remove')).toBeNull()
  })

  it('renders no subject cards when there is no snapshot', () => {
    mount(SessionViewModal, { props: { show: true, snapshot: null }, attachTo: document.body })

    expect(document.body.querySelector('.subject-card')).toBeNull()
  })
})
