/**
 * StudySpaceContext — Trường's alternative state implementation (Context + Reducer pattern).
 * Standalone, không phụ thuộc vào AppDataContext của nhóm.
 * Dùng localStorage key riêng để không conflict.
 */
import { createContext, useContext, useEffect, useMemo, useReducer, type PropsWithChildren } from 'react'
import { createGradeExpectation } from '../domain/gpa'
import { studySpaceReducer } from './studySpaceReducer'
import type { StudySpaceState, AssignmentDraft, CourseDraft } from './types'
import { createCourseEntity } from './courseHelpers'
import { createAssignmentEntity } from './assignmentHelpers'

// ── Inline types for standalone operation ──────────────────────────────

const STORAGE_KEY = 'studyspace.state.v2'

const defaultState: StudySpaceState = {
  version: 1,
  courses: [],
  assignments: [],
  gradeExpectations: [],
  schedule: [],
  settings: { displayName: '', weekStartsOn: 1, compactSidebar: false },
}

function loadFromStorage(): StudySpaceState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(defaultState)
    const parsed = JSON.parse(raw) as Partial<StudySpaceState>
    return { ...structuredClone(defaultState), ...parsed }
  } catch {
    return structuredClone(defaultState)
  }
}

function saveToStorage(state: StudySpaceState): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

// ── Context ────────────────────────────────────────────────────────────

interface StudySpaceContextValue {
  state: StudySpaceState
  addCourse: (draft: CourseDraft) => void
  updateCourse: (id: string, draft: CourseDraft) => void
  deleteCourse: (id: string) => void
  setExpectedScore: (courseId: string, score: number | null) => void
  addAssignment: (draft: AssignmentDraft) => void
  updateAssignment: (id: string, draft: AssignmentDraft) => void
  deleteAssignment: (id: string) => void
}

const StudySpaceContext = createContext<StudySpaceContextValue | null>(null)

export function StudySpaceProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(studySpaceReducer, undefined, loadFromStorage)

  useEffect(() => { saveToStorage(state) }, [state])

  const value = useMemo<StudySpaceContextValue>(() => ({
    state,
    addCourse: (draft) => dispatch({ type: 'course/add', payload: createCourseEntity(draft) }),
    updateCourse: (id, draft) => dispatch({ type: 'course/update', payload: { id, changes: draft, updatedAt: new Date().toISOString() } }),
    deleteCourse: (id) => dispatch({ type: 'course/delete', payload: { id } }),
    setExpectedScore: (courseId, score) => dispatch(score == null
      ? { type: 'grade/delete', payload: { courseId } }
      : { type: 'grade/upsert', payload: createGradeExpectation(courseId, score) }),
    addAssignment: (draft) => dispatch({ type: 'assignment/add', payload: createAssignmentEntity(draft) }),
    updateAssignment: (id, draft) => dispatch({ type: 'assignment/update', payload: { id, changes: draft, updatedAt: new Date().toISOString() } }),
    deleteAssignment: (id) => dispatch({ type: 'assignment/delete', payload: { id } }),
  }), [state])

  return <StudySpaceContext.Provider value={value}>{children}</StudySpaceContext.Provider>
}

export function useStudySpace() {
  const context = useContext(StudySpaceContext)
  if (!context) throw new Error('useStudySpace phải được dùng bên trong StudySpaceProvider.')
  return context
}
