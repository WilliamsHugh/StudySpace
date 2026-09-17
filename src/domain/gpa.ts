import type { GpaEntry } from '../types'

export type GpaValidationErrors = Partial<Record<'courseId' | 'expectedGrade' | 'credits', string>>

// Thang quy đổi hệ 10 -> hệ 4 dùng cho MVP, theo các ngưỡng phổ biến tại Việt Nam.
export const gradeScale = [
  { minimum: 8.5, point: 4.0 },
  { minimum: 8.0, point: 3.5 },
  { minimum: 7.0, point: 3.0 },
  { minimum: 6.5, point: 2.5 },
  { minimum: 5.5, point: 2.0 },
  { minimum: 5.0, point: 1.5 },
  { minimum: 4.0, point: 1.0 },
  { minimum: 0, point: 0 },
] as const

export function convertGrade10To4(grade: number): number | null {
  if (!Number.isFinite(grade) || grade < 0 || grade > 10) return null
  return gradeScale.find((band) => grade >= band.minimum)?.point ?? 0
}

export function validateGpaEntry(entry: Omit<GpaEntry, 'id'>): GpaValidationErrors {
  const errors: GpaValidationErrors = {}
  if (!entry.courseId) errors.courseId = 'Vui lòng chọn môn học.'
  if (convertGrade10To4(entry.expectedGrade) === null) {
    errors.expectedGrade = 'Điểm phải nằm trong khoảng từ 0 đến 10.'
  }
  if (!Number.isFinite(entry.credits) || entry.credits <= 0) {
    errors.credits = 'Số tín chỉ phải lớn hơn 0.'
  }
  return errors
}

export function calculateWeightedGpa(entries: GpaEntry[]): number | null {
  const validEntries = entries.filter(
    (entry) => convertGrade10To4(entry.expectedGrade) !== null && Number.isFinite(entry.credits) && entry.credits > 0,
  )
  const totalCredits = validEntries.reduce((sum, entry) => sum + entry.credits, 0)
  if (totalCredits === 0) return null

  const weightedPoints = validEntries.reduce(
    (sum, entry) => sum + (convertGrade10To4(entry.expectedGrade) ?? 0) * entry.credits,
    0,
  )
  return weightedPoints / totalCredits
}
