import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { defaultState } from '../data/defaultState'
import type { StudySpaceState } from '../domain/types'
import { StudySpaceProvider } from '../state/StudySpaceContext'
import { AssignmentsPage } from './AssignmentsPage'

const state: StudySpaceState = {
  ...structuredClone(defaultState),
  courses: [
    { id: 'c1', name: 'Web', teacher: '', credits: 3, color: '#6657d9', createdAt: '', updatedAt: '' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#2563eb', createdAt: '', updatedAt: '' },
  ],
  assignments: [
    { id: 'a1', courseId: 'c1', title: 'Bài Web muộn', description: '', dueDate: '2099-10-05T08:00', status: 'todo', createdAt: '', updatedAt: '' },
    { id: 'a2', courseId: 'c2', title: 'Bài CSDL', description: '', dueDate: '2099-10-01T08:00', status: 'in_progress', createdAt: '', updatedAt: '' },
    { id: 'a3', courseId: 'c1', title: 'Bài Web gần', description: '', dueDate: '2099-10-03T08:00', status: 'completed', createdAt: '', updatedAt: '' },
  ],
}

describe('AssignmentsPage filters', () => {
  it('sorts by deadline and combines course and status filters', async () => {
    const user = userEvent.setup()
    const { container } = render(<StudySpaceProvider initialState={state}><AssignmentsPage /></StudySpaceProvider>)

    expect([...container.querySelectorAll('.assignment-item__title strong')].map((item) => item.textContent)).toEqual([
      'Bài CSDL', 'Bài Web gần', 'Bài Web muộn',
    ])

    await user.selectOptions(screen.getByLabelText('Lọc theo môn học'), 'c1')
    await user.selectOptions(screen.getByLabelText('Lọc theo trạng thái'), 'completed')

    expect(screen.getByText('Bài Web gần')).toBeInTheDocument()
    expect(screen.queryByText('Bài Web muộn')).not.toBeInTheDocument()
    expect(screen.queryByText('Bài CSDL')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Đặt lại bộ lọc' }))
    expect(screen.getByText('Bài Web muộn')).toBeInTheDocument()
    expect(screen.getByText('Bài CSDL')).toBeInTheDocument()
  })
})
