// Helper tạo Course entity — dùng bởi StudySpaceContext (Trường)
import type { Course, CourseDraft } from '../domain/types'

export function createCourseEntity(input: CourseDraft, now = new Date()): Course {
  const ts = now.toISOString()
  return { ...input, name: input.name.trim(), teacher: input.teacher.trim(), id: crypto.randomUUID(), createdAt: ts, updatedAt: ts }
}
