import { upsertGradeExpectation } from '../domain/gpa'
import type { Assignment, AssignmentDraft, Course, CourseDraft, GradeExpectation, ScheduleEntry, StudySpaceState } from '../domain/types'

export type StudySpaceAction =
  | { type: 'course/add'; payload: Course }
  | { type: 'course/update'; payload: { id: string; changes: CourseDraft; updatedAt: string } }
  | { type: 'course/delete'; payload: { id: string } }
  | { type: 'grade/upsert'; payload: GradeExpectation }
  | { type: 'grade/delete'; payload: { courseId: string } }
  | { type: 'assignment/add'; payload: Assignment }
  | { type: 'assignment/update'; payload: { id: string; changes: AssignmentDraft; updatedAt: string } }
  | { type: 'assignment/delete'; payload: { id: string } }
  | { type: 'schedule/add'; payload: ScheduleEntry }
  | { type: 'schedule/update'; payload: ScheduleEntry }
  | { type: 'schedule/delete'; payload: { id: string } }
  | { type: 'state/replace'; payload: StudySpaceState }

export function studySpaceReducer(state: StudySpaceState, action: StudySpaceAction): StudySpaceState {
  switch (action.type) {
    case 'course/add':
      return { ...state, courses: [...state.courses, action.payload] }
    case 'course/update':
      return {
        ...state,
        courses: state.courses.map((course) =>
          course.id === action.payload.id
            ? { ...course, ...action.payload.changes, updatedAt: action.payload.updatedAt }
            : course,
        ),
      }
    case 'course/delete':
      return {
        ...state,
        courses: state.courses.filter((course) => course.id !== action.payload.id),
        assignments: state.assignments.filter((assignment) => assignment.courseId !== action.payload.id),
        gradeExpectations: state.gradeExpectations.filter((grade) => grade.courseId !== action.payload.id),
        schedule: state.schedule.filter((entry) => entry.courseId !== action.payload.id),
      }
    case 'grade/upsert':
      return {
        ...state,
        gradeExpectations: upsertGradeExpectation(state.gradeExpectations, action.payload),
      }
    case 'grade/delete':
      return {
        ...state,
        gradeExpectations: state.gradeExpectations.filter((entry) => entry.courseId !== action.payload.courseId),
      }
    case 'assignment/add':
      return { ...state, assignments: [...state.assignments, action.payload] }
    case 'assignment/update':
      return {
        ...state,
        assignments: state.assignments.map((assignment) =>
          assignment.id === action.payload.id
            ? { ...assignment, ...action.payload.changes, updatedAt: action.payload.updatedAt }
            : assignment,
        ),
      }
    case 'assignment/delete':
      return {
        ...state,
        assignments: state.assignments.filter((assignment) => assignment.id !== action.payload.id),
      }
    case 'schedule/add':
      return { ...state, schedule: [...state.schedule, action.payload] }
    case 'schedule/update':
      return {
        ...state,
        schedule: state.schedule.map((entry) => entry.id === action.payload.id ? action.payload : entry),
      }
    case 'schedule/delete':
      return { ...state, schedule: state.schedule.filter((entry) => entry.id !== action.payload.id) }
    case 'state/replace':
      return action.payload
  }
}
