import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { defaultState } from '../data/defaultState'
import type { StudySpaceState } from '../domain/types'
import { StudySpaceProvider } from '../state/StudySpaceContext'
import { DashboardPage } from './DashboardPage'

const state: StudySpaceState = {
  ...structuredClone(defaultState),
  assignments: [
    { id: 'a1', courseId: 'c1', title: 'Cần làm 1', description: '', dueDate: '2099-10-01T10:00', status: 'todo', createdAt: '', updatedAt: '' },
    { id: 'a2', courseId: 'c1', title: 'Cần làm 2', description: '', dueDate: '2099-10-02T10:00', status: 'todo', createdAt: '', updatedAt: '' },
    { id: 'a3', courseId: 'c1', title: 'Đang làm', description: '', dueDate: '2099-10-03T10:00', status: 'in_progress', createdAt: '', updatedAt: '' },
    { id: 'a4', courseId: 'c1', title: 'Hoàn thành', description: '', dueDate: '2099-10-04T10:00', status: 'completed', createdAt: '', updatedAt: '' },
  ],
}

describe('DashboardPage', () => {
  it('reports each assignment status separately', () => {
    render(<StudySpaceProvider initialState={state}><DashboardPage onNavigate={vi.fn()} /></StudySpaceProvider>)

    expect(screen.getByText('Đang thực hiện').querySelector('b')).toHaveTextContent('1')
    expect(document.querySelector('.legend-todo b')).toHaveTextContent('2')
    expect(document.querySelector('.legend-done b')).toHaveTextContent('1')
  })
})
