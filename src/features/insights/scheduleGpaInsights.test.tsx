import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppDataProvider, useAppData } from '../../context/AppDataContext'
import { SchedulePage } from '../../features/schedule/SchedulePage'
import { DashboardPage } from '../../pages/DashboardPage'
import { GpaPage } from '../../pages/GpaPage'
import type { AppData, Course, Schedule } from '../../types'

function ScheduleTestApp() {
  return <SchedulePage />
}

function GpaTestApp() {
  const { updateData, saveCourse: _sc, deleteCourse: _dc, saveSchedule: _ss, deleteSchedule: _ds, ...data } = useAppData()
  return <GpaPage data={data} updateData={updateData} />
}

function DashboardTestApp() {
  const { updateData: _u, saveCourse: _sc, deleteCourse: _dc, saveSchedule: _ss, deleteSchedule: _ds, ...data } = useAppData()
  return <DashboardPage data={data} onNavigate={vi.fn()} />
}

describe('Milestone W4: Schedule Conflict Detection, GPA Scenarios & Weekly Workload', () => {
  const mockCourses: Course[] = [
    { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
    { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hà', credits: 4, color: '#e15c8b' },
  ]

  const mockSchedules: Schedule[] = [
    { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A2.04' },
  ]

  const initialData: AppData = {
    courses: mockCourses,
    schedules: mockSchedules,
    assignments: [
      { id: 'a1', courseId: 'c1', title: 'Bài tập 1', description: '', dueDate: '2026-10-13T23:59', status: 'todo' },
    ],
    gpaEntries: [
      { id: 'g1', courseId: 'c1', expectedGrade: 7.0, credits: 3 },
      { id: 'g2', courseId: 'c2', expectedGrade: 8.0, credits: 4 },
    ],
  }

  beforeEach(() => {
    localStorage.clear()
    window.scrollTo = vi.fn()
  })

  describe('1. Schedule Conflict Detection in SchedulePage', () => {
    it('detects time conflict and shows warning with option to confirm or cancel', async () => {
      const user = userEvent.setup()
      render(
        <AppDataProvider initialData={initialData}>
          <ScheduleTestApp />
        </AppDataProvider>,
      )

      // Open Add Schedule Modal
      await user.click(screen.getByRole('button', { name: '+ Thêm lịch học' }))
      expect(screen.getByRole('heading', { name: 'Thêm lịch học' })).toBeInTheDocument()

      // Select course c2 (Cơ sở dữ liệu)
      const courseSelect = screen.getByRole('combobox', { name: /Môn học/i })
      await user.selectOptions(courseSelect, 'c2')

      // Select Thứ Ba (dayOfWeek = 2)
      const daySelect = screen.getByRole('combobox', { name: /Ngày học/i })
      await user.selectOptions(daySelect, '2')

      // Set overlapping time: 09:00 - 11:00 (overlaps with s1: 08:00 - 10:00)
      const startTimeInput = screen.getByLabelText(/Bắt đầu/i)
      const endTimeInput = screen.getByLabelText(/Kết thúc/i)
      fireEvent.change(startTimeInput, { target: { value: '09:00' } })
      fireEvent.change(endTimeInput, { target: { value: '11:00' } })

      // Conflict warning box should appear
      const warningBox = screen.getByRole('alert')
      expect(warningBox).toBeInTheDocument()
      expect(warningBox).toHaveTextContent('Cảnh báo trùng lịch học')
      expect(warningBox).toHaveTextContent('Lập trình Web')
      expect(warningBox).toHaveTextContent('08:00 – 10:00')
      expect(warningBox).toHaveTextContent('Phòng A2.04')

      // Submitting without checking confirmation should be blocked
      await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
      expect(screen.getByText(/Lịch học bị trùng thời gian với buổi học khác/i)).toBeInTheDocument()

      // Checking confirmation allows saving
      const confirmCheckbox = screen.getByRole('checkbox', { name: /Xác nhận vẫn lưu buổi học này dù bị trùng/i })
      await user.click(confirmCheckbox)
      await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

      // Modal closes and new schedule is saved
      expect(screen.queryByRole('heading', { name: 'Thêm lịch học' })).not.toBeInTheDocument()
      expect(screen.getByText('09:00 – 11:00')).toBeInTheDocument()
      expect(screen.getAllByText('Trùng lịch').length).toBeGreaterThanOrEqual(1)
    })

    it('allows saving without conflict warning when schedule is on another day or adjacent hour', async () => {
      const user = userEvent.setup()
      render(
        <AppDataProvider initialData={initialData}>
          <ScheduleTestApp />
        </AppDataProvider>,
      )

      await user.click(screen.getByRole('button', { name: '+ Thêm lịch học' }))
      const courseSelect = screen.getByRole('combobox', { name: /Môn học/i })
      await user.selectOptions(courseSelect, 'c2')

      // Adjacent time on same day: 10:00 - 12:00 (s1 ends at 10:00)
      const daySelect = screen.getByRole('combobox', { name: /Ngày học/i })
      await user.selectOptions(daySelect, '2')

      const startTimeInput = screen.getByLabelText(/Bắt đầu/i)
      const endTimeInput = screen.getByLabelText(/Kết thúc/i)
      fireEvent.change(startTimeInput, { target: { value: '10:00' } })
      fireEvent.change(endTimeInput, { target: { value: '12:00' } })

      // No conflict warning
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

      // Saved successfully
      expect(screen.queryByRole('heading', { name: 'Thêm lịch học' })).not.toBeInTheDocument()
      expect(screen.getByText('10:00 – 12:00')).toBeInTheDocument()
    })
  })

  describe('2. GPA What-If Scenarios in GpaPage', () => {
    it('simulates scenario grades without mutating main data until applied', async () => {
      const user = userEvent.setup()
      render(
        <AppDataProvider initialData={initialData}>
          <GpaTestApp />
        </AppDataProvider>,
      )

      // Initial GPA display: c1 (7.0 -> 3.0 * 3 = 9) + c2 (8.0 -> 3.5 * 4 = 14) => 23 / 7 = 3.29
      expect(screen.getByText('3.29')).toBeInTheDocument()

      // Toggle scenario mode
      const toggleBtn = screen.getByRole('button', { name: /Thử nghiệm kịch bản GPA/i })
      await user.click(toggleBtn)

      expect(screen.getByRole('heading', { name: /So sánh các kịch bản GPA mục tiêu/i })).toBeInTheDocument()
      expect(screen.getByText('GPA KỊCH BẢN DỰ KIẾN')).toBeInTheDocument()

      // Adjust trial grade for c1 to 9.5 (4.0)
      const trialInputC1 = screen.getByLabelText('Điểm thử nghiệm môn Lập trình Web')
      await user.clear(trialInputC1)
      await user.type(trialInputC1, '9.5')

      // Adjust trial grade for c2 to 9.0 (4.0)
      const trialInputC2 = screen.getByLabelText('Điểm thử nghiệm môn Cơ sở dữ liệu')
      await user.clear(trialInputC2)
      await user.type(trialInputC2, '9.0')

      // Scenario GPA is now 4.00, difference is positive
      expect(screen.getByText('4.00')).toBeInTheDocument()
      expect(screen.getByText('+0.71')).toBeInTheDocument()

      // Reset scenario button restores original trial values
      await user.click(screen.getByRole('button', { name: 'Đặt lại kịch bản' }))
      expect(trialInputC1).toHaveValue(7)
      expect(trialInputC2).toHaveValue(8)

      // Now set higher grades again and apply
      await user.clear(trialInputC1)
      await user.type(trialInputC1, '9.5')
      await user.click(screen.getByRole('button', { name: /Áp dụng kịch bản vào điểm chính thức/i }))

      expect(screen.getByText(/Đã áp dụng thành công kịch bản vào điểm dự kiến chính thức/i)).toBeInTheDocument()
    })
  })

  describe('3. Weekly Workload Widget in DashboardPage', () => {
    it('renders 7-day workload distribution with status badges and metrics', () => {
      render(
        <AppDataProvider initialData={initialData}>
          <DashboardTestApp />
        </AppDataProvider>,
      )

      const workloadSection = screen.getByRole('region', { name: 'Tải học tập theo tuần' })
      expect(workloadSection).toBeInTheDocument()

      // Check summary bar
      expect(within(workloadSection).getByText(/1 buổi học/i)).toBeInTheDocument()
      expect(within(workloadSection).getAllByText(/Thứ Hai/i).length).toBeGreaterThanOrEqual(1)
      expect(within(workloadSection).getAllByText(/Thứ Ba/i).length).toBeGreaterThanOrEqual(1)
      expect(within(workloadSection).getAllByText(/Chủ Nhật/i).length).toBeGreaterThanOrEqual(1)

      // Check status labels
      expect(within(workloadSection).getAllByText('Vừa phải').length).toBeGreaterThanOrEqual(1)
      expect(within(workloadSection).getAllByText('Rảnh rỗi').length).toBeGreaterThanOrEqual(1)
    })
  })
})
