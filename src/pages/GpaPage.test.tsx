import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { GpaPage } from './GpaPage'
import type { AppData } from '../types'

const data: AppData = {
  courses: [
    { id: 'c1', name: 'Cơ sở dữ liệu', teacher: '', credits: 4, color: '#6558d3' },
    { id: 'c2', name: 'Tiếng Anh', teacher: '', credits: 2, color: '#2563eb' },
  ],
  schedules: [],
  assignments: [],
  gpaEntries: [
    { id: 'g1', courseId: 'c1', expectedGrade: 8, credits: 4 },
    { id: 'g2', courseId: 'c2', expectedGrade: 7, credits: 2 },
  ],
}

describe('GpaPage', () => {
  it('highlights the course with the most credits in the entered results', () => {
    render(<GpaPage data={data} updateData={vi.fn()} />)

    const highCreditCourseCell = screen.getAllByText('Cơ sở dữ liệu').find((element) => element.tagName === 'TD')
    const regularCourseCell = screen.getAllByText('Tiếng Anh').find((element) => element.tagName === 'TD')
    const highCreditRow = highCreditCourseCell?.closest('tr')
    const regularRow = regularCourseCell?.closest('tr')
    expect(highCreditRow).toHaveClass('high-credit-row')
    expect(within(highCreditRow as HTMLElement).getByText('Nhiều tín chỉ')).toBeInTheDocument()
    expect(regularRow).not.toHaveClass('high-credit-row')
  })

  it('opens scenario comparison mode and simulates trial grades without modifying base entries', async () => {
    const user = userEvent.setup()
    const updateDataMock = vi.fn()
    render(<GpaPage data={data} updateData={updateDataMock} />)

    // Open scenario mode
    const openScenarioBtn = screen.getByRole('button', { name: /Thử nghiệm kịch bản GPA/i })
    expect(openScenarioBtn).toBeInTheDocument()
    await user.click(openScenarioBtn)

    // Verify scenario panel is visible
    expect(screen.getByRole('heading', { name: /So sánh các kịch bản GPA/i })).toBeInTheDocument()
    expect(screen.getByText('GPA KỊCH BẢN DỰ KIẾN')).toBeInTheDocument()
    expect(screen.getByText('CHÊNH LỆCH DỰ KIẾN')).toBeInTheDocument()

    // Base data update has not been called yet
    expect(updateDataMock).not.toHaveBeenCalled()

    // Click apply to commit scenario to main data
    const applyBtn = screen.getByRole('button', { name: /Áp dụng kịch bản vào điểm chính thức/i })
    await user.click(applyBtn)
    expect(updateDataMock).toHaveBeenCalled()
  })
})
