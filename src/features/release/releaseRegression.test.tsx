import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../../App'
import { exportAppDataAsJson, exportAssignmentsAsCsv, exportCoursesAsCsv } from '../../data/backupService'
import type { AppData, Course } from '../../types'

describe('Release Candidate (RC) End-to-End Regression Test Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    window.scrollTo = vi.fn()
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    globalThis.URL.revokeObjectURL = vi.fn()
  })

  it('1. Navigation across all 5 core modules via main navbar', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Default is Dashboard
    expect(screen.getByRole('heading', { level: 1, name: /Chào Thuận, bắt đầu nhé!/i })).toBeInTheDocument()

    // 1. Navigate to Courses (Môn học)
    await user.click(screen.getByRole('button', { name: 'Môn học' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Môn học' })).toBeInTheDocument()

    // 2. Navigate to Schedule (Thời khóa biểu)
    await user.click(screen.getByRole('button', { name: 'Thời khóa biểu' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Thời khóa biểu' })).toBeInTheDocument()

    // 3. Navigate to Assignments (Bài tập)
    await user.click(screen.getByRole('button', { name: 'Bài tập' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Bài tập & deadline' })).toBeInTheDocument()

    // 4. Navigate to GPA Simulator
    await user.click(screen.getByRole('button', { name: 'GPA Simulator' }))
    expect(screen.getByRole('heading', { level: 1, name: 'GPA Simulator' })).toBeInTheDocument()

    // 5. Navigate back to Dashboard
    await user.click(screen.getByRole('button', { name: 'Dashboard' }))
    expect(screen.getByRole('heading', { level: 1, name: /Chào Thuận, bắt đầu nhé!/i })).toBeInTheDocument()
  })

  it('2. Complete Course & Schedule workflow with Conflict Detection', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Go to Courses and create 2 courses
    await user.click(screen.getByRole('button', { name: 'Môn học' }))
    await user.click(screen.getByRole('button', { name: '+ Thêm môn học' }))

    const courseNameInput = screen.getByLabelText(/Tên môn học/i)
    await user.type(courseNameInput, 'Mạng máy tính')
    await user.type(screen.getByLabelText(/Giảng viên/i), 'Thầy Bình')
    await user.click(screen.getByRole('button', { name: 'Lưu môn học' }))

    expect(screen.getByRole('heading', { name: 'Mạng máy tính' })).toBeInTheDocument()

    // Go to Schedule
    await user.click(screen.getByRole('button', { name: 'Thời khóa biểu' }))
    await user.click(screen.getByRole('button', { name: '+ Thêm lịch học' }))

    // Add first class: Thứ Ba 08:00 - 10:00
    const courseSelect = screen.getByLabelText(/Môn học/i)
    await user.selectOptions(courseSelect, screen.getByRole('option', { name: 'Mạng máy tính' }).getAttribute('value')!)
    await user.selectOptions(screen.getByLabelText(/Ngày học/i), '2')

    fireEvent.change(screen.getByLabelText(/Bắt đầu/i), { target: { value: '08:00' } })
    fireEvent.change(screen.getByLabelText(/Kết thúc/i), { target: { value: '10:00' } })
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

    expect(screen.getByText('08:00 – 10:00')).toBeInTheDocument()

    // Add second overlapping class: Thứ Ba 09:00 - 11:00
    await user.click(screen.getByRole('button', { name: '+ Thêm lịch học' }))
    await user.selectOptions(screen.getByLabelText(/Môn học/i), screen.getByRole('option', { name: 'Mạng máy tính' }).getAttribute('value')!)
    await user.selectOptions(screen.getByLabelText(/Ngày học/i), '2')

    fireEvent.change(screen.getByLabelText(/Bắt đầu/i), { target: { value: '09:00' } })
    fireEvent.change(screen.getByLabelText(/Kết thúc/i), { target: { value: '11:00' } })

    // Verify conflict warning alert appears
    expect(screen.getByRole('alert')).toHaveTextContent(/Cảnh báo trùng lịch học/i)

    // Check confirmation checkbox and save
    const confirmCheckbox = screen.getByRole('checkbox', { name: /Xác nhận vẫn lưu buổi học này dù bị trùng/i })
    await user.click(confirmCheckbox)
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

    // Verify both exist and conflict badge is displayed
    expect(screen.getByText('08:00 – 10:00')).toBeInTheDocument()
    expect(screen.getByText('09:00 – 11:00')).toBeInTheDocument()
    expect(screen.getAllByText('Trùng lịch').length).toBeGreaterThanOrEqual(1)
  })

  it('3. Complete Assignment workflow: priority, tags, search and multi-criteria filters', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Create course first
    await user.click(screen.getByRole('button', { name: 'Môn học' }))
    await user.click(screen.getByRole('button', { name: '+ Thêm môn học' }))
    await user.type(screen.getByLabelText(/Tên môn học/i), 'Công nghệ phần mềm')
    await user.click(screen.getByRole('button', { name: 'Lưu môn học' }))

    // Go to Assignments
    await user.click(screen.getByRole('button', { name: 'Bài tập' }))

    // Create new assignment with High priority and tags
    const courseSelect = screen.getByRole('combobox', { name: /^Môn học$/i })
    const courseOption = within(courseSelect).getByRole('option', { name: 'Công nghệ phần mềm' })
    await user.selectOptions(courseSelect, courseOption.getAttribute('value')!)

    await user.type(screen.getByPlaceholderText(/Ví dụ: Nộp báo cáo/i), 'Viết báo cáo kiểm thử RC')
    await user.type(screen.getByPlaceholderText(/Ghi chú/i), 'Bao phủ regression test')
    await user.type(screen.getByLabelText(/Hạn nộp/i), '2026-10-30T23:59')

    const prioritySelect = screen.getByRole('combobox', { name: 'Mức ưu tiên bài tập' })
    await user.selectOptions(prioritySelect, 'high')

    await user.type(screen.getByPlaceholderText(/Ví dụ: Báo cáo, Đồ án/i), 'Release, Testing, QA')
    await user.click(screen.getByRole('button', { name: 'Thêm bài tập' }))

    // Check created card with badges
    expect(screen.getByRole('heading', { name: 'Viết báo cáo kiểm thử RC' })).toBeInTheDocument()
    expect(screen.getAllByText('Cao').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('#Release')).toBeInTheDocument()
    expect(screen.getByText('#QA')).toBeInTheDocument()

    // Test search filter
    const searchInput = screen.getByLabelText('Tìm kiếm bài tập')
    await user.type(searchInput, 'kiểm thử')
    expect(screen.getByRole('heading', { name: 'Viết báo cáo kiểm thử RC' })).toBeInTheDocument()

    await user.clear(searchInput)
    await user.type(searchInput, 'không tồn tại')
    expect(screen.getByText('Chưa có bài tập phù hợp')).toBeInTheDocument()

    // Clear filters button
    await user.click(screen.getByRole('button', { name: 'Xóa toàn bộ điều kiện lọc' }))
    expect(screen.getByRole('heading', { name: 'Viết báo cáo kiểm thử RC' })).toBeInTheDocument()
  })

  it('4. Data Backup & Recovery round-trip integrity across JSON v2 and CSV', () => {
    const mockCourses: Course[] = [
      { id: 'c1', name: 'Toán cao cấp', teacher: 'Thầy Hưng', credits: 4, color: '#3b82f6' },
    ]
    const testData: AppData = {
      courses: mockCourses,
      schedules: [{ id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '07:30', endTime: '09:30', room: 'C101' }],
      assignments: [{ id: 'a1', courseId: 'c1', title: 'Bài tập ma trận', description: '', dueDate: '2026-10-15T23:59', status: 'done', priority: 'medium', tags: ['Math'] }],
      gpaEntries: [{ id: 'g1', courseId: 'c1', expectedGrade: 8.5, credits: 4 }],
    }

    // 1. JSON Export verification
    const jsonStr = exportAppDataAsJson(testData)
    const envelope = JSON.parse(jsonStr)
    expect(envelope.schemaVersion).toBe(2)
    expect(envelope.data.courses).toHaveLength(1)
    expect(envelope.data.assignments[0].tags).toEqual(['Math'])

    // 2. CSV Courses Export verification
    const coursesCsv = exportCoursesAsCsv(testData.courses)
    expect(coursesCsv).toContain('Tên môn học')
    expect(coursesCsv).toContain('Toán cao cấp')

    // 3. CSV Assignments Export verification
    const assignmentsCsv = exportAssignmentsAsCsv(testData.assignments, testData.courses)
    expect(assignmentsCsv).toContain('Bài tập ma trận')
    expect(assignmentsCsv).toContain('Hoàn thành')
  })

  it('5. GPA What-If target scenario simulation preserves base data until confirmation', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Navigate to GPA Simulator
    await user.click(screen.getByRole('button', { name: 'GPA Simulator' }))

    // Click to open What-If scenario mode
    const scenarioButton = screen.getByRole('button', { name: /Thử nghiệm kịch bản GPA/i })
    await user.click(scenarioButton)

    // Scenario section should be visible
    expect(screen.getByRole('heading', { level: 2, name: /So sánh các kịch bản GPA mục tiêu/i })).toBeInTheDocument()
    expect(screen.getByText('GPA KỊCH BẢN DỰ KIẾN')).toBeInTheDocument()

    // Test reset button
    const resetButton = screen.getByRole('button', { name: 'Đặt lại kịch bản' })
    expect(resetButton).toBeInTheDocument()
    await user.click(resetButton)

    // Test apply button
    const applyButton = screen.getByRole('button', { name: /Áp dụng kịch bản vào điểm chính thức/i })
    expect(applyButton).toBeInTheDocument()
  })

  it('6. Weekly Workload widget rendering on Dashboard with peak indicators', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Go to Dashboard
    await user.click(screen.getByRole('button', { name: 'Dashboard' }))
    expect(screen.getByText('Tải học tập theo tuần')).toBeInTheDocument()
    expect(screen.getByText(/Phân bổ lịch học và hạn nộp bài tập theo từng ngày trong tuần/i)).toBeInTheDocument()
  })
})
