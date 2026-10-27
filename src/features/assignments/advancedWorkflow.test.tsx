import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppDataProvider, useAppData } from '../../context/AppDataContext'
import { AssignmentsPage } from '../../pages/AssignmentsPage'
import type { AppData, Assignment, Course } from '../../types'

function TestApp() {
  const appData = useAppData()
  const { updateData, saveCourse: _saveCourse, deleteCourse: _deleteCourse, saveSchedule: _saveSchedule, deleteSchedule: _deleteSchedule, ...data } = appData
  return <AssignmentsPage data={data} updateData={updateData} />
}

describe('Advanced Assignments Workflow: Priority, Tags & Smart Filters', () => {
  const mockCourses: Course[] = [
    { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hà', credits: 4, color: '#e15c8b' },
  ]

  const mockAssignments: Assignment[] = [
    {
      id: 'a1',
      courseId: 'c1',
      title: 'Xây dựng giao diện React',
      description: 'Làm responsive mobile và kiểm thử Vitest',
      dueDate: '2026-10-15T23:59',
      status: 'in-progress',
      priority: 'high',
      tags: ['Frontend', 'React'],
    },
    {
      id: 'a2',
      courseId: 'c2',
      title: 'Tối ưu truy vấn SQL',
      description: 'Đánh chỉ mục Index cho bảng sinh viên',
      dueDate: '2026-10-20T17:00',
      status: 'todo',
      priority: 'medium',
      tags: ['Backend', 'Database'],
    },
    {
      id: 'a3',
      courseId: 'c1',
      title: 'Đọc tài liệu CSS Grid',
      description: 'Nghiên cứu flexbox và grid',
      dueDate: '2026-09-01T10:00', // overdue
      status: 'todo',
      priority: 'low',
      tags: ['Frontend', 'CSS'],
    },
    {
      id: 'a4',
      courseId: 'c2',
      title: 'Báo cáo đồ án kết thúc môn',
      description: 'Nộp slide và mã nguồn',
      dueDate: '2026-10-25T23:59',
      status: 'done',
      priority: 'high',
      tags: ['Đồ án'],
    },
  ]

  const initialData: AppData = {
    courses: mockCourses,
    schedules: [],
    assignments: mockAssignments,
    gpaEntries: [],
  }

  beforeEach(() => {
    localStorage.clear()
    window.scrollTo = vi.fn()
  })

  it('renders assignment cards with priority badges and tag chips', () => {
    render(
      <AppDataProvider initialData={initialData}>
        <TestApp />
      </AppDataProvider>,
    )

    // Check titles
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tối ưu truy vấn SQL' })).toBeInTheDocument()

    // Check priority badges
    expect(screen.getAllByText('Cao').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Trung bình').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Thấp').length).toBeGreaterThanOrEqual(1)

    // Check tags
    expect(screen.getByText('#React')).toBeInTheDocument()
    expect(screen.getByText('#Database')).toBeInTheDocument()
    expect(screen.getByText('#Đồ án')).toBeInTheDocument()

    // Check overdue badge exists
    expect(screen.getAllByText('Quá hạn').length).toBeGreaterThanOrEqual(1)
  })

  it('creates a new assignment with selected priority and comma-separated tags', async () => {
    const user = userEvent.setup()
    render(
      <AppDataProvider initialData={initialData}>
        <TestApp />
      </AppDataProvider>,
    )

    // Select course in form
    const courseSelect = screen.getByRole('combobox', { name: /^Môn học$/i })
    await user.selectOptions(courseSelect, 'c1')

    await user.type(screen.getByPlaceholderText(/Ví dụ: Nộp báo cáo/i), 'Bài tập Redux Toolkit')
    await user.type(screen.getByPlaceholderText(/Ghi chú/i), 'Thực hành slice và thunk')
    await user.type(screen.getByLabelText(/Hạn nộp/i), '2026-10-30T10:00')

    const prioritySelect = screen.getByRole('combobox', { name: 'Mức ưu tiên bài tập' })
    await user.selectOptions(prioritySelect, 'high')

    await user.type(screen.getByPlaceholderText(/Ví dụ: Báo cáo, Đồ án/i), 'State, Redux, React')

    await user.click(screen.getByRole('button', { name: 'Thêm bài tập' }))

    // Verify added card
    expect(screen.getByRole('heading', { name: 'Bài tập Redux Toolkit' })).toBeInTheDocument()
    expect(screen.getByText('#State')).toBeInTheDocument()
    expect(screen.getByText('#Redux')).toBeInTheDocument()
  })

  it('filters assignments by search query in title, description, or tags', async () => {
    const user = userEvent.setup()
    render(
      <AppDataProvider initialData={initialData}>
        <TestApp />
      </AppDataProvider>,
    )

    const searchInput = screen.getByLabelText('Tìm kiếm bài tập')

    // 1. Search by title
    await user.type(searchInput, 'React')
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Tối ưu truy vấn SQL' })).not.toBeInTheDocument()

    // 2. Search by description keyword
    await user.clear(searchInput)
    await user.type(searchInput, 'chỉ mục')
    expect(screen.getByRole('heading', { name: 'Tối ưu truy vấn SQL' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Xây dựng giao diện React' })).not.toBeInTheDocument()

    // 3. Search by tag
    await user.clear(searchInput)
    await user.type(searchInput, 'Đồ án')
    expect(screen.getByRole('heading', { name: 'Báo cáo đồ án kết thúc môn' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Xây dựng giao diện React' })).not.toBeInTheDocument()

    // 4. Non-matching search displays empty state
    await user.clear(searchInput)
    await user.type(searchInput, 'từ khóa không tồn tại')
    expect(screen.getByText('Chưa có bài tập phù hợp')).toBeInTheDocument()
  })

  it('combines multiple filters (Course + Status + Priority) and resets them', async () => {
    const user = userEvent.setup()
    render(
      <AppDataProvider initialData={initialData}>
        <TestApp />
      </AppDataProvider>,
    )

    // Filter by Course: c1 (Lập trình Web)
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo môn' }), 'c1')
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Đọc tài liệu CSS Grid' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Tối ưu truy vấn SQL' })).not.toBeInTheDocument()

    // Filter by Priority: high
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo mức ưu tiên' }), 'high')
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Đọc tài liệu CSS Grid' })).not.toBeInTheDocument()

    // Filter by Status: in-progress
    await user.selectOptions(screen.getByRole('combobox', { name: 'Lọc theo trạng thái' }), 'in-progress')
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()

    // Click "Đặt lại" button to clear all filters
    const resetBtn = screen.getByRole('button', { name: 'Đặt lại' })
    expect(resetBtn).toBeInTheDocument()
    await user.click(resetBtn)

    // All assignments are visible again
    expect(screen.getByRole('heading', { name: 'Xây dựng giao diện React' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tối ưu truy vấn SQL' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Đọc tài liệu CSS Grid' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Báo cáo đồ án kết thúc môn' })).toBeInTheDocument()
  })

  it('edits an assignment and updates priority and tags correctly', async () => {
    const user = userEvent.setup()
    render(
      <AppDataProvider initialData={initialData}>
        <TestApp />
      </AppDataProvider>,
    )

    // Click Sửa on first assignment (Xây dựng giao diện React)
    const editButtons = screen.getAllByRole('button', { name: 'Sửa' })
    await user.click(editButtons[0])

    expect(screen.getByRole('heading', { name: 'Cập nhật bài tập' })).toBeInTheDocument()

    // Change priority to low and tags
    const prioritySelect = screen.getByRole('combobox', { name: 'Mức ưu tiên bài tập' })
    await user.selectOptions(prioritySelect, 'low')

    const tagInput = screen.getByPlaceholderText(/Ví dụ: Báo cáo, Đồ án/i)
    await user.clear(tagInput)
    await user.type(tagInput, 'UI, Design')

    await user.click(screen.getByRole('button', { name: 'Lưu thay đổi' }))

    // Verify updated tags
    expect(screen.getByText('#UI')).toBeInTheDocument()
    expect(screen.getByText('#Design')).toBeInTheDocument()
  })
})
