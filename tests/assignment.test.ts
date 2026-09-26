import { describe, expect, it } from 'vitest'
import { filterAndSortAssignments, isOverdue, sortByNearestDeadline, validateAssignment } from '../src/domain/assignment'
import type { Assignment, AssignmentStatus, Course } from '../src/domain/types'

const course: Course = { id: 'course-1', name: 'Web', teacher: '', credits: 3, color: '#6657d9', createdAt: '', updatedAt: '' }
const assignment = (id: string, dueDate: string, status: AssignmentStatus = 'todo'): Assignment => ({ id, courseId: course.id, title: id, description: '', dueDate, status, createdAt: '', updatedAt: '' })

describe('assignment rules', () => {
  it('yêu cầu tên, môn học và deadline hợp lệ', () => {
    const errors = validateAssignment({ courseId: 'missing', title: ' ', description: '', dueDate: 'bad', status: 'todo' }, [course])
    expect(errors.title).toBeTruthy()
    expect(errors.courseId).toBeTruthy()
    expect(errors.dueDate).toBeTruthy()
    expect(validateAssignment({ courseId: course.id, title: 'Bài 1', description: '', dueDate: '2026-09-21T10:00', status: 'in_progress' }, [course])).toEqual({})
  })

  it('nhận diện quá hạn nhưng loại trừ bài đã hoàn thành', () => {
    const now = new Date('2026-09-20T12:00:00.000Z')
    expect(isOverdue(assignment('late', '2026-09-19T12:00:00.000Z'), now)).toBe(true)
    expect(isOverdue(assignment('done', '2026-09-19T12:00:00.000Z', 'completed'), now)).toBe(false)
    expect(isOverdue(assignment('future', '2026-09-21T12:00:00.000Z'), now)).toBe(false)
  })

  it('sắp xếp deadline gần nhất mà không làm thay đổi mảng gốc', () => {
    const source = [assignment('later', '2026-09-22T00:00:00.000Z'), assignment('nearest', '2026-09-21T00:00:00.000Z')]
    expect(sortByNearestDeadline(source).map((item) => item.id)).toEqual(['nearest', 'later'])
    expect(source.map((item) => item.id)).toEqual(['later', 'nearest'])
  })

  it('lọc đồng thời theo môn học và từng trạng thái', () => {
    const now = new Date('2026-09-20T12:00:00.000Z')
    const source = [
      assignment('web-todo', '2026-09-22T00:00:00.000Z'),
      { ...assignment('web-progress', '2026-09-21T00:00:00.000Z'), status: 'in_progress' as const },
      { ...assignment('other-progress', '2026-09-19T00:00:00.000Z'), courseId: 'course-2', status: 'in_progress' as const },
      { ...assignment('web-completed', '2026-09-18T00:00:00.000Z'), status: 'completed' as const },
    ]

    expect(filterAndSortAssignments(source, { courseId: course.id, status: 'todo' }, now).map((item) => item.id)).toEqual(['web-todo'])
    expect(filterAndSortAssignments(source, { courseId: course.id, status: 'in_progress' }, now).map((item) => item.id)).toEqual(['web-progress'])
    expect(filterAndSortAssignments(source, { courseId: course.id, status: 'completed' }, now).map((item) => item.id)).toEqual(['web-completed'])
  })

  it('lọc quá hạn, loại bài hoàn thành và vẫn sắp xếp deadline tăng dần', () => {
    const now = new Date('2026-09-20T12:00:00.000Z')
    const source = [
      assignment('late-near', '2026-09-20T10:00:00.000Z'),
      assignment('future', '2026-09-21T00:00:00.000Z'),
      assignment('late-first', '2026-09-18T00:00:00.000Z'),
      assignment('completed-late', '2026-09-17T00:00:00.000Z', 'completed'),
    ]

    expect(filterAndSortAssignments(source, { courseId: 'all', status: 'overdue' }, now).map((item) => item.id)).toEqual(['late-first', 'late-near'])
  })
})
