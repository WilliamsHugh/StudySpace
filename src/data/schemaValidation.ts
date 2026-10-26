import type { AppData, Assignment, AssignmentStatus, BackupEnvelope, Course, DayOfWeek, GpaEntry, Schedule } from '../types'

const CURRENT_SCHEMA_VERSION = 2
const APP_VERSION = '0.2.0'
const DEFAULT_COURSE_COLOR = '#6558d3'

export function isNonEmptyString(val: unknown): val is string {
  return typeof val === 'string' && val.trim().length > 0
}

export function validateCourse(raw: unknown): Course | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<Course>

  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.name)) {
    return null
  }

  const credits = typeof item.credits === 'number' && !Number.isNaN(item.credits) && item.credits > 0
    ? Math.round(item.credits)
    : 3

  const color = isNonEmptyString(item.color) && /^#[0-9a-fA-F]{6}$/.test(item.color)
    ? item.color
    : DEFAULT_COURSE_COLOR

  return {
    id: item.id.trim(),
    name: item.name.trim(),
    teacher: typeof item.teacher === 'string' ? item.teacher.trim() : '',
    credits,
    color,
  }
}

export function validateSchedule(raw: unknown, validCourseIds?: Set<string>): Schedule | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<Schedule>

  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.courseId)) {
    return null
  }

  if (validCourseIds && !validCourseIds.has(item.courseId)) {
    return null
  }

  const day = typeof item.dayOfWeek === 'number' && item.dayOfWeek >= 1 && item.dayOfWeek <= 7
    ? (Math.floor(item.dayOfWeek) as DayOfWeek)
    : null

  if (!day) return null

  const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/
  const startTime = isNonEmptyString(item.startTime) && timeRegex.test(item.startTime) ? item.startTime : null
  const endTime = isNonEmptyString(item.endTime) && timeRegex.test(item.endTime) ? item.endTime : null

  if (!startTime || !endTime) return null

  return {
    id: item.id.trim(),
    courseId: item.courseId.trim(),
    dayOfWeek: day,
    startTime,
    endTime,
    room: typeof item.room === 'string' ? item.room.trim() : '',
  }
}

export function validateAssignment(raw: unknown, validCourseIds?: Set<string>): Assignment | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<Assignment>

  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.courseId) || !isNonEmptyString(item.title)) {
    return null
  }

  if (validCourseIds && !validCourseIds.has(item.courseId)) {
    return null
  }

  const validStatuses: AssignmentStatus[] = ['todo', 'in-progress', 'done']
  const status: AssignmentStatus = item.status && validStatuses.includes(item.status as AssignmentStatus)
    ? (item.status as AssignmentStatus)
    : 'todo'

  const dueDate = isNonEmptyString(item.dueDate) ? item.dueDate : new Date().toISOString()

  return {
    id: item.id.trim(),
    courseId: item.courseId.trim(),
    title: item.title.trim(),
    description: typeof item.description === 'string' ? item.description.trim() : '',
    dueDate,
    status,
  }
}

export function validateGpaEntry(raw: unknown, validCourseIds?: Set<string>): GpaEntry | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Partial<GpaEntry>

  if (!isNonEmptyString(item.id) || !isNonEmptyString(item.courseId)) {
    return null
  }

  if (validCourseIds && !validCourseIds.has(item.courseId)) {
    return null
  }

  const grade = typeof item.expectedGrade === 'number' && !Number.isNaN(item.expectedGrade)
    ? Math.max(0, Math.min(10, item.expectedGrade))
    : 0

  const credits = typeof item.credits === 'number' && !Number.isNaN(item.credits) && item.credits > 0
    ? Math.round(item.credits)
    : 3

  return {
    id: item.id.trim(),
    courseId: item.courseId.trim(),
    expectedGrade: grade,
    credits,
  }
}

export interface SanitizationResult {
  data: AppData
  issues: string[]
}

