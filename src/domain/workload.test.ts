import { describe, expect, it } from 'vitest'
import { calculateWeeklyWorkload, formatLocalDate, getMondayOfWeek } from './workload'
import type { Assignment, Course, Schedule } from '../types'

describe('Weekly Workload calculation', () => {
  const mockCourses: Course[] = [
    { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hà', credits: 4, color: '#e15c8b' },
  ]

  it('correctly calculates the Monday of the current week', () => {
    // Oct 15, 2026 is a Thursday
    const d = new Date(2026, 9, 15, 12, 0, 0)
    const monday = getMondayOfWeek(d)
    expect(formatLocalDate(monday)).toBe('2026-10-12')
  })

  it('aggregates daily classes and assignments across the 7 days of the week', () => {
    const schedules: Schedule[] = [
      { id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'A1' }, // Monday
      { id: 's2', courseId: 'c2', dayOfWeek: 1, startTime: '13:00', endTime: '15:00', room: 'B2' }, // Monday
      { id: 's3', courseId: 'c1', dayOfWeek: 3, startTime: '09:00', endTime: '11:00', room: 'C3' }, // Wednesday
    ]

    const assignments: Assignment[] = [
      // Due Monday Oct 12, 2026
      { id: 'a1', courseId: 'c1', title: 'Bài 1', description: '', dueDate: '2026-10-12T23:59', status: 'todo' },
      // Due Friday Oct 16, 2026
      { id: 'a2', courseId: 'c2', title: 'Bài 2', description: '', dueDate: '2026-10-16T17:00', status: 'done' },
    ]

    const refDate = new Date(2026, 9, 14, 8, 0, 0) // Wednesday Oct 14
    const summary = calculateWeeklyWorkload(schedules, assignments, mockCourses, refDate)

    expect(summary.days).toHaveLength(7)
    expect(summary.totalClasses).toBe(3)
    expect(summary.totalAssignments).toBe(2)

    // Monday has 2 classes + 1 assignment = 3 total -> Heavy (Bận rộn)
    const monday = summary.days[0]
    expect(monday.dayName).toBe('Thứ Hai')
    expect(monday.classes).toHaveLength(2)
    expect(monday.assignments).toHaveLength(1)
    expect(monday.totalItems).toBe(3)
    expect(monday.level).toBe('heavy')
    expect(monday.statusLabel).toBe('Bận rộn')

    // Tuesday has 0 items -> Light (Rảnh rỗi)
    const tuesday = summary.days[1]
    expect(tuesday.totalItems).toBe(0)
    expect(tuesday.level).toBe('light')
    expect(tuesday.statusLabel).toBe('Rảnh rỗi')

    // Friday has 1 assignment -> Moderate (Vừa phải)
    const friday = summary.days[4]
    expect(friday.totalItems).toBe(1)
    expect(friday.level).toBe('moderate')
    expect(friday.statusLabel).toBe('Vừa phải')

    // Peak day should be Monday
    expect(summary.peakDay?.dayName).toBe('Thứ Hai')
  })
})
