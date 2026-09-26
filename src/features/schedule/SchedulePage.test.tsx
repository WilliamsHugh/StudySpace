import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { AppDataProvider } from '../../context/AppDataContext'
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
})
