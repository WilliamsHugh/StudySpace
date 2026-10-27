import { describe, expect, it, vi } from 'vitest'
import {
  escapeCsvField,
  exportAppDataToJson,
  exportAssignmentsToCsv,
  exportCoursesToCsv,
  generateAssignmentsCsvString,
  generateBackupJsonString,
  generateCoursesCsvString,
  getFormattedDate,
} from './exportData'
import type { AppData, Assignment, Course } from '../types'

describe('exportData module', () => {
  const sampleCourses: Course[] = [
    { id: 'c1', name: 'Lập trình Web, React', teacher: 'Thầy "An"', credits: 3, color: '#6558d3' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hoa', credits: 4, color: '#e15c8b' },
  ]

  const sampleAssignments: Assignment[] = [
    {
      id: 'a1',
      courseId: 'c1',
      title: 'Bài tập 1: "State Management"',
      description: 'Làm kỹ phần Context, Redux',
      dueDate: '2026-10-05T23:59',
      status: 'in-progress',
    },
    {
      id: 'a2',
      courseId: 'unknown',
      title: 'Đề án cuối kỳ',
      description: '',
      dueDate: '2026-10-20T23:59',
      status: 'todo',
    },
  ]

  const sampleAppData: AppData = {
    courses: sampleCourses,
    schedules: [],
    assignments: sampleAssignments,
    gpaEntries: [],
  }

  describe('escapeCsvField', () => {
    it('escapes quotes and wraps fields containing commas or quotes', () => {
      expect(escapeCsvField('Hello')).toBe('Hello')
      expect(escapeCsvField('Hello, World')).toBe('"Hello, World"')
      expect(escapeCsvField('He said "Hi"')).toBe('"He said ""Hi"""')
      expect(escapeCsvField('Line 1\nLine 2')).toBe('"Line 1\nLine 2"')
      expect(escapeCsvField(null)).toBe('""')
      expect(escapeCsvField(123)).toBe('123')
    })
  })

  describe('getFormattedDate', () => {
    it('formats date as YYYY-MM-DD correctly', () => {
      const fixedDate = new Date(2026, 9, 1) // 2026-10-01 (0-indexed month)
      expect(getFormattedDate(fixedDate)).toBe('2026-10-01')
    })
  })

  describe('generateBackupJsonString', () => {
    it('generates valid JSON envelope v2 with metadata and data', () => {
      const jsonStr = generateBackupJsonString(sampleAppData)
      const parsed = JSON.parse(jsonStr)

      expect(parsed.schemaVersion).toBe(2)
      expect(parsed.appVersion).toBe('0.2.0')
      expect(parsed.exportedAt).toBeDefined()
      expect(parsed.data.courses).toHaveLength(2)
      expect(parsed.data.courses[0].name).toBe('Lập trình Web, React')
      expect(parsed.data.assignments).toHaveLength(2)
    })
  })

  describe('generateCoursesCsvString', () => {
    it('generates CSV with UTF-8 BOM, headers and escaped fields', () => {
      const csvStr = generateCoursesCsvString(sampleCourses)

      expect(csvStr.charCodeAt(0)).toBe(0xFEFF) // UTF-8 BOM
      expect(csvStr).toContain('ID,Tên môn học,Giảng viên,Số tín chỉ,Mã màu')
      expect(csvStr).toContain('c1,"Lập trình Web, React","Thầy ""An""",3,#6558d3')
      expect(csvStr).toContain('c2,Cơ sở dữ liệu,Cô Hoa,4,#e15c8b')
    })
  })

  describe('generateAssignmentsCsvString', () => {
    it('maps courseId to course name and status to Vietnamese text', () => {
      const csvStr = generateAssignmentsCsvString(sampleAssignments, sampleCourses)

      expect(csvStr.charCodeAt(0)).toBe(0xFEFF) // UTF-8 BOM
      expect(csvStr).toContain('ID,Môn học,Tiêu đề,Hạn nộp,Trạng thái,Mô tả')
      expect(csvStr).toContain('a1')
      expect(csvStr).toContain('Lập trình Web, React')
      expect(csvStr).toContain('Đang làm')
      expect(csvStr).toContain('""State Management""')
      expect(csvStr).toContain('Môn học đã xóa') // for unknown courseId
      expect(csvStr).toContain('Chưa làm')
    })
  })

  describe('export functions triggering download', () => {
    it('triggers file download with correct filename and mime type', () => {
      const fixedDate = new Date(2026, 9, 1)

      const createObjectURLMock = vi.fn().mockReturnValue('blob:dummy-url')
      const revokeObjectURLMock = vi.fn()
      globalThis.URL.createObjectURL = createObjectURLMock
      globalThis.URL.revokeObjectURL = revokeObjectURLMock

      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

      const jsonFile = exportAppDataToJson(sampleAppData, fixedDate)
      expect(jsonFile).toBe('studyspace-backup-2026-10-01.json')
      expect(clickSpy).toHaveBeenCalled()

      const coursesFile = exportCoursesToCsv(sampleCourses, fixedDate)
      expect(coursesFile).toBe('studyspace-courses-2026-10-01.csv')

      const assignmentsFile = exportAssignmentsToCsv(sampleAssignments, sampleCourses, fixedDate)
      expect(assignmentsFile).toBe('studyspace-assignments-2026-10-01.csv')

      clickSpy.mockRestore()
    })
  })
})
