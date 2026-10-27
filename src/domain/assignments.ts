import type { Assignment, AssignmentPriority, AssignmentStatus } from '../types'

export type AssignmentInput = Omit<Assignment, 'id'>
export type AssignmentErrors = Partial<Record<'courseId' | 'title' | 'dueDate', string>>

export const statusLabels: Record<AssignmentStatus, string> = {
  todo: 'Chưa làm',
  'in-progress': 'Đang làm',
  done: 'Hoàn thành',
}

export const priorityLabels: Record<AssignmentPriority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
}

export function parseTags(input: string | string[] | undefined): string[] {
  if (!input) return []
  if (Array.isArray(input)) {
    return input.map((t) => String(t).trim()).filter((t) => t.length > 0)
  }
  return input
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}

export interface AssignmentFilterCriteria {
  courseId?: string
  status?: 'all' | AssignmentStatus
  priority?: 'all' | AssignmentPriority
  searchQuery?: string
}

export function filterAssignments(
  assignments: Assignment[],
  criteria: AssignmentFilterCriteria,
): Assignment[] {
  const { courseId = 'all', status = 'all', priority = 'all', searchQuery = '' } = criteria
  const query = searchQuery.trim().toLowerCase()

  return assignments.filter((assignment) => {
    // 1. Lọc theo môn học
    if (courseId !== 'all' && assignment.courseId !== courseId) {
      return false
    }

    // 2. Lọc theo trạng thái
    if (status !== 'all' && assignment.status !== status) {
      return false
    }

    // 3. Lọc theo mức độ ưu tiên
    const assignmentPriority = assignment.priority ?? 'medium'
    if (priority !== 'all' && assignmentPriority !== priority) {
      return false
    }

    // 4. Tìm kiếm theo tiêu đề, mô tả và nhãn (tags)
    if (query) {
      const matchTitle = assignment.title.toLowerCase().includes(query)
      const matchDescription = (assignment.description || '').toLowerCase().includes(query)
      const matchTags = (assignment.tags || []).some((t) => t.toLowerCase().includes(query))
      if (!matchTitle && !matchDescription && !matchTags) {
        return false
      }
    }

    return true
  })
}

export function validateAssignment(input: AssignmentInput): AssignmentErrors {
  const errors: AssignmentErrors = {}
  if (!input.courseId) errors.courseId = 'Vui lòng chọn môn học.'
  if (!input.title.trim()) errors.title = 'Tiêu đề là bắt buộc.'
  if (!input.dueDate || Number.isNaN(new Date(input.dueDate).getTime())) {
    errors.dueDate = 'Vui lòng nhập hạn nộp hợp lệ.'
  }
  return errors
}

export function isOverdue(assignment: Assignment, now = new Date()): boolean {
  return assignment.status !== 'done' && new Date(assignment.dueDate).getTime() < now.getTime()
}

export function sortAssignmentsByDeadline(assignments: Assignment[]): Assignment[] {
  return [...assignments].sort(
    (left, right) => new Date(left.dueDate).getTime() - new Date(right.dueDate).getTime(),
  )
}

export function getUpcomingAssignments(
  assignments: Assignment[],
  now = new Date(),
  limit = 5,
): Assignment[] {
  return sortAssignmentsByDeadline(
    assignments.filter(
      (assignment) => assignment.status !== 'done' && new Date(assignment.dueDate).getTime() >= now.getTime(),
    ),
  ).slice(0, limit)
}

export function getOverdueAssignments(assignments: Assignment[], now = new Date()): Assignment[] {
  return sortAssignmentsByDeadline(assignments.filter((assignment) => isOverdue(assignment, now)))
}
