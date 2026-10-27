import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  escapeCsvField,
  exportAppDataAsJson,
  exportAssignmentsAsCsv,
  exportCoursesAsCsv,
  parseAndValidateBackupFile,
  restoreAppDataSafely,
  UTF8_BOM,
} from './backupService'
import { loadAppData, saveAppData, STORAGE_KEY } from './appData'
import type { AppData } from '../types'

describe('Data Backup & Recovery Lifecycle Test Suite', () => {
  const fullMockData: AppData = {
    courses: [
      { id: 'c-web', name: 'Lập trình Web, Nâng cao', teacher: 'Nguyễn "Pro" An', credits: 4, color: '#6558d3' },
      { id: 'c-db', name: 'Cơ sở dữ liệu', teacher: 'Trần Thu Hà', credits: 3, color: '#e15c8b' },
    ],
    schedules: [
      { id: 's-web', courseId: 'c-web', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A2.04' },
      { id: 's-db', courseId: 'c-db', dayOfWeek: 4, startTime: '13:30', endTime: '15:30', room: 'B1.02' },
    ],
    assignments: [
      { id: 'a-web', courseId: 'c-web', title: 'Bài tập Web 1', description: 'Ghi chú, có dấu phẩy', dueDate: '2026-10-15T23:59', status: 'in-progress' },
      { id: 'a-db', courseId: 'c-db', title: 'Đồ án DB "Cuối kỳ"', description: 'Mô tả nhiều dòng\nDòng 2', dueDate: '2026-10-20T17:00', status: 'todo' },
      { id: 'a-old', courseId: 'c-web', title: 'Bài tập cũ', description: '', dueDate: '2026-09-01T10:00', status: 'done' },
    ],
    gpaEntries: [
      { id: 'g-web', courseId: 'c-web', expectedGrade: 9.0, credits: 4 },
      { id: 'g-db', courseId: 'c-db', expectedGrade: 8.0, credits: 3 },
    ],
  }

  beforeEach(() => {
    localStorage.clear()
  })

  describe('1. Full JSON Round-Trip across all modules', () => {
    it('exports and restores complete data with envelope schemaVersion 2', () => {
      saveAppData(fullMockData)
      const current = loadAppData()

      // Export JSON
      const jsonString = exportAppDataAsJson(current)
      expect(typeof jsonString).toBe('string')

      const parsedEnvelope = JSON.parse(jsonString)
      expect(parsedEnvelope.schemaVersion).toBe(2)
      expect(parsedEnvelope.appVersion).toBe('0.2.0')
      expect(parsedEnvelope.data.courses).toHaveLength(2)

      // Wipe storage to simulate clean environment
      localStorage.clear()

      // Parse & Validate
      const parseResult = parseAndValidateBackupFile(jsonString)
      expect(parseResult.success).toBe(true)
      expect(parseResult.summary).toEqual({
        courses: 2,
        schedules: 2,
        assignments: 3,
        gpaEntries: 2,
      })

      // Safe restore
      const restoreResult = restoreAppDataSafely(parseResult.data!)
      expect(restoreResult.success).toBe(true)

      // Verify loaded data in storage matches original
      const restored = loadAppData()
      expect(restored.courses).toEqual(fullMockData.courses)
      expect(restored.schedules).toEqual(fullMockData.schedules)
      expect(restored.assignments).toEqual(fullMockData.assignments)
      expect(restored.gpaEntries).toEqual(fullMockData.gpaEntries)
    })
  })

  describe('2. CSV Export specification & escaping', () => {
    it('escapes fields with quotes, commas, and newlines per RFC 4180', () => {
      expect(escapeCsvField('Đơn giản')).toBe('Đơn giản')
      expect(escapeCsvField('Có, dấu phẩy')).toBe('"Có, dấu phẩy"')
      expect(escapeCsvField('Có "ngoặc kép"')).toBe('"Có ""ngoặc kép"""')
      expect(escapeCsvField('Xuống\ndòng')).toBe('"Xuống\ndòng"')
      expect(escapeCsvField(null)).toBe('')
      expect(escapeCsvField(undefined)).toBe('')
    })

    it('exports courses CSV with UTF-8 BOM, headers and valid row formats', () => {
      const csv = exportCoursesAsCsv(fullMockData.courses)
      expect(csv.startsWith(UTF8_BOM)).toBe(true)

      const lines = csv.replace(UTF8_BOM, '').split('\r\n')
      expect(lines[0]).toBe('ID,Tên môn học,Giảng viên,Số tín chỉ,Mã màu')
      expect(lines).toHaveLength(3) // 1 header + 2 courses
      expect(lines[1]).toContain('"Lập trình Web, Nâng cao"')
      expect(lines[1]).toContain('"Nguyễn ""Pro"" An"')
    })

    it('exports assignments CSV with mapped Vietnamese statuses and resolved course names', () => {
      const csv = exportAssignmentsAsCsv(fullMockData.assignments, fullMockData.courses)
      expect(csv.startsWith(UTF8_BOM)).toBe(true)

      const lines = csv.replace(UTF8_BOM, '').split('\r\n')
      expect(lines[0]).toBe('ID,Môn học,Tiêu đề,Hạn nộp,Trạng thái,Mô tả')
      expect(lines).toHaveLength(4) // 1 header + 3 assignments

      // Check Vietnamese status mapping
      expect(csv).toContain('Đang làm')
      expect(csv).toContain('Chưa làm')
      expect(csv).toContain('Hoàn thành')

      // Check multi-line escaping
      expect(csv).toContain('"Đồ án DB ""Cuối kỳ"""')
      expect(csv).toContain('"Mô tả nhiều dòng\nDòng 2"')
    })

    it('resolves course name as "Môn học đã xóa" when courseId is orphaned in assignments CSV', () => {
      const orphanedAssignment = [
        { id: 'a-orphan', courseId: 'non-existent', title: 'Task mồ côi', description: '', dueDate: '2026-10-10', status: 'todo' as const },
      ]
      const csv = exportAssignmentsAsCsv(orphanedAssignment, fullMockData.courses)
      expect(csv).toContain('Môn học đã xóa')
    })
  })

  describe('3. Validation of corrupted and invalid backup files', () => {
    it('rejects corrupted JSON syntax', () => {
      const res = parseAndValidateBackupFile('{ broken: json syntax')
      expect(res.success).toBe(false)
      expect(res.error).toContain('không đúng định dạng JSON')
    })

    it('rejects empty or whitespace-only files', () => {
      expect(parseAndValidateBackupFile('').success).toBe(false)
      expect(parseAndValidateBackupFile('   ').success).toBe(false)
    })

    it('rejects non-object JSON payloads', () => {
      expect(parseAndValidateBackupFile('["array"]').success).toBe(false)
      expect(parseAndValidateBackupFile('12345').success).toBe(false)
      expect(parseAndValidateBackupFile('true').success).toBe(false)
    })

    it('rejects unsupported future schema version (> 2)', () => {
      const futurePayload = JSON.stringify({
        schemaVersion: 99,
        exportedAt: '2029-01-01T00:00:00.000Z',
        data: fullMockData,
      })
      const res = parseAndValidateBackupFile(futurePayload)
      expect(res.success).toBe(false)
      expect(res.error).toContain('phiên bản 99 mới hơn')
    })

    it('rejects backup file containing no valid courses', () => {
      const noCoursesPayload = JSON.stringify({
        schemaVersion: 2,
        data: {
          courses: [],
          schedules: [],
          assignments: [],
          gpaEntries: [],
        },
      })
      const res = parseAndValidateBackupFile(noCoursesPayload)
      expect(res.success).toBe(false)
      expect(res.error).toContain('không chứa dữ liệu môn học hợp lệ')
    })
  })

  describe('4. Referential Integrity & Data Sanitization during import', () => {
    it('strips orphaned schedules, assignments, and duplicate GPA entries', () => {
      const dirtyPayload = JSON.stringify({
        schemaVersion: 2,
        data: {
          courses: [
            { id: 'c1', name: 'Môn Hợp Lệ', credits: 3 },
          ],
          schedules: [
            { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00' },
            { id: 's2', courseId: 'c-orphan', dayOfWeek: 3, startTime: '09:00', endTime: '11:00' }, // orphan
          ],
          assignments: [
            { id: 'a1', courseId: 'c1', title: 'Task 1' },
            { id: 'a2', courseId: 'c-orphan', title: 'Task orphan' }, // orphan
          ],
          gpaEntries: [
            { id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 3 },
            { id: 'g2', courseId: 'c1', expectedGrade: 8, credits: 3 }, // duplicate GPA course
            { id: 'g3', courseId: 'c-orphan', expectedGrade: 7, credits: 3 }, // orphan
          ],
        },
      })

      const res = parseAndValidateBackupFile(dirtyPayload)
      expect(res.success).toBe(true)
      expect(res.data?.courses).toHaveLength(1)
      expect(res.data?.schedules).toHaveLength(1)
      expect(res.data?.assignments).toHaveLength(1)
      expect(res.data?.gpaEntries).toHaveLength(1)
      expect(res.issues.length).toBeGreaterThan(0)
    })

    it('supports backward compatible import of unversioned v1 data', () => {
      // Legacy format without envelope
      const legacyV1Payload = JSON.stringify({
        courses: [{ id: 'c1', name: 'Môn V1', teacher: 'Thầy V1', credits: 3, color: '#6558d3' }],
        schedules: [{ id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: '101' }],
        assignments: [{ id: 'a1', courseId: 'c1', title: 'BTVN 1', description: '', dueDate: '2026-10-01', status: 'todo' }],
        gpaEntries: [{ id: 'g1', courseId: 'c1', expectedGrade: 8.5, credits: 3 }],
      })

      const res = parseAndValidateBackupFile(legacyV1Payload)
      expect(res.success).toBe(true)
      expect(res.detectedVersion).toBe(1)
      expect(res.data?.courses).toHaveLength(1)
    })
  })

  describe('5. Safety Rollback & Storage Quota Handling', () => {
    it('preserves existing localStorage when restoring invalid data', () => {
      saveAppData(fullMockData)
      const initial = loadAppData()

      const invalidPayload = '{ broken json'
      const parseRes = parseAndValidateBackupFile(invalidPayload)
      expect(parseRes.success).toBe(false)

      // Storage remains unchanged
      const current = loadAppData()
      expect(current.courses).toEqual(initial.courses)
    })

    it('rolls back to previous snapshot if storage.setItem throws QuotaExceededError', () => {
      saveAppData(fullMockData)

      // Mock storage that throws QuotaExceededError when saving new data
      let callCount = 0
      const mockStorage: Storage = {
        length: 1,
        clear: vi.fn(),
        getItem: (key) => (key === STORAGE_KEY ? JSON.stringify(fullMockData) : null),
        key: vi.fn(),
        removeItem: vi.fn(),
        setItem: vi.fn((key, value) => {
          callCount++
          if (callCount === 1) {
            // First attempt to write new data throws Quota error
            const err = new Error('QuotaExceededError: DOM Exception 22')
            err.name = 'QuotaExceededError'
            throw err
          }
          // Rollback call should succeed
        }),
      }

      const newData: AppData = {
        courses: [{ id: 'c-new', name: 'New Course', teacher: '', credits: 2, color: '#3978c5' }],
        schedules: [],
        assignments: [],
        gpaEntries: [],
      }

      const restoreResult = restoreAppDataSafely(newData, mockStorage)
      expect(restoreResult.success).toBe(false)
      expect(restoreResult.error).toContain('hết dung lượng hoặc bị chặn')

      // Verify setItem was called twice: 1 failed attempt + 1 rollback attempt with original data
      expect(mockStorage.setItem).toHaveBeenCalledTimes(2)
      expect(mockStorage.setItem).toHaveBeenLastCalledWith(STORAGE_KEY, JSON.stringify(fullMockData))
    })
  })
})
