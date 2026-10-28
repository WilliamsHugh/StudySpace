import type { Assignment, Course, DayOfWeek, Schedule } from '../types'

export type WorkloadLevel = 'light' | 'moderate' | 'heavy'

export interface WorkloadClassItem {
  scheduleId: string
  courseName: string
  color: string
  time: string
  room: string
}

export interface WorkloadAssignmentItem {
  assignmentId: string
  title: string
  courseName: string
  dueDate: string
  isOverdue: boolean
}

export interface DayWorkload {
  dayOfWeek: DayOfWeek
  dayName: string
  dateString: string
  classes: WorkloadClassItem[]
  assignments: WorkloadAssignmentItem[]
  totalItems: number
  level: WorkloadLevel
  statusLabel: string
}

export interface WeeklyWorkloadSummary {
  days: DayWorkload[]
  totalClasses: number
  totalAssignments: number
  peakDay: DayWorkload | null
}

const dayNames: Record<DayOfWeek, string> = {
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
  7: 'Chủ Nhật',
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getMondayOfWeek(referenceDate: Date): Date {
  const date = new Date(referenceDate)
  const day = date.getDay() // 0 (Sunday) to 6 (Saturday)
  const diff = (day === 0 ? -6 : 1) - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + diff)
  monday.setHours(0, 0, 0, 0)
  return monday
}

export function calculateWeeklyWorkload(
  schedules: Schedule[],
  assignments: Assignment[],
  courses: Course[],
  referenceDate: Date = new Date(),
): WeeklyWorkloadSummary {
  const monday = getMondayOfWeek(referenceDate)
  const courseMap = new Map(courses.map((c) => [c.id, c]))

  const days: DayWorkload[] = []
  let totalClasses = 0
  let totalAssignments = 0

  for (let i = 0; i < 7; i++) {
    const dayOfWeek = (i + 1) as DayOfWeek
    const currentDayDate = new Date(monday)
    currentDayDate.setDate(monday.getDate() + i)
    const yyyyMmDd = formatLocalDate(currentDayDate)

    // Lịch học trong ngày
    const daySchedules = schedules
      .filter((s) => s.dayOfWeek === dayOfWeek)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    const classes: WorkloadClassItem[] = daySchedules.map((s) => {
      const course = courseMap.get(s.courseId)
      return {
        scheduleId: s.id,
        courseName: course?.name ?? 'Môn học',
        color: course?.color ?? '#6558d3',
        time: `${s.startTime} – ${s.endTime}`,
        room: s.room || 'Chưa xếp phòng',
      }
    })

    // Bài tập có hạn trong ngày của tuần này
    const dayAssignments = assignments.filter((a) => {
      if (!a.dueDate) return false
      return a.dueDate.slice(0, 10) === yyyyMmDd
    })

    const assignmentItems: WorkloadAssignmentItem[] = dayAssignments.map((a) => {
      const course = courseMap.get(a.courseId)
      const isOverdue = a.status !== 'done' && new Date(a.dueDate).getTime() < referenceDate.getTime()
      return {
        assignmentId: a.id,
        title: a.title,
        courseName: course?.name ?? 'Môn học',
        dueDate: a.dueDate,
        isOverdue,
      }
    })

    const totalItems = classes.length + assignmentItems.length
    let level: WorkloadLevel = 'light'
    let statusLabel = 'Rảnh rỗi'

    if (totalItems >= 3) {
      level = 'heavy'
      statusLabel = 'Bận rộn'
    } else if (totalItems >= 1) {
      level = 'moderate'
      statusLabel = 'Vừa phải'
    }

    totalClasses += classes.length
    totalAssignments += assignmentItems.length

    days.push({
      dayOfWeek,
      dayName: dayNames[dayOfWeek],
      dateString: yyyyMmDd,
      classes,
      assignments: assignmentItems,
      totalItems,
      level,
      statusLabel,
    })
  }

  const peakDay = days.reduce<DayWorkload | null>((peak, current) => {
    if (!peak || current.totalItems > peak.totalItems) {
      return current.totalItems > 0 ? current : null
    }
    return peak
  }, null)

  return {
    days,
    totalClasses,
    totalAssignments,
    peakDay,
  }
}
