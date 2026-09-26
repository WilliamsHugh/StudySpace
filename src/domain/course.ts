import type { Course, CourseDraft } from './types'

export type CourseErrors = Partial<Record<keyof CourseDraft, string>>

export function validateCourse(input: CourseDraft): CourseErrors {
  const errors: CourseErrors = {}

  if (!input.name.trim()) errors.name = 'Tên môn học không được để trống.'
  if (!Number.isInteger(input.credits) || input.credits < 1 || input.credits > 15) {
    errors.credits = 'Số tín chỉ phải là số nguyên từ 1 đến 15.'
  }
  if (!/^#[0-9a-f]{6}$/i.test(input.color)) errors.color = 'Màu môn học không hợp lệ.'

  return errors
}

export function createCourse(input: CourseDraft, now = new Date()): Course {
  const timestamp = now.toISOString()
  return {
    ...input,
    name: input.name.trim(),
    teacher: input.teacher.trim(),
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}
