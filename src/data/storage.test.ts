import { beforeEach, describe, expect, it } from 'vitest'
import { assignmentRepository, gpaRepository, loadAppData, saveAppData } from './storage'
import type { AppData, Assignment } from '../types'

const empty: AppData = { courses: [], schedules: [], assignments: [], gpaEntries: [] }
const assignment: Assignment = { id: 'a1', courseId: 'c1', title: 'Task', description: '', dueDate: '2026-10-01T10:00', status: 'todo' }

describe('shared storage and assignment CRUD', () => {
  beforeEach(() => localStorage.clear())

  it('creates, updates and removes an assignment immutably', () => {
    const created = assignmentRepository.create(empty, assignment)
    expect(created.assignments).toEqual([assignment])
    const updated = assignmentRepository.update(created, { ...assignment, status: 'done' })
    expect(updated.assignments[0].status).toBe('done')
    expect(assignmentRepository.remove(updated, assignment.id).assignments).toEqual([])
  })


  it('updates the existing GPA entry instead of adding the same course twice', () => {
    const initial: AppData = {
      ...empty,
      gpaEntries: [{ id: 'g1', courseId: 'c1', expectedGrade: 7, credits: 3 }],
    }

    const updated = gpaRepository.upsert(initial, { id: 'new-id', courseId: 'c1', expectedGrade: 9, credits: 4 })

    expect(updated.gpaEntries).toEqual([{ id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 4 }])
  })

  it('collapses legacy duplicate GPA entries for a course when saving it', () => {
    const initial: AppData = {
      ...empty,
      gpaEntries: [
        { id: 'g1', courseId: 'c1', expectedGrade: 7, credits: 3 },
        { id: 'g2', courseId: 'c1', expectedGrade: 8, credits: 3 },
      ],
    }

    const updated = gpaRepository.upsert(initial, { id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 4 })

    expect(updated.gpaEntries).toEqual([{ id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 4 }])
  })

  it('persists all modules under the shared app data key', () => {
    const data = assignmentRepository.create(empty, assignment)
    saveAppData(data)
    expect(loadAppData()).toEqual(data)
  })

  it('falls back safely when storage contains invalid JSON', () => {
    localStorage.setItem('deadline-tracker:data', '{broken')
    expect(loadAppData().courses.length).toBeGreaterThan(0)
  })
})