export function sanitizeAppData(raw: unknown): SanitizationResult {
  const issues: string[] = []

  if (!raw || typeof raw !== 'object') {
    issues.push('Dữ liệu không phải là object hợp lệ.')
    return {
      data: { courses: [], schedules: [], assignments: [], gpaEntries: [] },
      issues,
    }
  }

  const root = raw as Partial<AppData>

  // 1. Sanitize Courses
  const courses: Course[] = []
  if (Array.isArray(root.courses)) {
    for (const c of root.courses) {
      const valid = validateCourse(c)
      if (valid) {
        courses.push(valid)
      } else {
        issues.push('Bỏ qua môn học không hợp lệ hoặc thiếu thông tin bắt buộc.')
      }
    }
  } else {
    issues.push('Trường courses không phải mảng, khởi tạo danh sách rỗng.')
  }

  const courseIds = new Set(courses.map((c) => c.id))

  // 2. Sanitize Schedules
  const schedules: Schedule[] = []
  if (Array.isArray(root.schedules)) {
    for (const s of root.schedules) {
      const valid = validateSchedule(s, courseIds)
      if (valid) {
        schedules.push(valid)
      } else {
        issues.push('Bỏ qua lịch học không hợp lệ hoặc tham chiếu môn học không tồn tại.')
      }
    }
  } else {
    issues.push('Trường schedules không phải mảng, khởi tạo danh sách rỗng.')
  }

  // 3. Sanitize Assignments
  const assignments: Assignment[] = []
  if (Array.isArray(root.assignments)) {
    for (const a of root.assignments) {
      const valid = validateAssignment(a, courseIds)
      if (valid) {
        assignments.push(valid)
      } else {
        issues.push('Bỏ qua bài tập không hợp lệ hoặc tham chiếu môn học không tồn tại.')
      }
    }
  } else {
    issues.push('Trường assignments không phải mảng, khởi tạo danh sách rỗng.')
  }

  // 4. Sanitize GpaEntries (1-1 với Course, không trùng lặp courseId)
  const gpaEntries: GpaEntry[] = []
  const seenGpaCourses = new Set<string>()
  if (Array.isArray(root.gpaEntries)) {
    for (const g of root.gpaEntries) {
      const valid = validateGpaEntry(g, courseIds)
      if (valid && !seenGpaCourses.has(valid.courseId)) {
        seenGpaCourses.add(valid.courseId)
        gpaEntries.push(valid)
      } else {
        issues.push('Bỏ qua bản ghi GPA không hợp lệ hoặc bị trùng môn học.')
      }
    }
  } else {
    issues.push('Trường gpaEntries không phải mảng, khởi tạo danh sách rỗng.')
  }

  return {
    data: { courses, schedules, assignments, gpaEntries },
    issues,
  }
}

export function createBackupEnvelope(data: AppData, version = CURRENT_SCHEMA_VERSION): BackupEnvelope {
  return {
    schemaVersion: version,
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    data: structuredClone(data),
  }
}

export interface MigrationResult {
  success: boolean
  data: AppData
  issues: string[]
  detectedVersion: number
}

export function migrateBackupPayload(raw: unknown): MigrationResult {
  if (!raw || typeof raw !== 'object') {
    return {
      success: false,
      data: { courses: [], schedules: [], assignments: [], gpaEntries: [] },
      issues: ['Payload sao lưu không đúng định dạng JSON object.'],
      detectedVersion: 0,
    }
  }

  const obj = raw as Record<string, unknown>

  // Phân biệt versioned envelope và unversioned raw AppData
  if ('schemaVersion' in obj && typeof obj.schemaVersion === 'number') {
    const version = obj.schemaVersion
    const innerData = (obj.data && typeof obj.data === 'object') ? obj.data : {}
    const sanitized = sanitizeAppData(innerData)
    return {
      success: sanitized.data.courses.length > 0 || sanitized.issues.length === 0,
      data: sanitized.data,
      issues: sanitized.issues,
      detectedVersion: version,
    }
  }

  // Legacy unversioned (v1 format: object trực tiếp chứa courses, schedules, ...)
  const sanitized = sanitizeAppData(raw)
  sanitized.issues.unshift('Đã nâng cấp từ dữ liệu unversioned (v1) lên schema v2.')

  return {
    success: true,
    data: sanitized.data,
    issues: sanitized.issues,
    detectedVersion: 1,
  }
}
