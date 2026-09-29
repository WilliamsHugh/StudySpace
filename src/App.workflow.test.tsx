import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { defaultState } from './data/defaultState'
import type { StorageLike } from './data/storage'
import { StudySpaceProvider } from './state/StudySpaceContext'

function memoryStorage(): StorageLike & { value: string | null } {
  return {
    value: null,
    getItem() { return this.value },
    setItem(_key, value) { this.value = value },
  }
}

describe('StudySpace full workflow', () => {
  it('persists a course, schedule, assignment, GPA, and dashboard summary', async () => {
    const user = userEvent.setup()
    const storage = memoryStorage()
    const { container } = render(<StudySpaceProvider initialState={structuredClone(defaultState)} storage={storage}><App /></StudySpaceProvider>)

    await user.click(screen.getByRole('button', { name: 'Môn học' }))
    await user.type(screen.getByLabelText('Tên môn học'), 'Kiểm thử phần mềm')
    await user.type(screen.getByLabelText('Giảng viên'), 'Nguyễn An')
    await user.click(screen.getByRole('button', { name: 'Thêm môn học' }))
    expect(screen.getByText('Kiểm thử phần mềm')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Lịch học' }))
    await user.click(screen.getByRole('button', { name: '+ Thêm lịch học' }))
    await user.selectOptions(screen.getByLabelText(/Môn học/), screen.getByRole('option', { name: 'Kiểm thử phần mềm' }))
    await user.type(screen.getByLabelText('Phòng học'), 'A1.01')
    await user.click(screen.getByRole('button', { name: 'Lưu lịch học' }))
    expect(screen.getByText('A1.01')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Bài tập' }))
    await user.type(screen.getByLabelText('Tên bài tập'), 'Báo cáo cuối kỳ')
    fireEvent.change(screen.getByLabelText('Hạn nộp'), { target: { value: '2099-10-01T08:00' } })
    await user.click(screen.getByRole('button', { name: 'Thêm bài tập' }))
    expect(screen.getByText('Báo cáo cuối kỳ')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'GPA dự kiến' }))
    await user.type(screen.getByRole('spinbutton', { name: 'Điểm hệ 10 của Kiểm thử phần mềm' }), '8')
    expect(screen.getByText('3.50')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tổng quan' }))
    const studyStat = screen.getByText('HỌC TẬP').closest('article')
    const workStat = screen.getByText('CÔNG VIỆC').closest('article')
    expect(studyStat).toHaveTextContent('1 môn học')
    expect(workStat).toHaveTextContent('1 nhiệm vụ')
    expect(container.querySelector('.dash-stat-icon.green')?.parentElement).toHaveTextContent('3.50')

    await waitFor(() => expect(storage.value).toContain('Báo cáo cuối kỳ'))
    expect(storage.value).toContain('A1.01')
    expect(storage.value).toContain('"expectedScore":8')
  })
})
