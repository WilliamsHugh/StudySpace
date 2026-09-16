import type { AppData, Assignment, GpaEntry } from '../types'

// Giữ một data access layer duy nhất cho mọi module trong ứng dụng.
export { STORAGE_KEY, loadAppData, saveAppData } from './appData'

export const assignmentRepository = {
  create(data: AppData, assignment: Assignment): AppData {
    return { ...data, assignments: [...data.assignments, assignment] }
  },
  update(data: AppData, assignment: Assignment): AppData {
    return {
      ...data,
      assignments: data.assignments.map((item) => (item.id === assignment.id ? assignment : item)),
    }
  },
  remove(data: AppData, id: string): AppData {
    return { ...data, assignments: data.assignments.filter((item) => item.id !== id) }
  },
}

export const gpaRepository = {
  upsert(data: AppData, entry: GpaEntry): AppData {
    const exists = data.gpaEntries.some((item) => item.id === entry.id)
    return {
      ...data,
      gpaEntries: exists
        ? data.gpaEntries.map((item) => (item.id === entry.id ? entry : item))
        : [...data.gpaEntries, entry],
    }
  },
  remove(data: AppData, id: string): AppData {
    return { ...data, gpaEntries: data.gpaEntries.filter((item) => item.id !== id) }
  },
}
