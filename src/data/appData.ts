import type { AppData } from '../types'
import { migrateBackupPayload, sanitizeAppData } from './schemaValidation'

export const STORAGE_KEY = 'deadline-tracker:data'

export const demoData: AppData = {
  courses: [
    { id: 'course-web', name: 'Lập trình Web', teacher: 'Nguyễn Minh An', credits: 3, color: '#6558d3' },
    { id: 'course-db', name: 'Cơ sở dữ liệu', teacher: 'Trần Thu Hà', credits: 3, color: '#e15c8b' },
    { id: 'course-ai', name: 'Nhập môn AI', teacher: 'Lê Quốc Bảo', credits: 4, color: '#1f9d8a' },
  ],
  schedules: [
    { id: 'schedule-web', courseId: 'course-web', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A2.04' },
    { id: 'schedule-db', courseId: 'course-db', dayOfWeek: 4, startTime: '13:30', endTime: '15:30', room: 'B1.02' },
    { id: 'schedule-ai', courseId: 'course-ai', dayOfWeek: 6, startTime: '09:00', endTime: '11:30', room: 'Lab 3' },
  ],
  assignments: [
    { id: 'assignment-web', courseId: 'course-web', title: 'Hoàn thiện giao diện responsive', description: 'Kiểm tra desktop và mobile trước khi nộp.', dueDate: '2026-09-19T23:59', status: 'in-progress' },
    { id: 'assignment-db', courseId: 'course-db', title: 'Bài tập chuẩn hóa dữ liệu', description: 'Nộp file PDF kèm mô hình quan hệ.', dueDate: '2026-09-24T17:00', status: 'todo' },
    { id: 'assignment-ai', courseId: 'course-ai', title: 'Ôn tập tìm kiếm heuristic', description: '', dueDate: '2026-09-12T08:00', status: 'done' },
  ],
  gpaEntries: [
    { id: 'gpa-web', courseId: 'course-web', expectedGrade: 8.7, credits: 3 },
    { id: 'gpa-db', courseId: 'course-db', expectedGrade: 7.8, credits: 3 },
  ],
}

export function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false
  const data = value as Partial<AppData>
  return Array.isArray(data.courses)
    && Array.isArray(data.schedules)
    && Array.isArray(data.assignments)
    && Array.isArray(data.gpaEntries)
}

export function loadAppData(storage: Pick<Storage, 'getItem'> = localStorage): AppData {
  try {
    const saved = storage.getItem(STORAGE_KEY)
    if (!saved) return structuredClone(demoData)
    const parsed: unknown = JSON.parse(saved)
    if (!parsed || typeof parsed !== 'object') return structuredClone(demoData)

    // Nếu là payload backup envelope (có schemaVersion), sử dụng migrateBackupPayload
    if ('schemaVersion' in (parsed as Record<string, unknown>)) {
      const migrated = migrateBackupPayload(parsed)
      if (migrated.success) return migrated.data
      return structuredClone(demoData)
    }

    // Sanitize từng record để loại bỏ phần tử hỏng, ngăn crash app ở cấp phần tử
    const sanitized = sanitizeAppData(parsed)
    return sanitized.data
  } catch {
    return structuredClone(demoData)
  }
}

export function saveAppData(data: AppData, storage: Pick<Storage, 'setItem'> = localStorage): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Không thể ghi dữ liệu vào localStorage:', error)
    return false
  }
}
