import type { AppData, Assignment, GpaEntry } from '../types'

// Giữ một data access layer duy nhất cho mọi module trong ứng dụng.
export { STORAGE_KEY, loadAppData, saveAppData } from './appData'

// Re-export với tên dùng bởi StudySpaceContext (Trường)
export { loadAppData as loadState, saveAppData as saveState } from './appData'


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
    const existing = data.gpaEntries.find((item) => item.id === entry.id)
      ?? data.gpaEntries.find((item) => item.courseId === entry.courseId)
    const savedEntry = { ...entry, id: existing?.id ?? entry.id }
    let inserted = false
    const gpaEntries = data.gpaEntries.flatMap((item) => {
      if (item.id === savedEntry.id || item.courseId === savedEntry.courseId) {
        if (inserted) return []
        inserted = true
        return [savedEntry]
      }
      return [item]
    })
    if (!inserted) gpaEntries.push(savedEntry)

    return { ...data, gpaEntries }
  },
  remove(data: AppData, id: string): AppData {
    return { ...data, gpaEntries: data.gpaEntries.filter((item) => item.id !== id) }
  },
}
