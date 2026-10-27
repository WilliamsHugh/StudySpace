import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import App from '../App'
import { AppDataProvider, useAppData } from './AppDataContext'

describe('AppDataContext & Storage Write Error Handling', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function TestConsumer() {
    const { storageError, saveCourse, clearStorageError } = useAppData()
    return (
      <div>
        <span data-testid="error-message">{storageError ?? 'no-error'}</span>
        <button
          onClick={() => saveCourse({ id: 'c-test', name: 'Môn thử nghiệm', teacher: 'GV A', credits: 3, color: '#6558d3' })}
        >
          Lưu môn
        </button>
        <button onClick={clearStorageError}>Bỏ qua lỗi</button>
      </div>
    )
  }

  it('sets storageError and does not crash when localStorage.setItem throws QuotaExceededError', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
    })

    render(
      <AppDataProvider initialData={{ courses: [], schedules: [], assignments: [], gpaEntries: [] }}>
        <TestConsumer />
      </AppDataProvider>
    )

    // Lúc render ban đầu, effect chạy saveAppData và bắt lỗi QuotaExceededError
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Không thể lưu dữ liệu vào bộ nhớ trình duyệt'
    )

    // Thực hiện thao tác thêm môn học vẫn hoạt động an toàn mà không làm sập component
    fireEvent.click(screen.getByText('Lưu môn'))
    expect(screen.getByTestId('error-message')).toHaveTextContent(
      'Không thể lưu dữ liệu vào bộ nhớ trình duyệt'
    )

    // Nút bỏ qua lỗi hoạt động
    fireEvent.click(screen.getByText('Bỏ qua lỗi'))
    expect(screen.getByTestId('error-message')).toHaveTextContent('no-error')
  })

  it('renders storage error banner in main App shell when storage quota is exceeded', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError')
    })

    render(<App />)

    // Xác nhận banner xuất hiện trong UI chính
    const banner = screen.getByRole('alert')
    expect(banner).toBeInTheDocument()
    expect(banner).toHaveTextContent('Cảnh báo lưu trữ:')
    expect(banner).toHaveTextContent('Không thể lưu dữ liệu vào bộ nhớ trình duyệt')

    // Click nút đóng trên banner
    const closeBtn = screen.getByRole('button', { name: /Đóng thông báo lỗi lưu trữ/i })
    fireEvent.click(closeBtn)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
