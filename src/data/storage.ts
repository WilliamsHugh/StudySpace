import { defaultState } from './defaultState'
import { uniqueGradeExpectations } from '../domain/gpa'
import type { StudySpaceState } from '../domain/types'

export const STORAGE_KEY = 'studyspace.state.v1'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function loadState(storage: StorageLike): StudySpaceState {
  try {
    const value = storage.getItem(STORAGE_KEY)
    if (!value) return structuredClone(defaultState)
    const parsed = JSON.parse(value) as Partial<StudySpaceState>
    if (parsed.version !== 1 || !Array.isArray(parsed.courses) || !Array.isArray(parsed.assignments)) {
      return structuredClone(defaultState)
    }
    return {
      ...structuredClone(defaultState),
      ...parsed,
      gradeExpectations: uniqueGradeExpectations(Array.isArray(parsed.gradeExpectations) ? parsed.gradeExpectations : []),
      settings: { ...defaultState.settings, ...parsed.settings },
    }
  } catch {
    return structuredClone(defaultState)
  }
}

export function saveState(storage: StorageLike, state: StudySpaceState): boolean {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    return false
  }
}
