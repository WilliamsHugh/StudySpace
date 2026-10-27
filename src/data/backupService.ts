import type { AppData, Assignment, Course } from '../types'
import { loadAppData, saveAppData } from './appData'
import { createBackupEnvelope, migrateBackupPayload, sanitizeAppData } from './schemaValidation'

export const UTF8_BOM = '\uFEFF'

/**
 * Thoát ký tự cho một ô dữ liệu trong CSV theo chuẩn RFC 4180
 */
export function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Xuất toàn bộ dữ liệu ứng dụng dưới dạng chuỗi JSON có version envelope
 */
export function exportAppDataAsJson(data: AppData): string {
  const envelope = createBackupEnvelope(data, 2)
  return JSON.stringify(envelope, null, 2)
}

/**
 * Xuất danh sách môn học sang định dạng CSV có BOM UTF-8
 * Cột: ID, Tên môn học, Giảng viên, Số tín chỉ, Mã màu
 */
export function exportCoursesAsCsv(courses: Course[]): string {
  const headers = ['ID', 'Tên môn học', 'Giảng viên', 'Số tín chỉ', 'Mã màu']
  const rows = courses.map((c) => [
    escapeCsvField(c.id),
    escapeCsvField(c.name),
    escapeCsvField(c.teacher),
    escapeCsvField(c.credits),
    escapeCsvField(c.color),
  ].join(','))

  return UTF8_BOM + [headers.join(','), ...rows].join('\r\n')
}

const statusDisplayMap: Record<string, string> = {
  todo: 'Chưa làm',
  'in-progress': 'Đang làm',
  done: 'Hoàn thành',
}

/**
 * Xuất danh sách bài tập sang định dạng CSV có BOM UTF-8
 * Cột: ID, Môn học, Tiêu đề, Hạn nộp, Trạng thái, Mô tả
 */
export function exportAssignmentsAsCsv(assignments: Assignment[], courses: Course[]): string {
  const courseMap = new Map(courses.map((c) => [c.id, c.name]))
  const headers = ['ID', 'Môn học', 'Tiêu đề', 'Hạn nộp', 'Trạng thái', 'Mô tả']

  const rows = assignments.map((a) => {
    const courseName = courseMap.get(a.courseId) ?? 'Môn học đã xóa'
    const statusText = statusDisplayMap[a.status] ?? a.status

    return [
      escapeCsvField(a.id),
      escapeCsvField(courseName),
      escapeCsvField(a.title),
      escapeCsvField(a.dueDate),
      escapeCsvField(statusText),
      escapeCsvField(a.description),
    ].join(',')
  })

  return UTF8_BOM + [headers.join(','), ...rows].join('\r\n')
}

export interface BackupSummary {
  courses: number
  schedules: number
  assignments: number
  gpaEntries: number
}

export interface ParseBackupResult {
  success: boolean
  data?: AppData
  issues: string[]
  error?: string
  summary?: BackupSummary
  detectedVersion?: number
}

/**
 * Đọc chuỗi JSON và xác thực cấu trúc bản sao lưu
 */
export function parseAndValidateBackupFile(jsonString: string): ParseBackupResult {
  if (!jsonString || typeof jsonString !== 'string' || jsonString.trim().length === 0) {
    return {
      success: false,
      issues: [],
      error: 'Tệp sao lưu rỗng hoặc không có nội dung.',
    }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    return {
      success: false,
      issues: [],
      error: 'Tệp sao lưu không đúng định dạng JSON hợp lệ.',
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      issues: [],
      error: 'Nội dung tệp sao lưu phải là một JSON object.',
    }
  }

  // Kiểm tra phiên bản nếu là envelope
  const obj = parsed as Record<string, unknown>
  if ('schemaVersion' in obj && typeof obj.schemaVersion === 'number') {
    if (obj.schemaVersion > 2) {
      return {
        success: false,
        issues: [],
        error: `Bản sao lưu được tạo từ schema phiên bản ${obj.schemaVersion} mới hơn. Vui lòng nâng cấp ứng dụng.`,
        detectedVersion: obj.schemaVersion,
      }
    }
  }

  const migration = migrateBackupPayload(parsed)
  if (!migration.success || migration.data.courses.length === 0) {
    return {
      success: false,
      issues: migration.issues,
      error: 'Tệp sao lưu không chứa dữ liệu môn học hợp lệ nào.',
      detectedVersion: migration.detectedVersion,
    }
  }

  return {
    success: true,
    data: migration.data,
    issues: migration.issues,
    summary: {
      courses: migration.data.courses.length,
      schedules: migration.data.schedules.length,
      assignments: migration.data.assignments.length,
      gpaEntries: migration.data.gpaEntries.length,
    },
    detectedVersion: migration.detectedVersion,
  }
}

export interface RestoreResult {
  success: boolean
  error?: string
}

/**
 * Khôi phục dữ liệu an toàn vào Storage:
 * 1. Đọc và giữ snapshot dữ liệu cũ trong bộ nhớ.
 * 2. Sanitize dữ liệu mới.
 * 3. Ghi vào Storage. Nếu thất bại (QuotaExceeded), rollback dữ liệu cũ.
 */
export function restoreAppDataSafely(
  newData: AppData,
  storage: Storage = localStorage,
): RestoreResult {
  // 1. Snapshot an toàn dữ liệu hiện tại
  let currentSnapshot: AppData
  try {
    currentSnapshot = loadAppData(storage)
  } catch {
    currentSnapshot = { courses: [], schedules: [], assignments: [], gpaEntries: [] }
  }

  // 2. Sanitize dữ liệu mới trước khi ghi
  const sanitized = sanitizeAppData(newData)
  if (sanitized.data.courses.length === 0 && newData.courses.length > 0) {
    return {
      success: false,
      error: 'Dữ liệu khôi phục không hợp lệ.',
    }
  }

  // 3. Thực hiện ghi dữ liệu mới
  const saved = saveAppData(sanitized.data, storage)
  if (!saved) {
    // Rollback lại snapshot cũ nếu có lỗi ghi
    saveAppData(currentSnapshot, storage)
    return {
      success: false,
      error: 'Không thể ghi dữ liệu vào bộ nhớ trình duyệt (hết dung lượng hoặc bị chặn). Đã khôi phục dữ liệu ban đầu.',
    }
  }

  return {
    success: true,
  }
}
