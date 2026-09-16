import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadAppData, saveAppData } from '../data/appData'
import type { AppData, Course, Schedule } from '../types'

interface AppDataContextValue extends AppData {
  updateData: (updater: (current: AppData) => AppData) => void
  saveCourse: (course: Course) => void
  deleteCourse: (id: string) => void
  saveSchedule: (schedule: Schedule) => void
  deleteSchedule: (id: string) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children, initialData }: { children: ReactNode; initialData?: Partial<AppData> }) {
  const [data, setData] = useState<AppData>(() => initialData ? {
    courses: initialData.courses ?? [],
    schedules: initialData.schedules ?? [],
    assignments: initialData.assignments ?? [],
    gpaEntries: initialData.gpaEntries ?? [],
  } : loadAppData())

  useEffect(() => {
    saveAppData(data)
  }, [data])

  const value = useMemo<AppDataContextValue>(() => ({
    ...data,
    updateData: setData,
    saveCourse: (course) => setData((current) => ({
      ...current,
      courses: current.courses.some(({ id }) => id === course.id)
        ? current.courses.map((item) => item.id === course.id ? course : item)
        : [...current.courses, course],
    })),
    deleteCourse: (id) => setData((current) => ({
      ...current,
      courses: current.courses.filter((course) => course.id !== id),
      schedules: current.schedules.filter((schedule) => schedule.courseId !== id),
      assignments: current.assignments.filter((assignment) => assignment.courseId !== id),
      gpaEntries: current.gpaEntries.filter((entry) => entry.courseId !== id),
    })),
    saveSchedule: (schedule) => setData((current) => ({
      ...current,
      schedules: current.schedules.some(({ id }) => id === schedule.id)
        ? current.schedules.map((item) => item.id === schedule.id ? schedule : item)
        : [...current.schedules, schedule],
    })),
    deleteSchedule: (id) => setData((current) => ({
      ...current,
      schedules: current.schedules.filter((schedule) => schedule.id !== id),
    })),
  }), [data])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const value = useContext(AppDataContext)
  if (!value) throw new Error('useAppData must be used inside AppDataProvider')
  return value
}
