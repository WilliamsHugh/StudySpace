import type { Assignment, AssignmentDraft, AssignmentStatus, Course } from './types'

export type AssignmentErrors = Partial<Record<keyof AssignmentDraft, string>>

export type AssignmentStatusFilter = AssignmentStatus | 'overdue' | 'all'

export interface AssignmentFilters {
  courseId: string
  status: AssignmentStatusFilter
}

export const defaultAssignmentFilters: AssignmentFilters = {
  courseId: 'all',
  status: 'all',
}

export interface DashboardStats {
  courses: number
  assignments: number
  todo: number
  inProgress: number
  completed: number
  overdue: number
}

export function validateAssignment(input: AssignmentDraft, courses: Course[]): AssignmentErrors {
  const errors: AssignmentErrors = {}

  if (!input.title.trim()) errors.title = 'Tên bài tập không được để trống.'
  if (!courses.some((course) => course.id === input.courseId)) {
    errors.courseId = 'Hãy chọn một môn học hợp lệ.'
  }
  if (!input.dueDate || Number.isNaN(new Date(input.dueDate).getTime())) {
    errors.dueDate = 'Hạn nộp không hợp lệ.'
  }
  if (!isAssignmentStatus(input.status)) errors.status = 'Trạng thái không hợp lệ.'

  return errors
}

export function isAssignmentStatus(status: string): status is AssignmentStatus {
  return status === 'todo' || status === 'in_progress' || status === 'completed'
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
  if (assignment.status === 'completed') return false
  const dueTime = new Date(assignment.dueDate).getTime()
  return !Number.isNaN(dueTime) && dueTime < now.getTime()
}

export function sortByNearestDeadline(assignments: Assignment[]): Assignment[] {
  return [...assignments].sort((left, right) => {
    const leftTime = new Date(left.dueDate).getTime()
    const rightTime = new Date(right.dueDate).getTime()
    if (Number.isNaN(leftTime) && Number.isNaN(rightTime)) return 0
    if (Number.isNaN(leftTime)) return 1
    if (Number.isNaN(rightTime)) return -1
    return leftTime - rightTime
  })
}

export function filterAndSortAssignments(
  assignments: Assignment[],
  filters: AssignmentFilters,
  now = new Date(),
): Assignment[] {
  return sortByNearestDeadline(assignments.filter((assignment) => {
    const matchesCourse = filters.courseId === 'all' || assignment.courseId === filters.courseId
    const matchesStatus = filters.status === 'all'
      || (filters.status === 'overdue' ? isOverdue(assignment, now) : assignment.status === filters.status)

    return matchesCourse && matchesStatus
  }))
}

export function getUpcomingAssignments(assignments: Assignment[], limit = 5): Assignment[] {
  return sortByNearestDeadline(assignments.filter((assignment) => assignment.status !== 'completed')).slice(0, limit)
}

export function calculateDashboardStats(
  courses: Course[],
  assignments: Assignment[],
  now = new Date(),
): DashboardStats {
  return {
    courses: courses.length,
    assignments: assignments.length,
    todo: assignments.filter((item) => item.status === 'todo').length,
    inProgress: assignments.filter((item) => item.status === 'in_progress').length,
    completed: assignments.filter((item) => item.status === 'completed').length,
    overdue: assignments.filter((item) => isOverdue(item, now)).length,
  }
}
