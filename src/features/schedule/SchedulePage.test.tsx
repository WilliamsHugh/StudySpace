import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppDataProvider } from '../../context/AppDataContext'
import type { AppData } from '../../types'
import { SchedulePage } from './SchedulePage'

describe('SchedulePage', () => {
  it('creates a schedule linked to a course and validates time', async () => {
    const user = userEvent.setup()
    render(<AppDataProvider initialData={{ courses: [{ id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#6558d3' }], schedules: [] }}><SchedulePage /></AppDataProvider>)
    await user.click(screen.getByRole('button', { name: /Thêm lịch học/ }))
    await user.selectOptions(screen.getByLabelText(/Môn học/), 'c1')
    await user.clear(screen.getByLabelText(/Bắt đầu/))
    await user.type(screen.getByLabelText(/Bắt đầu/), '10:00')
    await user.clear(screen.getByLabelText(/Kết thúc/))
    await user.type(screen.getByLabelText(/Kết thúc/), '09:00')
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
    expect(screen.getByText('Giờ kết thúc phải sau giờ bắt đầu.')).toBeInTheDocument()
    await user.clear(screen.getByLabelText(/Kết thúc/))
    await user.type(screen.getByLabelText(/Kết thúc/), '11:00')
    await user.type(screen.getByLabelText(/Phòng học/), 'A1.01')
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
    expect(screen.getByRole('heading', { name: 'Cơ sở dữ liệu' })).toBeInTheDocument()
    expect(screen.getByText('A1.01')).toBeInTheDocument()
  })

  it('edits an existing schedule and persists the new values', async () => {
    const user = userEvent.setup()
    render(<AppDataProvider initialData={{ courses: [{ id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#6558d3' }], schedules: [{ id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'A1.01' }] }}><SchedulePage /></AppDataProvider>)

    await user.click(screen.getByRole('button', { name: 'Sửa' }))
    await user.selectOptions(screen.getByLabelText(/Ngày học/), '3')
    await user.clear(screen.getByLabelText(/Bắt đầu/))
    await user.type(screen.getByLabelText(/Bắt đầu/), '13:00')
    await user.clear(screen.getByLabelText(/Kết thúc/))
    await user.type(screen.getByLabelText(/Kết thúc/), '15:00')
    await user.clear(screen.getByLabelText(/Phòng học/))
    await user.type(screen.getByLabelText(/Phòng học/), 'B2.02')
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

    expect(screen.getByText('13:00 – 15:00')).toBeInTheDocument()
    expect(screen.getByText('B2.02')).toBeInTheDocument()
    expect(screen.queryByText('08:00 – 10:00')).not.toBeInTheDocument()
  })

  it('deletes a schedule after confirmation and keeps it after cancellation', async () => {
    const user = userEvent.setup()
    vi.stubGlobal('confirm', vi.fn(() => false))
    render(<AppDataProvider initialData={{ courses: [{ id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#6558d3' }], schedules: [{ id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'A1.01' }] }}><SchedulePage /></AppDataProvider>)

    await user.click(screen.getByRole('button', { name: 'Xóa' }))
    expect(screen.getByText('08:00 – 10:00')).toBeInTheDocument()

    vi.stubGlobal('confirm', vi.fn(() => true))
    await user.click(screen.getByRole('button', { name: 'Xóa' }))
    expect(screen.queryByText('08:00 – 10:00')).not.toBeInTheDocument()
  })

  it('warns when schedule conflicts with an existing schedule and allows confirmation to save', async () => {
    const user = userEvent.setup()
    const initialData: Partial<AppData> = {
      courses: [
        { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
        { id: 'c2', name: 'Cơ sở dữ liệu', teacher: 'Cô Hà', credits: 4, color: '#e15c8b' },
      ],
      schedules: [
        { id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '08:00', endTime: '10:00', room: 'A1.01' },
      ],
    }

    render(
      <AppDataProvider initialData={initialData}>
        <SchedulePage />
      </AppDataProvider>,
    )

    // Add conflicting schedule (same Monday, 09:00 - 11:00)
    await user.click(screen.getByRole('button', { name: /Thêm lịch học/ }))
    await user.selectOptions(screen.getByLabelText(/Môn học/), 'c2')
    fireEvent.change(screen.getByLabelText(/Bắt đầu/), { target: { value: '09:00' } })
    fireEvent.change(screen.getByLabelText(/Kết thúc/), { target: { value: '11:00' } })

    // Conflict warning should appear in form
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/Cảnh báo trùng lịch học/i)).toBeInTheDocument()

    // Submitting without checkbox triggers error
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
    expect(screen.getByText(/Lịch học bị trùng thời gian/i)).toBeInTheDocument()

    // Check confirmation checkbox and submit
    await user.click(screen.getByLabelText(/Xác nhận vẫn lưu buổi học này dù bị trùng/i))
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

    // Both cards rendered with conflict badges
    expect(screen.getByRole('heading', { name: 'Lập trình Web' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cơ sở dữ liệu' })).toBeInTheDocument()
    const badges = screen.getAllByText('Trùng lịch')
    expect(badges.length).toBeGreaterThanOrEqual(2)
  })
})
