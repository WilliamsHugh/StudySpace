import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '../App'
import { STORAGE_KEY, loadAppData, saveAppData } from './appData'

describe('Local Storage Hardening & Triage Reproduction Suite', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  describe('Issue 1: Malformed LocalStorage Payload Safety & Sanitization', () => {
    it('safely recovers when localStorage contains corrupted non-JSON string', () => {
      localStorage.setItem(STORAGE_KEY, '{ invalid json syntax !!!')
      const data = loadAppData()

      expect(data).toBeDefined()
      expect(Array.isArray(data.courses)).toBe(true)
      expect(Array.isArray(data.schedules)).toBe(true)
      expect(Array.isArray(data.assignments)).toBe(true)
      expect(Array.isArray(data.gpaEntries)).toBe(true)
      expect(data.courses.length).toBeGreaterThan(0) // Falls back to structured demo data
    })

    it('safely recovers when localStorage payload is primitive or null', () => {
      localStorage.setItem(STORAGE_KEY, 'null')
      const data = loadAppData()
      expect(data).toBeDefined()
      expect(Array.isArray(data.courses)).toBe(true)
    })

    it('sanitizes corrupt records (null, missing id, invalid types) without app crash', () => {
      const corruptPayload = {
        courses: [
          { id: 'c1', name: 'Valid Course', teacher: 'Teacher A', credits: 3, color: '#3b82f6' },
          null,
          { name: 'Missing ID' },
          { id: 123, name: 'Invalid ID type' },
        ],
        schedules: [null, { id: 's1', courseId: 'c1', dayOfWeek: 2, startTime: '08:00', endTime: '10:00' }],
        assignments: [null, { id: 'a1', courseId: 'c1', title: 'Valid Assignment', dueDate: '2026-10-30', status: 'todo' }],
        gpaEntries: [null, { id: 'g1', courseId: 'c1', expectedGrade: 8.5, credits: 3 }],
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(corruptPayload))
      const data = loadAppData()

      // Should keep only valid records and filter out corrupt ones
      expect(data.courses).toHaveLength(1)
      expect(data.courses[0].name).toBe('Valid Course')
      expect(data.schedules).toHaveLength(1)
      expect(data.assignments).toHaveLength(1)
      expect(data.gpaEntries).toHaveLength(1)
    })

    it('auto-migrates legacy v1 payload missing priority and tags', () => {
      const v1Payload = {
        courses: [{ id: 'c1', name: 'Legacy Course', teacher: 'Teacher', credits: 3, color: '#3b82f6' }],
        schedules: [],
        assignments: [
          { id: 'a1', courseId: 'c1', title: 'Legacy Assignment', dueDate: '2026-10-30', status: 'todo' },
        ],
        gpaEntries: [],
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(v1Payload))
      const data = loadAppData()

      expect(data.assignments[0].priority ?? 'medium').toBe('medium')
      expect(data.assignments[0].tags ?? []).toEqual([])
    })
  })

  describe('Issue 2: Storage QuotaExceededError and User Notification Visibility', () => {
    it('catches QuotaExceededError in saveAppData without unhandled exception and returns false', () => {
      const quotaError = new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      const mockStorage = {
        setItem: vi.fn(() => {
          throw quotaError
        }),
      }

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const result = saveAppData({ courses: [], schedules: [], assignments: [], gpaEntries: [] }, mockStorage)

      expect(result).toBe(false)
      expect(consoleSpy).toHaveBeenCalledWith('Không thể ghi dữ liệu vào localStorage:', quotaError)
    })

    it('displays visible warning banner when storage.setItem throws QuotaExceededError in UI', () => {
      // Allow initial load to succeed, then fail on subsequent save
      let initialLoaded = false
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        if (initialLoaded) {
          throw new DOMException('Storage quota exceeded', 'QuotaExceededError')
        }
      })

      render(<App />)
      initialLoaded = true

      // Trigger a state change that calls saveAppData by clicking to navigate or adding
      // We can simulate an update through trigger
      const addCourseBtn = screen.getByRole('button', { name: 'Môn học' })
      fireEvent.click(addCourseBtn)

      // Open new course modal
      fireEvent.click(screen.getByRole('button', { name: '+ Thêm môn học' }))
      const nameInput = screen.getByLabelText(/Tên môn học/i)
      fireEvent.change(nameInput, { target: { value: 'Môn học kiểm thử quota' } })
      fireEvent.click(screen.getByRole('button', { name: 'Lưu môn học' }))

      // Verify the storage error banner is rendered with role="alert"
      const alertBanner = screen.getByRole('alert')
      expect(alertBanner).toBeInTheDocument()
      expect(alertBanner).toHaveTextContent(/Không thể lưu dữ liệu vào bộ nhớ trình duyệt/i)

      // Test dismissing the banner
      const dismissBtn = screen.getByRole('button', { name: /Đóng thông báo lỗi lưu trữ/i })
      fireEvent.click(dismissBtn)
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
