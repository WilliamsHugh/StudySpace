import type { Assignment, AssignmentStatus } from '../types'

export type AssignmentInput = Omit<Assignment, 'id'>
export type AssignmentErrors = Partial<Record<'courseId' | 'title' | 'dueDate', string>>

export const statusLabels: Record<AssignmentStatus, string> = {
  todo: 'Chưa làm',
  'in-progress': 'Đang làm',
  done: 'Hoàn thành',
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
