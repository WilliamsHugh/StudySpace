import { describe, expect, it } from 'vitest'
import { calculateWeightedGpa, convertGrade10To4, validateGpaEntry } from './gpa'

describe('GPA calculator', () => {
  it.each([[10, 4], [8.2, 3.5], [7.4, 3], [6.7, 2.5], [5.8, 2], [5.1, 1.5], [4, 1], [3.9, 0]])(
    'converts grade %s to %s', (grade, expected) => expect(convertGrade10To4(grade)).toBe(expected),
  )

  it('rejects grades outside 0..10', () => {
    expect(convertGrade10To4(-0.1)).toBeNull()
    expect(convertGrade10To4(10.1)).toBeNull()
  })

  it('calculates the credit-weighted GPA', () => {
    expect(calculateWeightedGpa([
      { id: '1', courseId: 'c1', expectedGrade: 9, credits: 3 },
      { id: '2', courseId: 'c2', expectedGrade: 7, credits: 2 },
    ])).toBeCloseTo(3.6)
  })

  it('returns null when no valid credits exist and validates unsafe input', () => {
    expect(calculateWeightedGpa([])).toBeNull()
    expect(validateGpaEntry({ courseId: '', expectedGrade: 11, credits: 0 })).toEqual({
      courseId: 'Vui lòng chọn môn học.', expectedGrade: 'Điểm phải nằm trong khoảng từ 0 đến 10.', credits: 'Số tín chỉ phải lớn hơn 0.',
    })
  })
})
