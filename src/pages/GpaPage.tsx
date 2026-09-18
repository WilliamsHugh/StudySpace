import { calculateGpa } from '../domain/gpa'
import { useStudySpace } from '../state/StudySpaceContext'

export function GpaPage() {
  const { state, setExpectedScore } = useStudySpace()
  const gpa = calculateGpa(state.courses, state.gradeExpectations)
  const scoresByCourse = new Map(state.gradeExpectations.map((entry) => [entry.courseId, entry]))
  const gradedCredits = state.courses.reduce((total, course) => (
    scoresByCourse.get(course.id)?.gradePoint == null ? total : total + course.credits
  ), 0)
  const maxCredits = Math.max(0, ...state.courses.map((course) => course.credits))

  return (
    <div className="gpa-page">
      <section className="gpa-summary" aria-live="polite">
        <div>
          <p className="eyebrow">GPA HỌC KỲ DỰ KIẾN</p>
          <strong>{gpa?.toFixed(2) ?? '—'}</strong>
          <span>/ 4.00</span>
        </div>
        <div className="gpa-summary__meta">
          <span><b>{scoresByCourse.size}</b> môn đã nhập điểm</span>
          <span><b>{gradedCredits}</b> tín chỉ được tính</span>
        </div>
      </section>

      <section className="panel gpa-panel">
        <div className="section-heading">
          <div><p className="eyebrow">MÔ PHỎNG KẾT QUẢ</p><h2>Điểm dự kiến theo môn</h2></div>
          <span className="count-badge">{state.courses.length}</span>
        </div>
        <p className="gpa-help">Nhập điểm hệ 10. GPA được quy đổi sang hệ 4 và tính theo trọng số tín chỉ.</p>

        {state.courses.length === 0 ? (
          <div className="list-empty">Bạn chưa có môn học. Hãy thêm môn ở trang Môn học trước khi mô phỏng GPA.</div>
        ) : (
          <div className="gpa-table-wrap">
            <table className="gpa-table">
              <caption className="sr-only">Điểm dự kiến và điểm quy đổi của từng môn học</caption>
              <thead><tr><th>Môn học</th><th>Tín chỉ</th><th>Điểm hệ 10</th><th>Điểm hệ 4</th></tr></thead>
              <tbody>{state.courses.map((course) => {
                const expectation = scoresByCourse.get(course.id)
                const isHighCredit = course.credits === maxCredits && state.courses.length > 1
                return (
                  <tr key={course.id} className={isHighCredit ? 'gpa-table__highlight' : undefined}>
                    <td><span className="course-dot" style={{ background: course.color }} /><strong>{course.name}</strong>{isHighCredit && <small>Nhiều tín chỉ</small>}</td>
                    <td data-label="Tín chỉ">{course.credits}</td>
                    <td data-label="Điểm hệ 10">
                      <input
                        aria-label={`Điểm hệ 10 của ${course.name}`}
                        inputMode="decimal"
                        min="0"
                        max="10"
                        step="0.1"
                        type="number"
                        value={expectation?.expectedScore ?? ''}
                        placeholder="0–10"
                        onChange={(event) => {
                          const value = event.target.value
                          if (value === '') setExpectedScore(course.id, null)
                          else {
                            const score = Number(value)
                            if (Number.isFinite(score) && score >= 0 && score <= 10) setExpectedScore(course.id, score)
                          }
                        }}
                      />
                    </td>
                    <td data-label="Điểm hệ 4"><b>{expectation?.gradePoint?.toFixed(1) ?? '—'}</b></td>
                  </tr>
                )
              })}</tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
