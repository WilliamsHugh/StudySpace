import { describe, expect, it } from 'vitest'
import { calculateGpa, createGradeExpectation, scoreToGradePoint, upsertGradeExpectation } from '../src/domain/gpa'
import type { Course } from '../src/domain/types'

const course = (id: string, credits: number): Course => ({ id, credits, name: id, teacher: '', color: '#000000', createdAt: '', updatedAt: '' })

describe('GPA foundation', () => {
  it('quy đổi điểm hệ 10 sang hệ 4', () => {
    expect(scoreToGradePoint(9)).toBe(4)
    expect(scoreToGradePoint(8)).toBe(3.5)
    expect(scoreToGradePoint(7.5)).toBe(3)
    expect(scoreToGradePoint(6.5)).toBe(2.5)
    expect(scoreToGradePoint(5.5)).toBe(2)
    expect(scoreToGradePoint(5)).toBe(1.5)
    expect(scoreToGradePoint(4)).toBe(1)
    expect(scoreToGradePoint(3.9)).toBe(0)
  })

  it('tính GPA có trọng số tín chỉ', () => {
    expect(calculateGpa([course('a', 3), course('b', 2)], [
      { courseId: 'a', expectedScore: 9, gradePoint: 4 },
      { courseId: 'b', expectedScore: 7, gradePoint: 3 },
    ])).toBeCloseTo(3.6)
  })

  it('không cộng trùng tín chỉ khi một môn có nhiều đầu vào', () => {
    expect(calculateGpa([course('a', 3)], [
      { courseId: 'a', expectedScore: 9, gradePoint: 4 },
      { courseId: 'a', expectedScore: 7, gradePoint: 3 },
    ])).toBe(3)
  })

  it('nhập lại cùng môn sẽ thay thế điểm hiệu lực thay vì tạo bản ghi trùng', () => {
    let expectations = upsertGradeExpectation([], createGradeExpectation('a', 9))
    expectations = upsertGradeExpectation(expectations, createGradeExpectation('a', 6.5))

    expect(expectations).toEqual([{ courseId: 'a', expectedScore: 6.5, gradePoint: 2.5 }])
    expect(calculateGpa([course('a', 4)], expectations)).toBe(2.5)
  })

  it('chỉ tính các môn đã nhập điểm và từ chối điểm ngoài khoảng', () => {
    expect(calculateGpa([course('a', 3), course('b', 4)], [createGradeExpectation('a', 8)])).toBe(3.5)
    expect(() => scoreToGradePoint(-0.1)).toThrow(RangeError)
    expect(() => scoreToGradePoint(10.1)).toThrow(RangeError)
  })
})
