import type { Course, Schedule } from '../types'

export type FieldErrors<T> = Partial<Record<keyof T, string>>

export function validateCourse(course: Course): FieldErrors<Course> {
  const errors: FieldErrors<Course> = {}
  if (!course.name.trim()) errors.name = 'Tên môn học là bắt buộc.'
  if (!Number.isInteger(course.credits) || course.credits < 1 || course.credits > 10) {
    errors.credits = 'Tín chỉ phải là số nguyên từ 1 đến 10.'
  }
  return errors
}

export function validateSchedule(schedule: Schedule): FieldErrors<Schedule> {
  const errors: FieldErrors<Schedule> = {}
  if (!schedule.courseId) errors.courseId = 'Vui lòng chọn môn học.'
  if (schedule.dayOfWeek < 1 || schedule.dayOfWeek > 7) errors.dayOfWeek = 'Vui lòng chọn ngày học.'
  if (!schedule.startTime) errors.startTime = 'Vui lòng chọn giờ bắt đầu.'
  if (!schedule.endTime) errors.endTime = 'Vui lòng chọn giờ kết thúc.'
  if (schedule.startTime && schedule.endTime && schedule.endTime <= schedule.startTime) {
    errors.endTime = 'Giờ kết thúc phải sau giờ bắt đầu.'
  }
  return errors
}
