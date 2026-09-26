// @vitest-environment jsdom

import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '../src/data/storage'
import type { Assignment, Course, StudySpaceState } from '../src/domain/types'
import { AssignmentsPage } from '../src/pages/AssignmentsPage'
import { StudySpaceProvider } from '../src/state/StudySpaceContext'

const courses: Course[] = [
  { id: 'web', name: 'Lập trình Web', teacher: '', credits: 3, color: '#6657d9', createdAt: '', updatedAt: '' },
  { id: 'math', name: 'Toán', teacher: '', credits: 3, color: '#4db28c', createdAt: '', updatedAt: '' },
]

const assignments: Assignment[] = [
  { id: 'web-later', courseId: 'web', title: 'Web đang làm', description: '', dueDate: '2099-09-24T10:00:00.000Z', status: 'in_progress', createdAt: '', updatedAt: '' },
  { id: 'math-todo', courseId: 'math', title: 'Toán cần làm', description: '', dueDate: '2099-09-22T10:00:00.000Z', status: 'todo', createdAt: '', updatedAt: '' },
  { id: 'web-nearer', courseId: 'web', title: 'Web đang làm gần', description: '', dueDate: '2099-09-21T10:00:00.000Z', status: 'in_progress', createdAt: '', updatedAt: '' },
  { id: 'web-overdue', courseId: 'web', title: 'Web quá hạn', description: '', dueDate: '2000-09-19T10:00:00.000Z', status: 'todo', createdAt: '', updatedAt: '' },
  { id: 'math-completed', courseId: 'math', title: 'Toán hoàn thành', description: '', dueDate: '2000-09-18T10:00:00.000Z', status: 'completed', createdAt: '', updatedAt: '' },
]

const state: StudySpaceState = {
  version: 1,
  courses,
  assignments,
  gradeExpectations: [],
  schedule: [],
  settings: { displayName: 'Test', weekStartsOn: 1, compactSidebar: false },
}

function renderPage() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return render(<StudySpaceProvider><AssignmentsPage /></StudySpaceProvider>)
}

function visibleAssignmentTitles(container: HTMLElement) {
  return Array.from(container.querySelectorAll('.assignment-item strong'), (node) => node.textContent)
}

describe('bộ lọc bài tập', () => {
  beforeEach(() => window.localStorage.clear())
  afterEach(cleanup)

  it('kết hợp bộ lọc môn học và trạng thái, đồng thời sắp deadline tăng dần', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()

    await user.selectOptions(screen.getByLabelText('Lọc theo môn học'), 'web')
    await user.selectOptions(screen.getByLabelText('Lọc theo trạng thái'), 'in_progress')

    expect(visibleAssignmentTitles(container)).toEqual(['Web đang làm gần', 'Web đang làm'])
    expect(screen.queryByText('Toán cần làm')).toBeNull()
  })

  it('lọc quá hạn nhưng không xem bài đã hoàn thành là quá hạn', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()

    await user.selectOptions(screen.getByLabelText('Lọc theo trạng thái'), 'overdue')

    expect(visibleAssignmentTitles(container)).toEqual(['Web quá hạn'])
    expect(screen.queryByText('Toán hoàn thành')).toBeNull()
  })

  it('reset về hai lựa chọn Tất cả và khôi phục toàn bộ danh sách', async () => {
    const user = userEvent.setup()
    const { container } = renderPage()
    const courseFilter = screen.getByLabelText<HTMLSelectElement>('Lọc theo môn học')
    const statusFilter = screen.getByLabelText<HTMLSelectElement>('Lọc theo trạng thái')

    expect(within(courseFilter).getByRole('option', { name: 'Tất cả' })).toBeTruthy()
    expect(within(statusFilter).getByRole('option', { name: 'Tất cả' })).toBeTruthy()
    await user.selectOptions(courseFilter, 'web')
    await user.selectOptions(statusFilter, 'in_progress')
    await user.click(screen.getByRole('button', { name: 'Đặt lại bộ lọc' }))

    expect(courseFilter.value).toBe('all')
    expect(statusFilter.value).toBe('all')
    expect(visibleAssignmentTitles(container)).toHaveLength(assignments.length)
  })

  it('hiển thị empty state khi không có kết quả phù hợp', async () => {
    const user = userEvent.setup()
    renderPage()

    await user.selectOptions(screen.getByLabelText('Lọc theo môn học'), 'web')
    await user.selectOptions(screen.getByLabelText('Lọc theo trạng thái'), 'completed')

    expect(screen.getByText('Không có bài tập phù hợp với bộ lọc.')).toBeTruthy()
  })
})
