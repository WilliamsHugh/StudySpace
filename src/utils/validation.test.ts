import { describe, expect, it } from 'vitest'
import { validateCourse, validateSchedule } from './validation'

describe('course validation', () => {
  it('requires a name and valid integer credits', () => {
    expect(validateCourse({ id: '1', name: ' ', teacher: '', credits: 0, color: '#000' })).toMatchObject({ name: expect.any(String), credits: expect.any(String) })
    expect(validateCourse({ id: '1', name: 'Web', teacher: '', credits: 3, color: '#000' })).toEqual({})
  })
})

describe('schedule validation', () => {
  it('requires a course and an end time after the start time', () => {
    expect(validateSchedule({ id: '1', courseId: '', dayOfWeek: 1, startTime: '10:00', endTime: '09:00', room: '' })).toMatchObject({ courseId: expect.any(String), endTime: expect.any(String) })
    expect(validateSchedule({ id: '1', courseId: 'c1', dayOfWeek: 2, startTime: '09:00', endTime: '10:00', room: '' })).toEqual({})
  })
})
