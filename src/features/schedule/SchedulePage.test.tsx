import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { defaultState } from '../../data/defaultState'
import type { StudySpaceState } from '../../domain/types'
import { StudySpaceProvider } from '../../state/StudySpaceContext'
import { SchedulePage } from './SchedulePage'

const state: StudySpaceState = {
  ...structuredClone(defaultState),
  courses: [{ id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 3, color: '#6558d3', createdAt: '', updatedAt: '' }],
}

describe('SchedulePage', () => {
  it('validates and creates a schedule linked to a course', async () => {
    const user = userEvent.setup()
    render(<StudySpaceProvider initialState={state}><SchedulePage /></StudySpaceProvider>)

    await user.click(screen.getByRole('button', { name: /Thêm lịch học/ }))
    await user.selectOptions(screen.getByLabelText(/Môn học/), 'c1')
    fireEvent.change(screen.getByLabelText(/Bắt đầu/), { target: { value: '10:00' } })
    fireEvent.change(screen.getByLabelText(/Kết thúc/), { target: { value: '09:00' } })
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
    expect(screen.getByText('Giờ kết thúc phải sau giờ bắt đầu.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/Kết thúc/), { target: { value: '11:00' } })
    await user.type(screen.getByLabelText(/Phòng học/), 'A1.01')
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))

    expect(screen.getByRole('heading', { name: 'Cơ sở dữ liệu' })).toBeInTheDocument()
    expect(screen.getByText('A1.01')).toBeInTheDocument()
  })
})
