import { describe, expect, it } from 'vitest'
import {
  filterAndSortAssignments,
  getUpcomingAssignments,
  isOverdue,
  validateAssignment,
} from '../src/domain/assignment'
import type { Assignment, Course } from '../src/domain/types'

const course: Course = {
  id: 'course-1', name: 'Kiểm thử phần mềm', teacher: '', credits: 3,
  color: '#6657d9', createdAt: '', updatedAt: '',
}

const assignment = (overrides: Partial<Assignment> = {}): Assignment => ({
  id: 'assignment-1', courseId: course.id, title: 'Báo cáo', description: '',
  dueDate: '2026-10-01T08:00', status: 'todo', createdAt: '', updatedAt: '',
  ...overrides,
})

describe('assignment rules', () => {
  it('validates required fields and a course that exists', () => {
    expect(validateAssignment({ courseId: '', title: ' ', description: '', dueDate: '', status: 'todo' }, [course])).toEqual({
      courseId: 'Hãy chọn một môn học hợp lệ.',
      title: 'Tên bài tập không được để trống.',
      dueDate: 'Hạn nộp không hợp lệ.',
    })
  })

  it('filters by course and status before sorting nearest deadlines', () => {
    const original = [
      assignment({ id: 'late', dueDate: '2026-10-05T08:00' }),
      assignment({ id: 'completed', dueDate: '2026-10-02T08:00', status: 'completed' }),
      assignment({ id: 'other-course', courseId: 'course-2', dueDate: '2026-10-01T08:00' }),
      assignment({ id: 'near', dueDate: '2026-10-03T08:00' }),
    ]

    const result = filterAndSortAssignments(original, { courseId: course.id, status: 'todo' })

    expect(result.map((item) => item.id)).toEqual(['near', 'late'])
    expect(original.map((item) => item.id)).toEqual(['late', 'completed', 'other-course', 'near'])
  })

  it('treats only unfinished past assignments as overdue and upcoming', () => {
    const now = new Date('2026-10-02T08:00:00+07:00')
    const past = assignment({ id: 'past', dueDate: '2026-10-01T08:00:00+07:00' })
    const completedPast = assignment({ id: 'completed', dueDate: past.dueDate, status: 'completed' })
    const future = assignment({ id: 'future', dueDate: '2026-10-03T08:00:00+07:00' })

    expect(isOverdue(past, now)).toBe(true)
    expect(isOverdue(completedPast, now)).toBe(false)
    expect(getUpcomingAssignments([past, completedPast, future], now)).toEqual([future])
  })
})
