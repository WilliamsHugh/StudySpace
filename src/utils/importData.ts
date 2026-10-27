import { migrateBackupPayload } from '../data/schemaValidation'
import type { AppData } from '../types'

export interface ImportPreview {
  version: number
  exportedAt?: string
  appVersion?: string
  coursesCount: number
  schedulesCount: number
  assignmentsCount: number
  gpaCount: number
  issues: string[]
  data: AppData
}

export interface ImportValidationResult {
  valid: boolean
  error?: string
  preview?: ImportPreview
}

/**
 * Đọc nội dung tệp tin JSON tải lên từ phía người dùng dưới dạng văn bản.
 */
export function readJsonFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Không thể đọc định dạng văn bản của tệp.'))
      }
    }
    reader.onerror = () => reject(new Error('Có lỗi xảy ra khi đọc tệp tin.'))
    reader.readAsText(file)
  })
}

/**
 * Kiểm tra, phân tích và chuẩn hóa nội dung file sao lưu JSON.
 */
export function validateBackupFileContent(rawText: string): ImportValidationResult {
  if (!rawText || !rawText.trim()) {
    return { valid: false, error: 'Tệp rỗng hoặc không có dữ liệu.' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(rawText)
  } catch {
    return { valid: false, error: 'Tệp không đúng định dạng JSON hợp lệ.' }
  }

  if (!parsed || typeof parsed !== 'object') {
    return { valid: false, error: 'Nội dung file không phải là đối tượng JSON hợp lệ.' }
  }

  const rawObj = parsed as Record<string, unknown>

  // Chặn phiên bản schema lớn hơn phiên bản ứng dụng hỗ trợ
  if ('schemaVersion' in rawObj && typeof rawObj.schemaVersion === 'number') {
    if (rawObj.schemaVersion > 2) {
      return {
        valid: false,
        error: `Bản sao lưu có phiên bản schema (${rawObj.schemaVersion}) mới hơn ứng dụng hỗ trợ. Vui lòng cập nhật StudySpace.`,
      }
    }
  }

  const migration = migrateBackupPayload(parsed)

  if (!migration.success && migration.data.courses.length === 0) {
    return {
      valid: false,
      error: migration.issues[0] || 'Tệp sao lưu không chứa dữ liệu StudySpace hợp lệ.',
    }
  }

  const { data, issues, detectedVersion } = migration
  const hasAnyData =
    data.courses.length > 0 ||
    data.schedules.length > 0 ||
    data.assignments.length > 0 ||
    data.gpaEntries.length > 0

  if (!hasAnyData) {
    return {
      valid: false,
      error: 'Bản sao lưu không chứa bất kỳ dữ liệu môn học, lịch hay bài tập nào hợp lệ.',
    }
  }

  return {
    valid: true,
    preview: {
      version: detectedVersion,
      exportedAt: typeof rawObj.exportedAt === 'string' ? rawObj.exportedAt : undefined,
      appVersion: typeof rawObj.appVersion === 'string' ? rawObj.appVersion : undefined,
      coursesCount: data.courses.length,
      schedulesCount: data.schedules.length,
      assignmentsCount: data.assignments.length,
      gpaCount: data.gpaEntries.length,
      issues,
      data,
    },
  }
}
