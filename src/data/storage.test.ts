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

  it('handles corrupted payload with courses: [null] without crashing', () => {
    localStorage.setItem('deadline-tracker:data', JSON.stringify({ courses: [null], schedules: [] }))
    const loaded = loadAppData()
    expect(loaded.courses).toEqual([])
    expect(Array.isArray(loaded.courses)).toBe(true)
  })

  it('filters corrupted elements while preserving valid records in localStorage', () => {
    const raw = {
      courses: [
        null,
        { id: 'c1', name: 'Toán cao cấp', credits: 4, color: '#6558d3' },
        { id: '', name: 'Thiếu ID' },
        { id: 'c2', name: '   ' },
      ],
      schedules: [
        { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
        { id: 's2', courseId: 'nonexistent', dayOfWeek: 3, startTime: '09:00', endTime: '11:00' },
      ],
      assignments: [
        { id: 'a1', courseId: 'c1', title: 'Bài tập 1', dueDate: '2026-10-05T23:59', status: 'todo' },
        null,
      ],
      gpaEntries: [
        { id: 'g1', courseId: 'c1', expectedGrade: 8.5, credits: 4 },
      ],
    }
    localStorage.setItem('deadline-tracker:data', JSON.stringify(raw))
    const loaded = loadAppData()
    expect(loaded.courses).toHaveLength(1)
    expect(loaded.courses[0].id).toBe('c1')
    expect(loaded.schedules).toHaveLength(1)
    expect(loaded.schedules[0].id).toBe('s1')
    expect(loaded.assignments).toHaveLength(1)
    expect(loaded.assignments[0].id).toBe('a1')
    expect(loaded.gpaEntries).toHaveLength(1)
  })

  it('safely handles QuotaExceededError when saving data without uncaught exception', () => {
    const mockStorage = {
      setItem: () => {
        throw new DOMException('QuotaExceededError')
      },
      getItem: () => null,
    }
    const result = saveAppData(empty, mockStorage)
    expect(result).toBe(false)
  })

  it('loads valid version 2 backup envelope from storage correctly', () => {
    const envelope = {
      schemaVersion: 2,
      exportedAt: '2026-10-01T12:00:00.000Z',
      appVersion: '0.2.0',
      data: {
        courses: [{ id: 'c1', name: 'Toán', teacher: 'Thầy A', credits: 3, color: '#6558d3' }],
        schedules: [],
        assignments: [],
        gpaEntries: [],
      },
    }
    localStorage.setItem('deadline-tracker:data', JSON.stringify(envelope))
    const loaded = loadAppData()
    expect(loaded.courses).toHaveLength(1)
    expect(loaded.courses[0].name).toBe('Toán')
  })
})
