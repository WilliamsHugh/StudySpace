import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { defaultState } from '../data/defaultState'
import type { StudySpaceState } from '../domain/types'
import { StudySpaceProvider, useStudySpace } from '../state/StudySpaceContext'
import { GpaPage } from './GpaPage'

const state: StudySpaceState = {
  ...structuredClone(defaultState),
  courses: [{
    id: 'course-1', name: 'Cơ sở dữ liệu', teacher: '', credits: 4,
    color: '#6657d9', createdAt: '', updatedAt: '',
  }],
}

function GradeProbe() {
  const { state: current } = useStudySpace()
  const expectation = current.gradeExpectations[0]
  return <output aria-label="GPA state">{current.gradeExpectations.length}:{expectation?.expectedScore ?? 'none'}</output>
}

describe('GpaPage', () => {
  it('updates the effective entry when the same course score changes', async () => {
    const user = userEvent.setup()
    render(<StudySpaceProvider initialState={state}><GpaPage /><GradeProbe /></StudySpaceProvider>)
    const input = screen.getByRole('spinbutton', { name: 'Điểm hệ 10 của Cơ sở dữ liệu' })

    await user.type(input, '9')
    expect(screen.getByLabelText('GPA state')).toHaveTextContent('1:9')
    expect(screen.getByText('4.00')).toBeInTheDocument()

    await user.clear(input)
    await user.type(input, '7')
    expect(screen.getByLabelText('GPA state')).toHaveTextContent('1:7')
    expect(screen.getByText('3.00')).toBeInTheDocument()
  })
})
