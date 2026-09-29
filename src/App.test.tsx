import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { defaultState } from './data/defaultState'
import type { StudySpaceState } from './domain/types'
import { StudySpaceProvider } from './state/StudySpaceContext'

const state: StudySpaceState = {
  ...structuredClone(defaultState),
  courses: [{ id: 'c1', name: 'Kiểm thử phần mềm', teacher: '', credits: 3, color: '#6657d9', createdAt: '', updatedAt: '' }],
}

describe('App navigation', () => {
  it('opens every feature page from the shared application shell', async () => {
    const user = userEvent.setup()
    render(<StudySpaceProvider initialState={state}><App /></StudySpaceProvider>)

    expect(screen.getByRole('heading', { name: /bắt đầu nhé/i })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Môn học' }))
    expect(screen.getByRole('heading', { name: 'Môn học của bạn' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Lịch học' }))
    expect(screen.getByRole('heading', { name: 'Thời khóa biểu' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Bài tập' }))
    expect(screen.getByRole('heading', { name: 'Danh sách bài tập' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'GPA dự kiến' }))
    expect(screen.getByRole('heading', { name: 'Điểm dự kiến theo môn' })).toBeInTheDocument()
  })
})
