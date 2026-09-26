import { describe, expect, it } from 'vitest'
import { defaultState } from '../src/data/defaultState'
import type { Assignment } from '../src/domain/types'
import { studySpaceReducer } from '../src/state/studySpaceReducer'

const item: Assignment = { id: 'a1', courseId: 'c1', title: 'Bài tập', description: '', dueDate: '2026-09-21T10:00', status: 'todo', createdAt: 'old', updatedAt: 'old' }

describe('assignment CRUD reducer', () => {
  it('thêm, cập nhật và xóa bài tập', () => {
    const added = studySpaceReducer(defaultState, { type: 'assignment/add', payload: item })
    expect(added.assignments).toEqual([item])

    const updated = studySpaceReducer(added, { type: 'assignment/update', payload: { id: item.id, changes: { courseId: 'c1', title: 'Bài mới', description: 'Chi tiết', dueDate: item.dueDate, status: 'in_progress' }, updatedAt: 'new' } })
    expect(updated.assignments[0]).toMatchObject({ title: 'Bài mới', status: 'in_progress', updatedAt: 'new' })

    const removed = studySpaceReducer(updated, { type: 'assignment/delete', payload: { id: item.id } })
    expect(removed.assignments).toEqual([])
  })
})
