import { describe, expect, it } from 'vitest'
import { calculateDashboardStats, getUpcomingAssignments } from '../src/domain/assignment'
import type { Assignment, AssignmentStatus, Course } from '../src/domain/types'

const courses: Course[] = [
  { id: 'c1', name: 'Web', teacher: '', credits: 3, color: '#000000', createdAt: '', updatedAt: '' },
  { id: 'c2', name: 'Data', teacher: '', credits: 3, color: '#000000', createdAt: '', updatedAt: '' },
]
const item = (id: string, status: AssignmentStatus, dueDate: string): Assignment => ({ id, courseId: 'c1', title: id, description: '', dueDate, status, createdAt: '', updatedAt: '' })

describe('dashboard statistics', () => {
  const assignments = [
    item('todo-late', 'todo', '2026-09-19T00:00:00.000Z'),
    item('doing', 'in_progress', '2026-09-21T00:00:00.000Z'),
    item('done-late', 'completed', '2026-09-18T00:00:00.000Z'),
  ]

  it('đếm tổng, từng trạng thái và bài quá hạn chính xác', () => {
    expect(calculateDashboardStats(courses, assignments, new Date('2026-09-20T00:00:00.000Z'))).toEqual({ courses: 2, assignments: 3, todo: 1, inProgress: 1, completed: 1, overdue: 1 })
  })

  it('chỉ lấy bài chưa hoàn thành và xếp deadline gần nhất', () => {
    expect(getUpcomingAssignments(assignments).map((entry) => entry.id)).toEqual(['todo-late', 'doing'])
  })
})
