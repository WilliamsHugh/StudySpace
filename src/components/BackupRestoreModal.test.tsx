import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BackupRestoreModal } from './BackupRestoreModal'
import type { AppData } from '../types'

describe('BackupRestoreModal component', () => {
  const sampleData: AppData = {
    courses: [
      { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
    ],
    schedules: [
      { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00', room: 'A101' },
    ],
    assignments: [
      { id: 'a1', courseId: 'c1', title: 'Bài tập 1', description: 'Chi tiết', dueDate: '2026-10-10', status: 'todo' },
    ],
    gpaEntries: [
      { id: 'g1', courseId: 'c1', expectedGrade: 9, credits: 3 },
    ],
  }

  const onRestoreMock = vi.fn()
  const onCloseMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.URL.createObjectURL = vi.fn().mockReturnValue('blob:dummy')
    globalThis.URL.revokeObjectURL = vi.fn()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  })

  it('renders modal with title and export buttons', () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    expect(screen.getByText('Sao lưu & Khôi phục dữ liệu')).toBeDefined()
    expect(screen.getByRole('button', { name: /Xuất toàn bộ \(JSON\)/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Xuất môn học \(CSV\)/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Xuất bài tập \(CSV\)/i })).toBeDefined()
    expect(screen.getByRole('button', { name: /Chọn tệp sao lưu/i })).toBeDefined()
  })

  it('handles JSON export click and displays success notice', () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    fireEvent.click(screen.getByRole('button', { name: /Xuất toàn bộ \(JSON\)/i }))
    expect(screen.getByRole('status')).toBeDefined()
    expect(screen.getByText(/Đã xuất bản sao lưu.*thành công/i)).toBeDefined()
  })

  it('handles CSV export clicks and displays success notices', () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    fireEvent.click(screen.getByRole('button', { name: /Xuất môn học \(CSV\)/i }))
    expect(screen.getByText(/Đã xuất danh sách môn học.*thành công/i)).toBeDefined()

    fireEvent.click(screen.getByRole('button', { name: /Xuất bài tập \(CSV\)/i }))
    expect(screen.getByText(/Đã xuất danh sách bài tập.*thành công/i)).toBeDefined()
  })

  it('shows preview and completes restore when valid backup file is selected', async () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    const backupPayload = {
      schemaVersion: 2,
      exportedAt: '2026-10-01T10:00:00.000Z',
      appVersion: '0.2.0',
      data: {
        courses: [{ id: 'c2', name: 'Toán rời rạc', teacher: 'Thầy Bình', credits: 3, color: '#e15c8b' }],
        schedules: [],
        assignments: [],
        gpaEntries: [],
      },
    }

    const file = new File([JSON.stringify(backupPayload)], 'studyspace-backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/Tải lên tệp sao lưu JSON/i)

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/Xác nhận khôi phục từ tệp/i)).toBeDefined()
      expect(screen.getByText('studyspace-backup.json', { exact: false })).toBeDefined()
      expect(screen.getByText(/Môn học:/i)).toBeDefined()
    })

    // Click confirm restore
    const confirmBtn = screen.getByRole('button', { name: /Khôi phục dữ liệu/i })
    fireEvent.click(confirmBtn)

    expect(onRestoreMock).toHaveBeenCalledWith(backupPayload.data)
    await waitFor(() => {
      expect(screen.getByText(/Khôi phục dữ liệu thành công!/)).toBeDefined()
    })
  })

  it('cancels restore and returns to main view when Hủy bỏ is clicked', async () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    const backupPayload = {
      schemaVersion: 2,
      data: {
        courses: [{ id: 'c2', name: 'Môn mới', teacher: '', credits: 3, color: '#6558d3' }],
        schedules: [],
        assignments: [],
        gpaEntries: [],
      },
    }

    const file = new File([JSON.stringify(backupPayload)], 'backup.json', { type: 'application/json' })
    const input = screen.getByLabelText(/Tải lên tệp sao lưu JSON/i)

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Hủy bỏ/i })).toBeDefined()
    })

    fireEvent.click(screen.getByRole('button', { name: /Hủy bỏ/i }))

    expect(onRestoreMock).not.toHaveBeenCalled()
    // Should be back to main options
    expect(screen.getByRole('button', { name: /Xuất toàn bộ \(JSON\)/i })).toBeDefined()
  })

  it('displays error alert when invalid file is chosen', async () => {
    render(<BackupRestoreModal data={sampleData} onRestore={onRestoreMock} onClose={onCloseMock} />)

    const file = new File(['{ broken json'], 'broken.json', { type: 'application/json' })
    const input = screen.getByLabelText(/Tải lên tệp sao lưu JSON/i)

    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeDefined()
      expect(screen.getByText(/không đúng định dạng JSON/i)).toBeDefined()
    })
    expect(onRestoreMock).not.toHaveBeenCalled()
  })
})
