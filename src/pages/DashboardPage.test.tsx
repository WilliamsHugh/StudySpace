import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DashboardPage } from './DashboardPage'
import type { AppData } from '../types'

const data: AppData = {
  courses: [],
  schedules: [],
  assignments: [
    { id: 'a1', courseId: 'c1', title: 'Bài chưa làm 1', description: '', dueDate: '2099-10-01T10:00', status: 'todo' },
    { id: 'a2', courseId: 'c1', title: 'Bài chưa làm 2', description: '', dueDate: '2099-10-02T10:00', status: 'todo' },
    { id: 'a3', courseId: 'c1', title: 'Bài đang làm', description: '', dueDate: '2099-10-03T10:00', status: 'in-progress' },
    { id: 'a4', courseId: 'c1', title: 'Bài hoàn thành', description: '', dueDate: '2099-10-04T10:00', status: 'done' },
  ],
  gpaEntries: [],
}

describe('DashboardPage', () => {
  it('shows each assignment status count separately', () => {
    render(<DashboardPage data={data} onNavigate={vi.fn()} />)

    const progressLegend = screen.getByText('Đang thực hiện').parentElement as HTMLElement
    const todoLegend = document.querySelector('.legend-todo') as HTMLElement
    expect(progressLegend.querySelector('b')).toHaveTextContent('1')
    expect(todoLegend.querySelector('b')).toHaveTextContent('2')
  })

  it('renders priority badges and tag chips for upcoming assignments', () => {
    const dataWithPriority: AppData = {
      courses: [{ id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' }],
      schedules: [],
      assignments: [
        {
          id: 'a1',
          courseId: 'c1',
          title: 'Đồ án cuối kỳ',
          description: 'Nộp slide và mã nguồn',
          dueDate: '2099-10-15T23:59',
          status: 'todo',
          priority: 'high',
          tags: ['React', 'Đồ án'],
        },
      ],
      gpaEntries: [],
    }

    render(<DashboardPage data={dataWithPriority} onNavigate={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Deadline sắp tới' })).toBeInTheDocument()
    expect(screen.getByText('Đồ án cuối kỳ')).toBeInTheDocument()
    expect(screen.getByText('Cao')).toBeInTheDocument()
    expect(screen.getByText('#React')).toBeInTheDocument()
    expect(screen.getByText('#Đồ án')).toBeInTheDocument()
  })
})
