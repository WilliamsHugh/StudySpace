export interface Course {
  id: string
  name: string
  teacher: string
  credits: number
  color: string
}

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface Schedule {
  id: string
  courseId: string
  dayOfWeek: DayOfWeek
  startTime: string
  endTime: string
  room: string
}

export type AssignmentStatus = 'todo' | 'in-progress' | 'done'
export type AssignmentPriority = 'low' | 'medium' | 'high'

export interface Assignment {
  id: string
  courseId: string
  title: string
  description: string
  dueDate: string
  status: AssignmentStatus
  priority?: AssignmentPriority
  tags?: string[]
}

export interface GpaEntry {
  id: string
  courseId: string
  expectedGrade: number
  credits: number
}

export interface AppData {
  courses: Course[]
  schedules: Schedule[]
  assignments: Assignment[]
  gpaEntries: GpaEntry[]
}

export interface BackupEnvelope {
  schemaVersion: number
  exportedAt: string
  appVersion: string
  data: AppData
}

