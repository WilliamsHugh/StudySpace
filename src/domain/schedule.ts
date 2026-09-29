import type { ScheduleDraft, ScheduleEntry } from './types'

export type ScheduleErrors = Partial<Record<keyof ScheduleDraft, string>>

export function validateSchedule(schedule: ScheduleDraft): ScheduleErrors {
  const errors: ScheduleErrors = {}
  if (!schedule.courseId) errors.courseId = 'Vui lòng chọn môn học.'
  if (schedule.dayOfWeek < 1 || schedule.dayOfWeek > 7) errors.dayOfWeek = 'Vui lòng chọn ngày học.'
  if (!schedule.startTime) errors.startTime = 'Vui lòng chọn giờ bắt đầu.'
  if (!schedule.endTime) errors.endTime = 'Vui lòng chọn giờ kết thúc.'
  if (schedule.startTime && schedule.endTime && schedule.endTime <= schedule.startTime) {
    errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.'
  }
  return errors
}

export function createSchedule(schedule: ScheduleDraft): ScheduleEntry {
  return { ...schedule, room: schedule.room.trim(), id: crypto.randomUUID() }
}
