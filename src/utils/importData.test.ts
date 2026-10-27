import { describe, expect, it } from 'vitest'
import { readJsonFile, validateBackupFileContent } from './importData'
import type { BackupEnvelope } from '../types'

describe('importData module', () => {
  const validEnvelope: BackupEnvelope = {
    schemaVersion: 2,
    exportedAt: '2026-10-01T15:00:00.000Z',
    appVersion: '0.2.0',
    data: {
      courses: [
        { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
      ],
      schedules: [
        { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A1' },
      ],
      assignments: [
        { id: 'a1', courseId: 'c1', title: 'Bài 1', description: 'Chi tiết', dueDate: '2026-10-10', status: 'todo' },
      ],
      gpaEntries: [
        { id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 3 },
      ],
    },
  }

  describe('validateBackupFileContent', () => {
    it('rejects empty or whitespace string', () => {
      const res = validateBackupFileContent('')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('rỗng')

      const res2 = validateBackupFileContent('   ')
      expect(res2.valid).toBe(false)
    })

    it('rejects invalid JSON syntax', () => {
      const res = validateBackupFileContent('{ broken json')
      expect(res.valid).toBe(false)
      expect(res.error).toContain('không đúng định dạng JSON')
    })

    it('rejects JSON primitives and arrays', () => {
      const res = validateBackupFileContent('"just a string"')
      expect(res.valid).toBe(false)

      const res2 = validateBackupFileContent('12345')
      expect(res2.valid).toBe(false)
    })

    it('rejects future schema version greater than 2', () => {
      const future = {
        schemaVersion: 99,
        data: validEnvelope.data,
      }
      const res = validateBackupFileContent(JSON.stringify(future))
      expect(res.valid).toBe(false)
      expect(res.error).toContain('mới hơn ứng dụng hỗ trợ')
    })

    it('rejects completely invalid backup without any valid entities', () => {
      const garbage = {
        courses: [null, {}],
        schedules: ['bad'],
        assignments: [123],
      }
      const res = validateBackupFileContent(JSON.stringify(garbage))
      expect(res.valid).toBe(false)
      expect(res.error).toContain('không chứa bất kỳ dữ liệu')
    })

    it('successfully parses and generates preview for valid Version 2 backup', () => {
      const res = validateBackupFileContent(JSON.stringify(validEnvelope))
      expect(res.valid).toBe(true)
      expect(res.preview).toBeDefined()
      expect(res.preview?.version).toBe(2)
      expect(res.preview?.coursesCount).toBe(1)
      expect(res.preview?.schedulesCount).toBe(1)
      expect(res.preview?.assignmentsCount).toBe(1)
      expect(res.preview?.gpaCount).toBe(1)
      expect(res.preview?.exportedAt).toBe('2026-10-01T15:00:00.000Z')
    })

    it('successfully migrates and parses unversioned legacy v1 data', () => {
      const legacyData = {
        courses: [
          { id: 'c1', name: 'Nhập môn AI', credits: 4, color: '#1f9d8a' },
        ],
        schedules: [],
        assignments: [],
      }
      const res = validateBackupFileContent(JSON.stringify(legacyData))
      expect(res.valid).toBe(true)
      expect(res.preview?.version).toBe(1)
      expect(res.preview?.coursesCount).toBe(1)
      expect(res.preview?.issues.length).toBeGreaterThan(0)
    })

    it('strips corrupted records and records issues while keeping valid ones', () => {
      const mixed = {
        schemaVersion: 2,
        data: {
          courses: [
            null,
            { id: 'c1', name: 'Toán' },
            { id: '', name: 'Vô danh' },
          ],
          schedules: [],
          assignments: [],
          gpaEntries: [],
        },
      }
      const res = validateBackupFileContent(JSON.stringify(mixed))
      expect(res.valid).toBe(true)
      expect(res.preview?.coursesCount).toBe(1)
      expect(res.preview?.data.courses[0].id).toBe('c1')
      expect(res.preview?.issues.length).toBeGreaterThan(0)
    })
  })

  describe('readJsonFile', () => {
    it('reads File content as text using FileReader', async () => {
      const content = JSON.stringify(validEnvelope)
      const file = new File([content], 'backup.json', { type: 'application/json' })

      const text = await readJsonFile(file)
      expect(text).toBe(content)
    })
  })
})
