import { createContext, useContext, useEffect, useMemo, useReducer, type PropsWithChildren } from 'react'
import { createCourse } from '../domain/course'
import { createGradeExpectation } from '../domain/gpa'
import { createAssignment } from '../domain/assignment'
import type { AssignmentDraft, CourseDraft, StudySpaceState } from '../domain/types'
import { loadState, saveState } from '../data/storage'
import { studySpaceReducer } from './studySpaceReducer'

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
  const [state, dispatch] = useReducer(studySpaceReducer, undefined, () => loadState(window.localStorage))

  useEffect(() => {
    saveState(window.localStorage, state)
  }, [state])

  const value = useMemo<StudySpaceContextValue>(() => ({
    state,
    addCourse: (draft) => dispatch({ type: 'course/add', payload: createCourse(draft) }),
    updateCourse: (id, draft) => dispatch({
      type: 'course/update',
      payload: { id, changes: draft, updatedAt: new Date().toISOString() },
    }),
    deleteCourse: (id) => dispatch({ type: 'course/delete', payload: { id } }),
    setExpectedScore: (courseId, score) => dispatch(score == null
      ? { type: 'grade/delete', payload: { courseId } }
      : { type: 'grade/upsert', payload: createGradeExpectation(courseId, score) }),
    addAssignment: (draft) => dispatch({ type: 'assignment/add', payload: createAssignment(draft) }),
    updateAssignment: (id, draft) => dispatch({
      type: 'assignment/update',
      payload: { id, changes: draft, updatedAt: new Date().toISOString() },
    }),
    deleteAssignment: (id) => dispatch({ type: 'assignment/delete', payload: { id } }),
  }), [state])

  return <StudySpaceContext.Provider value={value}>{children}</StudySpaceContext.Provider>
}

export function useStudySpace() {
  const context = useContext(StudySpaceContext)
  if (!context) throw new Error('useStudySpace phải được dùng bên trong StudySpaceProvider.')
  return context
}
