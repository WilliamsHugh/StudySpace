import type { Course, GradeExpectation } from './types'

export function scoreToGradePoint(score: number): number {
  if (!Number.isFinite(score) || score < 0 || score > 10) throw new RangeError('Điểm phải nằm trong khoảng 0 đến 10.')
  if (score >= 8.5) return 4
  if (score >= 8) return 3.5
  if (score >= 7) return 3
  if (score >= 6.5) return 2.5
  if (score >= 5.5) return 2
  if (score >= 5) return 1.5
  if (score >= 4) return 1
  return 0
}

export function createGradeExpectation(courseId: string, expectedScore: number): GradeExpectation {
  return { courseId, expectedScore, gradePoint: scoreToGradePoint(expectedScore) }
}

export function upsertGradeExpectation(
  expectations: GradeExpectation[],
  next: GradeExpectation,
): GradeExpectation[] {
  return [...expectations.filter((entry) => entry.courseId !== next.courseId), next]
}

export function uniqueGradeExpectations(expectations: GradeExpectation[]): GradeExpectation[] {
  return [...new Map(expectations.map((entry) => [entry.courseId, entry])).values()]
}

export function calculateGpa(courses: Course[], expectations: GradeExpectation[]): number | null {
  const effectiveByCourse = new Map(uniqueGradeExpectations(expectations).map((entry) => [entry.courseId, entry]))
  let weightedPoints = 0
  let credits = 0

  for (const course of courses) {
    const entry = effectiveByCourse.get(course.id)
    if (entry?.gradePoint == null || course.credits <= 0) continue
    weightedPoints += entry.gradePoint * course.credits
    credits += course.credits
  }

  return credits === 0 ? null : weightedPoints / credits
}
