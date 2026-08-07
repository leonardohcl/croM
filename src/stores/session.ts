import { defineStore } from 'pinia'
import type { Interval, SessionSnapshot, Subject, VideoMeta } from '@/types'

export interface SessionState {
  video: VideoMeta | null
  subjects: Subject[]
  intervals: Record<string, Interval[]>
}

function createId(): string {
  return crypto.randomUUID()
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    video: null,
    subjects: [],
    intervals: {},
  }),

  getters: {
    /** Sum of all closed interval durations for a subject, in seconds. Ignores a currently open interval. */
    totalDuration(state) {
      return (subjectId: string): number => {
        const intervals = state.intervals[subjectId] ?? []
        return intervals.reduce((total, interval) => {
          if (interval.end === null) return total
          return total + (interval.end - interval.start)
        }, 0)
      }
    },

    /** Whether a subject currently has an open (unclosed) interval. */
    isActive(state) {
      return (subjectId: string): boolean => {
        const intervals = state.intervals[subjectId] ?? []
        return intervals.some((interval) => interval.end === null)
      }
    },
  },

  actions: {
    setVideo(video: VideoMeta) {
      this.video = video
    },

    addSubject(label: string, key: string) {
      const subject: Subject = { id: createId(), label, key }
      this.subjects.push(subject)
      this.intervals[subject.id] = []
      return subject
    },

    removeSubject(id: string) {
      this.subjects = this.subjects.filter((subject) => subject.id !== id)
      delete this.intervals[id]
    },

    /** Opens a new interval if the subject has none open, otherwise closes the currently open one. */
    toggleSubject(id: string, currentTime: number) {
      const intervals = this.intervals[id]
      if (!intervals) return

      const open = intervals.find((interval) => interval.end === null)
      if (open) {
        open.end = currentTime
      } else {
        intervals.push({ start: currentTime, end: null })
      }
    },

    loadSnapshot(snapshot: SessionSnapshot) {
      this.video = snapshot.video
      this.subjects = snapshot.subjects
      this.intervals = snapshot.intervals
    },

    reset() {
      this.video = null
      this.subjects = []
      this.intervals = {}
    },
  },
})
