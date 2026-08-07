import type { SessionSnapshot } from '@/types'

const HEADER = ['Subject', 'Key', 'Start (s)', 'End (s)', 'Duration (s)']

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/** Serializes a session into a CSV string: one row per recorded interval, across all subjects. */
export function toCsv(snapshot: SessionSnapshot): string {
  const rows: string[][] = [HEADER]

  for (const subject of snapshot.subjects) {
    const intervals = snapshot.intervals[subject.id] ?? []
    for (const interval of intervals) {
      const isClosed = interval.end !== null
      rows.push([
        subject.label,
        subject.key,
        String(interval.start),
        isClosed ? String(interval.end) : '',
        isClosed ? String((interval.end as number) - interval.start) : '',
      ])
    }
  }

  return rows.map((row) => row.map(escapeCsvField).join(',')).join('\n')
}
