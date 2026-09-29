import { describe, expect, it } from 'vitest'
import { defaultState } from '../src/data/defaultState'
import { createGradeExpectation } from '../src/domain/gpa'
import type { Course } from '../src/domain/types'
import { studySpaceReducer } from '../src/state/studySpaceReducer'

const course: Course = {
  id: 'course-1', name: 'Lập trình Web', teacher: 'Nguyễn An', credits: 3,
  color: '#6657d9', createdAt: '2026-09-20T00:00:00.000Z', updatedAt: '2026-09-20T00:00:00.000Z',
}

describe('studySpaceReducer Day 3', () => {
  it('thêm, sửa và xóa môn học cùng dữ liệu liên quan', () => {
    const added = studySpaceReducer(defaultState, { type: 'course/add', payload: course })
    const updated = studySpaceReducer(added, {
      type: 'course/update',
      payload: { id: course.id, changes: { name: 'Web nâng cao', teacher: '', credits: 4, color: '#112233' }, updatedAt: 'later' },
    })
    const withGrade = studySpaceReducer(updated, { type: 'grade/upsert', payload: createGradeExpectation(course.id, 9) })
    const withRelatedData = {
      ...withGrade,
      assignments: [{
        id: 'assignment-1', courseId: course.id, title: 'Báo cáo', description: '',
        dueDate: '2099-10-01T08:00', status: 'todo' as const, createdAt: '', updatedAt: '',
      }],
      schedule: [{ id: 'schedule-1', courseId: course.id, dayOfWeek: 2 as const, startTime: '08:00', endTime: '10:00', room: '' }],
    }
    const deleted = studySpaceReducer(withRelatedData, { type: 'course/delete', payload: { id: course.id } })

    expect(updated.courses[0]).toMatchObject({ name: 'Web nâng cao', credits: 4, updatedAt: 'later' })
    expect(deleted.courses).toEqual([])
    expect(deleted.gradeExpectations).toEqual([])
    expect(deleted.assignments).toEqual([])
    expect(deleted.schedule).toEqual([])
  })

  it('giữ đúng một điểm hiệu lực khi nhập cùng môn nhiều lần', () => {
    const first = studySpaceReducer(defaultState, { type: 'grade/upsert', payload: createGradeExpectation(course.id, 9) })
    const second = studySpaceReducer(first, { type: 'grade/upsert', payload: createGradeExpectation(course.id, 7) })

    expect(second.gradeExpectations).toHaveLength(1)
    expect(second.gradeExpectations[0]).toEqual({ courseId: course.id, expectedScore: 7, gradePoint: 3 })
  })

  it('thêm, cập nhật và xóa lịch học', () => {
    const entry = { id: 'schedule-1', courseId: course.id, dayOfWeek: 2 as const, startTime: '08:00', endTime: '10:00', room: 'A1.01' }
    const added = studySpaceReducer(defaultState, { type: 'schedule/add', payload: entry })
    const updated = studySpaceReducer(added, { type: 'schedule/update', payload: { ...entry, room: 'B2.02' } })
    const deleted = studySpaceReducer(updated, { type: 'schedule/delete', payload: { id: entry.id } })

    expect(added.schedule).toEqual([entry])
    expect(updated.schedule[0].room).toBe('B2.02')
    expect(deleted.schedule).toEqual([])
  })
})
