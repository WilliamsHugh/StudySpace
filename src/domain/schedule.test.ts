import { describe, expect, it } from 'vitest'
import { areSchedulesOverlapping, findScheduleConflicts } from './schedule'
import type { Course, Schedule } from '../types'

describe('schedule conflict domain logic', () => {
  const mockCourses: Course[] = [
    { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hà', credits: 4, color: '#e15c8b' },
  ]

  it('detects overlap on the same day when intervals intersect', () => {
    // 08:00 - 10:00 vs 09:00 - 11:00
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
        { dayOfWeek: 2, startTime: '09:00', endTime: '11:00' },
      ),
    ).toBe(true)

    // Complete overlap
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 3, startTime: '08:00', endTime: '10:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '10:00' },
      ),
    ).toBe(true)

    // One contains another
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 4, startTime: '07:00', endTime: '11:00' },
        { dayOfWeek: 4, startTime: '08:00', endTime: '09:30' },
      ),
    ).toBe(true)
  })

  it('does not report conflict for adjacent / touching intervals (border boundary)', () => {
    // 08:00 - 10:00 and 10:00 - 12:00
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
        { dayOfWeek: 2, startTime: '10:00', endTime: '12:00' },
      ),
    ).toBe(false)

    // 13:00 - 15:00 and 11:00 - 13:00
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 2, startTime: '13:00', endTime: '15:00' },
        { dayOfWeek: 2, startTime: '11:00', endTime: '13:00' },
      ),
    ).toBe(false)
  })

  it('does not report conflict for schedules on different days', () => {
    expect(
      areSchedulesOverlapping(
        { dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
        { dayOfWeek: 3, startTime: '08:00', endTime: '10:00' },
      ),
    ).toBe(false)
  })

  it('findScheduleConflicts excludes the candidate itself when editing', () => {
    const existing: Schedule[] = [
      { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A101' },
      { id: 's2', courseId: 'c2', dayOfWeek: 2, startTime: '13:00', endTime: '15:00', room: 'B202' },
    ]

    // Candidate is s1 itself (editing room or keeping time)
    const candidate: Schedule = {
      id: 's1',
      courseId: 'c1',
      dayOfWeek: 2,
      startTime: '08:00',
      endTime: '10:00',
      room: 'A102',
    }

    const conflicts = findScheduleConflicts(candidate, existing, mockCourses)
    expect(conflicts).toHaveLength(0)
  })

  it('findScheduleConflicts returns conflict details with course name and room', () => {
    const existing: Schedule[] = [
      { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A101' },
    ]

    const candidate: Schedule = {
      id: 'new-id',
      courseId: 'c2',
      dayOfWeek: 2,
      startTime: '09:00',
      endTime: '11:00',
      room: 'C303',
    }

    const conflicts = findScheduleConflicts(candidate, existing, mockCourses)
    expect(conflicts).toHaveLength(1)
    expect(conflicts[0].conflictingCourseName).toBe('Lập trình Web')
    expect(conflicts[0].reason).toContain('Trùng giờ với môn "Lập trình Web"')
    expect(conflicts[0].reason).toContain('Phòng A101')
  })
})
