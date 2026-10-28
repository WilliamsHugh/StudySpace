import type { Course, Schedule } from '../types'

export interface ScheduleConflict {
  existingSchedule: Schedule
  conflictingCourseName: string
  reason: string
}

/**
 * Kiểm tra xem 2 khoảng thời gian học có bị trùng nhau không.
 * Điều kiện trùng: Cùng ngày trong tuần VÀ 2 khoảng thời gian [start, end) giao nhau.
 * Lưu ý ranh giới tiếp giáp (ví dụ 08:00 - 10:00 và 10:00 - 12:00) KHÔNG coi là trùng.
 */
export function areSchedulesOverlapping(
  s1: { dayOfWeek: number; startTime: string; endTime: string },
  s2: { dayOfWeek: number; startTime: string; endTime: string },
): boolean {
  if (s1.dayOfWeek !== s2.dayOfWeek) {
    return false
  }

  // Hai khoảng [start1, end1) và [start2, end2) giao nhau khi:
  // start1 < end2 && start2 < end1
  return s1.startTime < s2.endTime && s2.startTime < s1.endTime
}

/**
 * Tìm tất cả các lịch học bị trùng với lịch dự kiến (candidate).
 * Tự động loại trừ chính bản thân candidate nếu candidate đang được chỉnh sửa (có id trùng).
 */
export function findScheduleConflicts(
  candidate: Schedule,
  existingSchedules: Schedule[],
  courses: Course[],
): ScheduleConflict[] {
  if (!candidate.startTime || !candidate.endTime || candidate.startTime >= candidate.endTime) {
    return []
  }

  const otherSchedules = existingSchedules.filter((s) => s.id !== candidate.id)
  const conflicts: ScheduleConflict[] = []

  for (const existing of otherSchedules) {
    if (areSchedulesOverlapping(candidate, existing)) {
      const course = courses.find((c) => c.id === existing.courseId)
      const courseName = course?.name ?? 'Môn học khác'
      conflicts.push({
        existingSchedule: existing,
        conflictingCourseName: courseName,
        reason: `Trùng giờ với môn "${courseName}" (${existing.startTime} – ${existing.endTime}${existing.room ? `, Phòng ${existing.room}` : ''})`,
      })
    }
  }

  return conflicts
}
