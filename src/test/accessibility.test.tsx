import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
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
  })
})
