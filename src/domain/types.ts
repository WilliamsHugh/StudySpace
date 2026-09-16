export type EntityId = string

export interface Course {
  id: EntityId
  name: string
  teacher: string
  credits: number
  color: string
  createdAt: string
  updatedAt: string
}

export type AssignmentStatus = 'todo' | 'in_progress' | 'completed'

export interface Assignment {
  id: EntityId
  courseId: EntityId
  title: string
  description: string
  dueDate: string
  status: AssignmentStatus
  createdAt: string
  updatedAt: string
}

export type AssignmentDraft = Pick<Assignment, 'courseId' | 'title' | 'description' | 'dueDate' | 'status'>

export interface GradeExpectation {
  courseId: EntityId
  expectedScore: number | null
  gradePoint: number | null
}

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface ScheduleEntry {
  id: EntityId
  courseId: EntityId
  dayOfWeek: Weekday
  startTime: string
  endTime: string
  room: string
}

export interface Settings {
  displayName: string
  weekStartsOn: 1 | 7
  compactSidebar: boolean
}

export interface StudySpaceState {
  version: 1
  courses: Course[]
  assignments: Assignment[]
  gradeExpectations: GradeExpectation[]
  schedule: ScheduleEntry[]
  settings: Settings
}

export type CourseDraft = Pick<Course, 'name' | 'teacher' | 'credits' | 'color'>
