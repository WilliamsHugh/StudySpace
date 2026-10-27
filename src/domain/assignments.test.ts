import { describe, expect, it } from 'vitest'
import { filterAssignments, getUpcomingAssignments, isOverdue, parseTags, sortAssignmentsByDeadline, validateAssignment } from './assignments'
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

  it('parses comma-separated tag strings and handles arrays or undefined', () => {
    expect(parseTags('React, Frontend, Web ')).toEqual(['React', 'Frontend', 'Web'])
    expect(parseTags(['React', '  CSS '])).toEqual(['React', 'CSS'])
    expect(parseTags('')).toEqual([])
    expect(parseTags(undefined)).toEqual([])
  })

  it('filters assignments by search query in title, description, or tags (case-insensitive)', () => {
    const list: Assignment[] = [
      { id: '1', courseId: 'c1', title: 'React Hooks', description: 'Học useEffect', dueDate: '2026-10-10T10:00', status: 'todo', tags: ['FE'] },
      { id: '2', courseId: 'c2', title: 'SQL Joins', description: 'INNER JOIN và LEFT JOIN', dueDate: '2026-10-12T10:00', status: 'todo', tags: ['DB'] },
      { id: '3', courseId: 'c1', title: 'Vitest Unit Testing', description: 'Viết test cases', dueDate: '2026-10-14T10:00', status: 'done', priority: 'high', tags: ['Testing', 'FE'] },
    ]

    expect(filterAssignments(list, { searchQuery: 'react' }).map((a) => a.id)).toEqual(['1'])
    expect(filterAssignments(list, { searchQuery: 'USEEFFECT' }).map((a) => a.id)).toEqual(['1'])
    expect(filterAssignments(list, { searchQuery: 'testing' }).map((a) => a.id)).toEqual(['3'])
    expect(filterAssignments(list, { searchQuery: 'FE' }).map((a) => a.id)).toEqual(['1', '3'])
    expect(filterAssignments(list, { searchQuery: 'not-found' })).toEqual([])
  })

  it('combines multi-criteria filtering across course, status, priority, and query', () => {
    const list: Assignment[] = [
      { id: '1', courseId: 'c1', title: 'A', description: '', dueDate: '2026-10-10T10:00', status: 'todo', priority: 'high' },
      { id: '2', courseId: 'c1', title: 'B', description: '', dueDate: '2026-10-11T10:00', status: 'in-progress', priority: 'high' },
      { id: '3', courseId: 'c1', title: 'C', description: '', dueDate: '2026-10-12T10:00', status: 'todo', priority: 'low' },
      { id: '4', courseId: 'c2', title: 'D', description: '', dueDate: '2026-10-13T10:00', status: 'todo', priority: 'high' },
    ]

    const result = filterAssignments(list, {
      courseId: 'c1',
      status: 'todo',
      priority: 'high',
    })
    expect(result.map((a) => a.id)).toEqual(['1'])
  })
})
