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

export interface GpaScenarioItem {
  courseId: string
  expectedGrade: number
  credits: number
}

export interface GpaComparisonResult {
  currentGpa: number | null
  scenarioGpa: number | null
  difference: number | null
  currentCredits: number
  scenarioCredits: number
}

/**
 * So sánh điểm GPA hiện tại và kịch bản dự đoán mà không làm thay đổi hay ghi đè state chính.
 */
export function compareGpaScenario(
  currentEntries: GpaEntry[],
  scenarioItems: GpaScenarioItem[],
): GpaComparisonResult {
  const currentGpa = calculateWeightedGpa(currentEntries)
  const scenarioEntries: GpaEntry[] = scenarioItems.map((item, idx) => ({
    id: `scenario-${idx}`,
    courseId: item.courseId,
    expectedGrade: item.expectedGrade,
    credits: item.credits,
  }))
  const scenarioGpa = calculateWeightedGpa(scenarioEntries)
  const difference =
    currentGpa !== null && scenarioGpa !== null ? Number((scenarioGpa - currentGpa).toFixed(2)) : null
  const currentCredits = currentEntries.reduce((sum, e) => sum + (e.credits || 0), 0)
  const scenarioCredits = scenarioItems.reduce((sum, e) => sum + (e.credits || 0), 0)

  return {
    currentGpa,
    scenarioGpa,
    difference,
    currentCredits,
    scenarioCredits,
  }
}
