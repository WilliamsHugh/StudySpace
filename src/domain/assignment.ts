import type { Assignment, AssignmentDraft, AssignmentStatus, Course } from './types'

export type AssignmentErrors = Partial<Record<keyof AssignmentDraft, string>>
export type AssignmentStatusFilter = AssignmentStatus | 'overdue' | 'all'

export interface AssignmentFilters {
  courseId: string
  status: AssignmentStatusFilter
}

export const defaultAssignmentFilters: AssignmentFilters = { courseId: 'all', status: 'all' }

export const statusLabels: Record<AssignmentStatus, string> = {
  todo: 'Chưa làm',
  in_progress: 'Đang làm',
  completed: 'Hoàn thành',
}

export function validateAssignment(input: AssignmentDraft, courses: Course[]): AssignmentErrors {
  const errors: AssignmentErrors = {}
  if (!courses.some((course) => course.id === input.courseId)) errors.courseId = 'Hãy chọn một môn học hợp lệ.'
  if (!input.title.trim()) errors.title = 'Tên bài tập không được để trống.'
  if (!input.dueDate || Number.isNaN(new Date(input.dueDate).getTime())) errors.dueDate = 'Hạn nộp không hợp lệ.'
  return errors
}

export function createAssignment(input: AssignmentDraft, now = new Date()): Assignment {
  const timestamp = now.toISOString()
  return {
    ...input,
    title: input.title.trim(),
    description: input.description.trim(),
    id: crypto.randomUUID(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }
}

export function isOverdue(assignment: Assignment, now = new Date()): boolean {
  const dueTime = new Date(assignment.dueDate).getTime()
  return assignment.status !== 'completed' && !Number.isNaN(dueTime) && dueTime < now.getTime()
}

export function sortAssignmentsByDeadline(assignments: Assignment[]): Assignment[] {
  return [...assignments].sort((left, right) => {
    const leftTime = new Date(left.dueDate).getTime()
    const rightTime = new Date(right.dueDate).getTime()
    if (Number.isNaN(leftTime)) return Number.isNaN(rightTime) ? 0 : 1
    if (Number.isNaN(rightTime)) return -1
    return leftTime - rightTime
  })
}

export function getUpcomingAssignments(assignments: Assignment[], now = new Date(), limit = 5): Assignment[] {
  return sortAssignmentsByDeadline(assignments.filter((assignment) => (
    assignment.status !== 'completed' && new Date(assignment.dueDate).getTime() >= now.getTime()
  ))).slice(0, limit)
}

export function getOverdueAssignments(assignments: Assignment[], now = new Date()): Assignment[] {
  return sortAssignmentsByDeadline(assignments.filter((assignment) => isOverdue(assignment, now)))
}

export function filterAndSortAssignments(
  assignments: Assignment[],
  filters: AssignmentFilters,
  now = new Date(),
): Assignment[] {
  return sortAssignmentsByDeadline(assignments.filter((assignment) => {
    const matchesCourse = filters.courseId === 'all' || assignment.courseId === filters.courseId
    const matchesStatus = filters.status === 'all'
      || (filters.status === 'overdue' ? isOverdue(assignment, now) : assignment.status === filters.status)
    return matchesCourse && matchesStatus
  }))
}
