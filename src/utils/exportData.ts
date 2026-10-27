import { createBackupEnvelope } from '../data/schemaValidation'
import type { AppData, Assignment, Course } from '../types'

/**
 * Định dạng ngày YYYY-MM-DD phục vụ đặt tên file sao lưu.
 */
export function getFormattedDate(date: Date = new Date()): string {
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * Chuẩn hóa giá trị trường CSV:
 * - Escape dấu ngoặc kép thành ""
 * - Bao bọc bằng ngoặc kép nếu chứa dấu phẩy, dấu ngoặc kép hoặc ký tự xuống dòng
 */
export function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""'
  const str = String(field)
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Tạo nội dung chuỗi JSON sao lưu đầy đủ kèm Envelope v2.
 */
export function generateBackupJsonString(data: AppData): string {
  const envelope = createBackupEnvelope(data)
  return JSON.stringify(envelope, null, 2)
}

/**
 * Tạo nội dung chuỗi CSV cho danh sách môn học kèm UTF-8 BOM.
 */
export function generateCoursesCsvString(courses: Course[]): string {
  const headers = ['ID', 'Tên môn học', 'Giảng viên', 'Số tín chỉ', 'Mã màu']
  const rows = courses.map((course) => [
    escapeCsvField(course.id),
    escapeCsvField(course.name),
    escapeCsvField(course.teacher || ''),
    escapeCsvField(course.credits),
    escapeCsvField(course.color),
  ])

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n')
  return `\uFEFF${csvContent}`
}

const statusVietnameseMap: Record<string, string> = {
  todo: 'Chưa làm',
  'in-progress': 'Đang làm',
  done: 'Hoàn thành',
}

/**
 * Tạo nội dung chuỗi CSV cho danh sách bài tập / hạn nộp kèm UTF-8 BOM.
 */
export function generateAssignmentsCsvString(assignments: Assignment[], courses: Course[]): string {
  const courseMap = new Map(courses.map((c) => [c.id, c.name]))
  const headers = ['ID', 'Môn học', 'Tiêu đề', 'Hạn nộp', 'Trạng thái', 'Mô tả']

  const rows = assignments.map((a) => {
    const courseTitle = courseMap.get(a.courseId) || 'Môn học đã xóa'
    const statusText = statusVietnameseMap[a.status] || a.status
    return [
      escapeCsvField(a.id),
      escapeCsvField(courseTitle),
      escapeCsvField(a.title),
      escapeCsvField(a.dueDate),
      escapeCsvField(statusText),
      escapeCsvField(a.description || ''),
    ]
  })

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\r\n')
  return `\uFEFF${csvContent}`
}

/**
 * Kích hoạt tải tệp tin về máy người dùng phía Client.
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}

/**
 * Xuất bản sao lưu toàn bộ dữ liệu dạng JSON.
 */
export function exportAppDataToJson(data: AppData, date = new Date()): string {
  const content = generateBackupJsonString(data)
  const filename = `studyspace-backup-${getFormattedDate(date)}.json`
  downloadFile(content, filename, 'application/json;charset=utf-8')
  return filename
}

/**
 * Xuất danh sách môn học dạng CSV.
 */
export function exportCoursesToCsv(courses: Course[], date = new Date()): string {
  const content = generateCoursesCsvString(courses)
  const filename = `studyspace-courses-${getFormattedDate(date)}.csv`
  downloadFile(content, filename, 'text/csv;charset=utf-8;')
  return filename
}

/**
 * Xuất danh sách bài tập và hạn nộp dạng CSV.
 */
export function exportAssignmentsToCsv(assignments: Assignment[], courses: Course[], date = new Date()): string {
  const content = generateAssignmentsCsvString(assignments, courses)
  const filename = `studyspace-assignments-${getFormattedDate(date)}.csv`
  downloadFile(content, filename, 'text/csv;charset=utf-8;')
  return filename
}
