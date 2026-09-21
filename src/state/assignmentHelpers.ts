// Helper tạo Assignment entity — dùng bởi StudySpaceContext (Trường)
import type { Assignment, AssignmentDraft } from '../domain/types'

export function createAssignmentEntity(input: AssignmentDraft, now = new Date()): Assignment {
  const ts = now.toISOString()
  return { ...input, title: input.title.trim(), description: input.description.trim(), id: crypto.randomUUID(), createdAt: ts, updatedAt: ts }
}
