import { describe, expect, it } from 'vitest'
import {
  createBackupEnvelope,
  migrateBackupPayload,
  sanitizeAppData,
  validateAssignment,
  validateCourse,
  validateGpaEntry,
  validateSchedule,
} from './schemaValidation'
import type { AppData } from '../types'

describe('schemaValidation and data migration', () => {
  const sampleAppData: AppData = {
    courses: [
      { id: 'c1', name: 'Toán cao cấp', teacher: 'Thầy Bình', credits: 4, color: '#6558d3' },
      { id: 'c2', name: 'Vật lý đại cương', teacher: 'Cô Hoa', credits: 3, color: '#e15c8b' },
    ],
    schedules: [
      { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A101' },
    ],
    assignments: [
      { id: 'a1', courseId: 'c1', title: 'Bài tập 1', description: 'Giải đề', dueDate: '2026-10-01T23:59', status: 'todo' },
    ],
    gpaEntries: [
      { id: 'g1', courseId: 'c1', expectedGrade: 8.5, credits: 4 },
    ],
  }

  describe('Entity validators', () => {
    it('validates a valid course and fills default fields if optional ones missing', () => {
      const valid = validateCourse({ id: 'c1', name: 'Toán' })
      expect(valid).not.toBeNull()
      expect(valid?.teacher).toBe('')
      expect(valid?.credits).toBe(3)
      expect(valid?.color).toBe('#6558d3')
    })

    it('rejects a course with missing id or empty name', () => {
      expect(validateCourse({ id: '', name: 'Toán' })).toBeNull()
      expect(validateCourse({ id: 'c1', name: '   ' })).toBeNull()
      expect(validateCourse(null)).toBeNull()
    })

    it('validates a schedule and enforces time format and course reference', () => {
      const validCourseIds = new Set(['c1'])
      const valid = validateSchedule({
        id: 's1',
        courseId: 'c1',
        dayOfWeek: 3,
        startTime: '09:00',
        endTime: '11:00',
        room: 'B201',
      }, validCourseIds)
      expect(valid).not.toBeNull()
      expect(valid?.dayOfWeek).toBe(3)

      // Inexistent course
      expect(validateSchedule({ id: 's2', courseId: 'cx', dayOfWeek: 2, startTime: '08:00', endTime: '10:00' }, validCourseIds)).toBeNull()
      // Invalid time format
      expect(validateSchedule({ id: 's3', courseId: 'c1', dayOfWeek: 2, startTime: '8h', endTime: '10h' }, validCourseIds)).toBeNull()
      // Invalid dayOfWeek
      expect(validateSchedule({ id: 's4', courseId: 'c1', dayOfWeek: 8, startTime: '08:00', endTime: '10:00' }, validCourseIds)).toBeNull()
    })

    it('validates assignment and defaults status to todo', () => {
      const validCourseIds = new Set(['c1'])
      const valid = validateAssignment({
        id: 'a1',
        courseId: 'c1',
        title: 'Project',
      }, validCourseIds)
      expect(valid).not.toBeNull()
      expect(valid?.status).toBe('todo')
      expect(valid?.description).toBe('')

      // Foreign key failure
      expect(validateAssignment({ id: 'a2', courseId: 'unknown', title: 'Task' }, validCourseIds)).toBeNull()
    })

    it('validates gpaEntry and clamps expectedGrade', () => {
      const validCourseIds = new Set(['c1'])
      const valid = validateGpaEntry({
        id: 'g1',
        courseId: 'c1',
        expectedGrade: 12,
        credits: 3,
      }, validCourseIds)
      expect(valid).not.toBeNull()
      expect(valid?.expectedGrade).toBe(10) // clamped to 10
    })
  })

  describe('sanitizeAppData', () => {
    it('cleans up corrupted data, strips nulls and orphaned records', () => {
      const corrupted = {
        courses: [
          null,
          { id: 'c1', name: 'Lập trình C' },
          { id: '', name: 'Bad course' },
        ],
        schedules: [
          { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
          { id: 's2', courseId: 'c-orphan', dayOfWeek: 3, startTime: '08:00', endTime: '10:00' }, // orphan
        ],
        assignments: [
          { id: 'a1', courseId: 'c1', title: 'Assignment 1', dueDate: '2026-10-10' },
          { id: 'a2', courseId: 'c-orphan', title: 'Orphan Assignment' },
        ],
        gpaEntries: [
          { id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 3 },
          { id: 'g2', courseId: 'c1', expectedGrade: 8, credits: 3 }, // duplicate course for GPA
          { id: 'g3', courseId: 'c-orphan', expectedGrade: 7, credits: 2 },
        ],
      }

      const result = sanitizeAppData(corrupted)
      expect(result.data.courses).toHaveLength(1)
      expect(result.data.courses[0].id).toBe('c1')
      expect(result.data.schedules).toHaveLength(1)
      expect(result.data.assignments).toHaveLength(1)
      expect(result.data.gpaEntries).toHaveLength(1) // duplicate & orphan stripped
      expect(result.issues.length).toBeGreaterThan(0)
    })

    it('handles empty or non-object inputs safely', () => {
      const res = sanitizeAppData(null)
      expect(res.data.courses).toEqual([])
      expect(res.data.schedules).toEqual([])
      expect(res.issues.length).toBeGreaterThan(0)
    })
  })

  describe('createBackupEnvelope and migrateBackupPayload', () => {
    it('creates a compliant version 2 backup envelope', () => {
      const envelope = createBackupEnvelope(sampleAppData)
      expect(envelope.schemaVersion).toBe(2)
      expect(envelope.appVersion).toBe('0.2.0')
      expect(envelope.data.courses).toHaveLength(2)
      expect(new Date(envelope.exportedAt).getTime()).not.toBeNaN()
    })

    it('migrates unversioned v1 data seamlessly to version 2 structure', () => {
      const unversionedData = structuredClone(sampleAppData)
      const migration = migrateBackupPayload(unversionedData)

      expect(migration.success).toBe(true)
      expect(migration.detectedVersion).toBe(1)
      expect(migration.data.courses).toHaveLength(2)
      expect(migration.issues[0]).toContain('unversioned (v1)')
    })

    it('loads and sanitizes valid version 2 envelope', () => {
      const envelope = createBackupEnvelope(sampleAppData)
      const migration = migrateBackupPayload(envelope)

      expect(migration.success).toBe(true)
      expect(migration.detectedVersion).toBe(2)
      expect(migration.data.courses).toHaveLength(2)
    })

    it('rejects completely invalid backup payload', () => {
      const migration = migrateBackupPayload('invalid-string')
      expect(migration.success).toBe(false)
      expect(migration.detectedVersion).toBe(0)
    })
  })
})
