import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { FieldError } from '../components/FieldError'
import { Modal } from '../components/Modal'
import { CourseForm } from '../features/courses/CourseForm'
import { ScheduleForm } from '../features/schedule/ScheduleForm'

describe('Accessibility (A11y) Baseline Test Suite', () => {
  describe('Modal dialog accessibility', () => {
    it('provides proper ARIA attributes and labels for screen readers', () => {
      const onClose = vi.fn()
      render(
        <Modal title="Thêm môn học mới" onClose={onClose}>
          <p>Nội dung modal</p>
        </Modal>,
      )

      const dialog = screen.getByRole('dialog')
      expect(dialog).toBeInTheDocument()
      expect(dialog).toHaveAttribute('aria-modal', 'true')
      expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title')

      const heading = screen.getByRole('heading', { level: 2, name: 'Thêm môn học mới' })
      expect(heading).toHaveAttribute('id', 'modal-title')

      const closeButton = screen.getByRole('button', { name: 'Đóng' })
      expect(closeButton).toHaveAttribute('aria-label', 'Đóng')
    })

    it('triggers onClose when pressing the Escape key', () => {
      const onClose = vi.fn()
      render(
        <Modal title="Modal Test" onClose={onClose}>
          <div>Child</div>
        </Modal>,
      )

      fireEvent.keyDown(window, { key: 'Escape' })
      expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('closes when clicking the backdrop outside dialog', () => {
      const onClose = vi.fn()
      const { container } = render(
        <Modal title="Backdrop Test" onClose={onClose}>
          <div>Content</div>
        </Modal>,
      )

      const backdrop = container.querySelector('.modal-backdrop')
      expect(backdrop).not.toBeNull()
      if (backdrop) {
        fireEvent.mouseDown(backdrop)
        expect(onClose).toHaveBeenCalledTimes(1)
      }
    })

    it('traps Tab key navigation inside modal focusable elements', () => {
      render(
        <Modal title="Focus Trap Modal" onClose={vi.fn()}>
          <div>
            <input aria-label="First input" type="text" />
            <button type="button">Action Button</button>
          </div>
        </Modal>,
      )

      const closeBtn = screen.getByRole('button', { name: 'Đóng' })
      const actionBtn = screen.getByRole('button', { name: 'Action Button' })

      // Focus last element (Action Button), press Tab -> wraps to closeBtn
      actionBtn.focus()
      expect(document.activeElement).toBe(actionBtn)
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' })
      expect(document.activeElement).toBe(closeBtn)

      // Shift+Tab on closeBtn -> wraps to actionBtn
      fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab', shiftKey: true })
      expect(document.activeElement).toBe(actionBtn)
    })
  })

  describe('Form accessibility & labels', () => {
    it('associates all CourseForm inputs with labels via htmlFor/id', () => {
      render(<CourseForm onSave={vi.fn()} onCancel={vi.fn()} />)

      const nameInput = screen.getByLabelText(/Tên môn học/i)
      expect(nameInput).toHaveAttribute('id', 'course-name')

      const teacherInput = screen.getByLabelText(/Giảng viên/i)
      expect(teacherInput).toHaveAttribute('id', 'teacher')

      const creditsInput = screen.getByLabelText(/Số tín chỉ/i)
      expect(creditsInput).toHaveAttribute('id', 'credits')
    })

    it('sets aria-invalid="true" on invalid fields in CourseForm upon submit', () => {
      render(<CourseForm onSave={vi.fn()} onCancel={vi.fn()} />)

      const submitButton = screen.getByRole('button', { name: /Lưu môn học/i })
      fireEvent.click(submitButton)

      const nameInput = screen.getByLabelText(/Tên môn học/i)
      expect(nameInput).toHaveAttribute('aria-invalid', 'true')
    })

    it('links input error messages via aria-describedby in CourseForm', () => {
      render(<CourseForm onSave={vi.fn()} onCancel={vi.fn()} />)
      fireEvent.click(screen.getByRole('button', { name: /Lưu môn học/i }))

      const nameInput = screen.getByLabelText(/Tên môn học/i)
      expect(nameInput).toHaveAttribute('aria-describedby', 'course-name-error')
      const errorEl = document.getElementById('course-name-error')
      expect(errorEl).not.toBeNull()
      expect(errorEl).toHaveTextContent(/Tên môn học là bắt buộc/i)
    })

    it('associates all ScheduleForm inputs with labels and handles validation states', () => {
      const mockCourses = [
        { id: 'c1', name: 'Lập trình Web', teacher: 'Thầy An', credits: 3, color: '#6558d3' },
      ]
      render(<ScheduleForm courses={mockCourses} onSave={vi.fn()} onCancel={vi.fn()} />)

      expect(screen.getByLabelText(/Môn học/i)).toHaveAttribute('id', 'schedule-course')
      expect(screen.getByLabelText(/Ngày học/i)).toHaveAttribute('id', 'day')
      expect(screen.getByLabelText(/Bắt đầu/i)).toHaveAttribute('id', 'start-time')
      expect(screen.getByLabelText(/Kết thúc/i)).toHaveAttribute('id', 'end-time')
      expect(screen.getByLabelText(/Phòng học/i)).toHaveAttribute('id', 'room')

      // Submit without selecting course to trigger aria-invalid
      fireEvent.click(screen.getByRole('button', { name: /Lưu lịch học/i }))
      expect(screen.getByLabelText(/Môn học/i)).toHaveAttribute('aria-invalid', 'true')
    })

    it('FieldError renders with role="alert" and aria-live="polite"', () => {
      render(<FieldError message="Trường này là bắt buộc." />)
      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(alert).toHaveAttribute('aria-live', 'polite')
      expect(alert).toHaveTextContent('Trường này là bắt buộc.')
    })
  })

  describe('Keyboard navigation and Skip-Link', () => {
    it('renders a skip-to-content link pointing to #main-content', () => {
      render(<App />)
      const skipLink = screen.getByRole('link', { name: /Chuyển đến nội dung chính/i })
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })
  })
})
