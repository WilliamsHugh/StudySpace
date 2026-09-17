import type { StudySpaceState } from '../domain/types'

export const defaultState: StudySpaceState = {
  version: 1,
  courses: [],
  assignments: [],
  gradeExpectations: [],
  schedule: [],
  settings: {
    displayName: 'Minh Anh',
    weekStartsOn: 1,
    compactSidebar: false,
  },
}
