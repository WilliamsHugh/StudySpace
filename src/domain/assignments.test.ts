import { describe, expect, it } from 'vitest'
import { getUpcomingAssignments, isOverdue, sortAssignmentsByDeadline, validateAssignment } from './assignments'
import type { Assignment } from '../types'

const base: Assignment = {
  id: 'a1', courseId: 'c1', title: 'Bài tập', description: '', dueDate: '2026-09-20T08:00', status: 'todo',
}

describe('assignment rules', () => {
  it('validates required course, title and deadline', () => {
    expect(validateAssignment({ courseId: '', title: ' ', description: '', dueDate: '', status: 'todo' })).toEqual({
      courseId: 'Vui lòng chọn môn học.', title: 'Tiêu đề là bắt buộc.', dueDate: 'Vui lòng nhập hạn nộp hợp lệ.',
    })
  })

  it('marks unfinished past assignments overdue but never completed ones', () => {
    const now = new Date('2026-09-21T08:00')
    expect(isOverdue(base, now)).toBe(true)
    expect(isOverdue({ ...base, status: 'done' }, now)).toBe(false)
  })

  it('sorts and returns only nearest upcoming unfinished assignments', () => {
    const assignments = [
      { ...base, id: 'late', dueDate: '2026-09-25T08:00' },
      { ...base, id: 'past', dueDate: '2026-09-10T08:00' },
      { ...base, id: 'near', dueDate: '2026-09-22T08:00' },
      { ...base, id: 'done', dueDate: '2026-09-21T09:00', status: 'done' as const },
    ]
    expect(sortAssignmentsByDeadline(assignments).map((item) => item.id)).toEqual(['past', 'done', 'near', 'late'])
    expect(getUpcomingAssignments(assignments, new Date('2026-09-21T08:00'), 2).map((item) => item.id)).toEqual(['near', 'late'])
  })
})
