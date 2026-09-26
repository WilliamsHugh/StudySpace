import { describe, expect, it } from 'vitest'
import { validateCourse } from '../src/domain/course'

describe('validateCourse', () => {
  it('chấp nhận môn học hợp lệ', () => {
    expect(validateCourse({ name: 'Lập trình Web', teacher: 'Nguyễn An', credits: 3, color: '#6657d9' })).toEqual({})
  })

  it('từ chối tên trống và tín chỉ không hợp lệ', () => {
    const errors = validateCourse({ name: '  ', teacher: '', credits: 0, color: 'purple' })
    expect(errors.name).toBeTruthy()
    expect(errors.credits).toBeTruthy()
    expect(errors.color).toBeTruthy()
  })
})
