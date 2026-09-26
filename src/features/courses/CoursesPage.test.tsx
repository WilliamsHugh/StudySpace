import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { AppDataProvider } from '../../context/AppDataContext'
import { CoursesPage } from './CoursesPage'

describe('CoursesPage', () => {
  it('adds and edits a course', async () => {
    const user = userEvent.setup()
    render(<AppDataProvider initialData={{ courses: [], schedules: [] }}><CoursesPage /></AppDataProvider>)
    await user.click(screen.getByRole('button', { name: 'Thêm môn học' }))
    await user.type(screen.getByLabelText(/Tên môn học/), 'Kiểm thử phần mềm')
    await user.clear(screen.getByLabelText(/Số tín chỉ/))
    await user.type(screen.getByLabelText(/Số tín chỉ/), '4')
    await user.click(screen.getByRole('button', { name: 'Lưu môn học' }))
    expect(screen.getByRole('heading', { name: 'Kiểm thử phần mềm' })).toBeInTheDocument()
    expect(screen.getByText('4 tín chỉ')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sửa' }))
    await user.clear(screen.getByLabelText(/Tên môn học/))
    await user.type(screen.getByLabelText(/Tên môn học/), 'Đảm bảo chất lượng')
    await user.click(screen.getByRole('button', { name: 'Lưu môn học' }))
    expect(screen.getByRole('heading', { name: 'Đảm bảo chất lượng' })).toBeInTheDocument()
  })

  it('deletes a course and its schedule after confirmation', async () => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    const user = userEvent.setup()
    render(<AppDataProvider initialData={{ courses: [{ id: 'c1', name: 'Web', teacher: '', credits: 3, color: '#000' }], schedules: [{ id: 's1', courseId: 'c1', dayOfWeek: 1, startTime: '08:00', endTime: '09:00', room: '' }] }}><CoursesPage /></AppDataProvider>)
    await user.click(screen.getByRole('button', { name: 'Xóa' }))
    expect(screen.getByText('Chưa có môn học')).toBeInTheDocument()
  })
})
