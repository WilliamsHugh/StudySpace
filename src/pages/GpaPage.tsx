import { useMemo, useState, type FormEvent } from 'react'
import { FieldError } from '../components/FieldError'
import { gpaRepository } from '../data/storage'
import {
  calculateWeightedGpa,
  compareGpaScenario,
  convertGrade10To4,
  gradeScale,
  validateGpaEntry,
  type GpaScenarioItem,
  type GpaValidationErrors,
} from '../domain/gpa'
import type { AppData, GpaEntry } from '../types'

type Props = {
  data: AppData
  updateData: (updater: (current: AppData) => AppData) => void
}

type GpaForm = { courseId: string; expectedGrade: string; credits: string }
const blankForm: GpaForm = { courseId: '', expectedGrade: '', credits: '' }

export function GpaPage({ data, updateData }: Props) {
  const [form, setForm] = useState<GpaForm>(blankForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [errors, setErrors] = useState<GpaValidationErrors>({})

  // Scenario Mode state (what-if analysis without modifying stored state)
  const [isScenarioMode, setIsScenarioMode] = useState(false)
  const [scenarioGrades, setScenarioGrades] = useState<Record<string, string>>({})
  const [scenarioNotice, setScenarioNotice] = useState<string | null>(null)

  const gpa = calculateWeightedGpa(data.gpaEntries)
  const totalCredits = data.gpaEntries.reduce((sum, entry) => sum + entry.credits, 0)
  const highestCredits = Math.max(0, ...data.gpaEntries.map((entry) => entry.credits))

  // Khởi tạo điểm cho kịch bản mô phỏng từ danh sách môn học hiện tại
  function startScenarioMode() {
    const initial: Record<string, string> = {}
    data.courses.forEach((c) => {
      const existing = data.gpaEntries.find((e) => e.courseId === c.id)
      initial[c.id] = existing ? String(existing.expectedGrade) : '8.0'
    })
    setScenarioGrades(initial)
    setScenarioNotice(null)
    setIsScenarioMode(true)
  }

  function resetScenarioGrades() {
    startScenarioMode()
  }

  function closeScenarioMode() {
    setIsScenarioMode(false)
    setScenarioNotice(null)
  }

  // Chuyển đổi scenarioGrades thành danh sách GpaScenarioItem
  const scenarioItems: GpaScenarioItem[] = useMemo(() => {
    return data.courses.map((course) => {
      const rawGrade = scenarioGrades[course.id] ?? '8.0'
      const parsedGrade = Number.parseFloat(rawGrade)
      return {
        courseId: course.id,
        expectedGrade: Number.isNaN(parsedGrade) ? 0 : parsedGrade,
        credits: course.credits || 3,
      }
    })
  }, [data.courses, scenarioGrades])

  // So sánh kết quả kịch bản với điểm hiện tại
  const comparison = useMemo(
    () => compareGpaScenario(data.gpaEntries, scenarioItems),
    [data.gpaEntries, scenarioItems],
  )

  // Áp dụng điểm của kịch bản vào dữ liệu chính
  function applyScenarioToMainData() {
    updateData((current) => {
      let next = { ...current }
      scenarioItems.forEach((item) => {
        const entry: GpaEntry = {
          id: current.gpaEntries.find((e) => e.courseId === item.courseId)?.id ?? crypto.randomUUID(),
          courseId: item.courseId,
          expectedGrade: item.expectedGrade,
          credits: item.credits,
        }
        next = gpaRepository.upsert(next, entry)
      })
      return next
    })
    setScenarioNotice('Đã áp dụng thành công kịch bản vào điểm dự kiến chính thức!')
  }

  function submit(event: FormEvent) {
    event.preventDefault()
    const candidate = {
      courseId: form.courseId,
      expectedGrade: form.expectedGrade === '' ? Number.NaN : Number(form.expectedGrade),
      credits: form.credits === '' ? Number.NaN : Number(form.credits),
    }
    const nextErrors = validateGpaEntry(candidate)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const entry: GpaEntry = { id: editingId ?? crypto.randomUUID(), ...candidate }
    updateData((current) => gpaRepository.upsert(current, entry))
    resetForm()
  }

  function resetForm() {
    setForm(blankForm)
    setEditingId(null)
    setErrors({})
  }

  function chooseCourse(courseId: string) {
    const course = data.courses.find((item) => item.id === courseId)
    setForm({ ...form, courseId, credits: course ? String(course.credits) : form.credits })
  }

  function edit(entry: GpaEntry) {
    setEditingId(entry.id)
    setForm({ courseId: entry.courseId, expectedGrade: String(entry.expectedGrade), credits: String(entry.credits) })
    setErrors({})
  }

  return (
    <div className="gpa-layout">
      <section className="gpa-summary">
        <span className="eyebrow light">Kết quả dự kiến</span>
        <div className="gpa-value">{gpa === null ? '—' : gpa.toFixed(2)}</div>
        <p>GPA hệ 4 · {totalCredits} tín chỉ</p>
        <div className="formula">Σ (điểm hệ 4 × tín chỉ) / Σ tín chỉ</div>
        <button
          type="button"
          className="button"
          style={{ marginTop: '16px', width: '100%', background: '#fff', color: '#6558d3', borderColor: '#fff' }}
          onClick={() => (isScenarioMode ? closeScenarioMode() : startScenarioMode())}
        >
          {isScenarioMode ? '✕ Đóng mô phỏng kịch bản' : '✦ Thử nghiệm kịch bản GPA'}
        </button>
      </section>

      {/* Bảng so sánh kịch bản GPA (Scenario Comparison) */}
      {isScenarioMode && (
        <section className="panel scenario-panel" style={{ gridColumn: '1 / -1', background: '#f5f3ff', border: '1px solid #ddd6fe' }}>
          <div className="section-heading">
            <div>
              <span className="eyebrow" style={{ color: '#7c3aed' }}>Kịch bản giả định (What-If Analysis)</span>
              <h2>So sánh các kịch bản GPA mục tiêu</h2>
              <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                Thử nghiệm các mức điểm khác nhau để xem tác động lên điểm GPA mà không làm ghi đè hay thay đổi dữ liệu đang lưu.
              </p>
            </div>
          </div>

          {scenarioNotice && (
            <div className="notice" style={{ background: '#dcfce7', border: '1px solid #bbf7d0', color: '#166534', marginBottom: '16px' }}>
              ✓ {scenarioNotice}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '18px' }}>
            <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <small style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>GPA HIỆN TẠI</small>
              <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#1e293b' }}>
                {comparison.currentGpa === null ? '—' : comparison.currentGpa.toFixed(2)}
              </div>
              <small style={{ color: '#94a3b8' }}>{comparison.currentCredits} tín chỉ</small>
            </div>

            <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #c4b5fd' }}>
              <small style={{ color: '#7c3aed', fontSize: '0.75rem', fontWeight: 600 }}>GPA KỊCH BẢN DỰ KIẾN</small>
              <div style={{ fontSize: '1.7rem', fontWeight: 700, color: '#7c3aed' }}>
                {comparison.scenarioGpa === null ? '—' : comparison.scenarioGpa.toFixed(2)}
              </div>
              <small style={{ color: '#94a3b8' }}>{comparison.scenarioCredits} tín chỉ</small>
            </div>

            <div style={{ background: '#fff', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e9d5ff' }}>
              <small style={{ color: '#6b7280', fontSize: '0.75rem', fontWeight: 600 }}>CHÊNH LỆCH DỰ KIẾN</small>
              <div style={{
                fontSize: '1.7rem',
                fontWeight: 700,
                color: comparison.difference === null || comparison.difference === 0 ? '#64748b' : comparison.difference > 0 ? '#16a34a' : '#dc2626'
              }}>
                {comparison.difference === null
                  ? '—'
                  : comparison.difference > 0
                    ? `+${comparison.difference.toFixed(2)}`
                    : comparison.difference.toFixed(2)}
              </div>
              <small style={{ color: '#94a3b8' }}>So với GPA hiện tại</small>
            </div>
          </div>

          <div className="table-scroll" style={{ marginBottom: '16px' }}>
            <table>
              <thead>
                <tr>
                  <th>Môn học</th>
                  <th>Tín chỉ</th>
                  <th>Điểm hiện tại</th>
                  <th>Điểm thử nghiệm (hệ 10)</th>
                  <th>Quy đổi hệ 4</th>
                </tr>
              </thead>
              <tbody>
                {data.courses.map((course) => {
                  const currentEntry = data.gpaEntries.find((e) => e.courseId === course.id)
                  const trialGradeStr = scenarioGrades[course.id] ?? '8.0'
                  const trialGradeNum = Number.parseFloat(trialGradeStr) || 0
                  const converted4 = convertGrade10To4(trialGradeNum)
                  return (
                    <tr key={course.id}>
                      <td><strong>{course.name}</strong></td>
                      <td>{course.credits}</td>
                      <td>{currentEntry ? currentEntry.expectedGrade.toFixed(1) : 'Chưa có'}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          aria-label={`Điểm thử nghiệm môn ${course.name}`}
                          value={trialGradeStr}
                          onChange={(e) => {
                            setScenarioGrades((prev) => ({ ...prev, [course.id]: e.target.value }))
                            setScenarioNotice(null)
                          }}
                          style={{ width: '90px', padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        />
                      </td>
                      <td><span className="badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>{converted4?.toFixed(1) ?? '—'}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button type="button" className="button" onClick={applyScenarioToMainData} style={{ background: '#7c3aed', color: '#fff' }}>
              ✓ Áp dụng kịch bản vào điểm chính thức
            </button>
            <button type="button" className="button secondary" onClick={resetScenarioGrades}>
              Đặt lại kịch bản
            </button>
            <button type="button" className="button secondary" onClick={closeScenarioMode}>
              Đóng mô phỏng
            </button>
          </div>
        </section>
      )}

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Mô phỏng kết quả</span>
            <h2>{editingId ? 'Cập nhật điểm' : 'Thêm điểm dự kiến'}</h2>
          </div>
        </div>
        {data.courses.length === 0 && <div className="notice">Cần có ít nhất một môn học để mô phỏng GPA.</div>}
        <form onSubmit={submit} noValidate>
          <label>
            Môn học
            <select value={form.courseId} onChange={(event) => chooseCourse(event.target.value)} disabled={data.courses.length === 0}>
              <option value="">Chọn môn học</option>
              {data.courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
            </select>
            <FieldError message={errors.courseId} />
          </label>
          <div className="form-row">
            <label>
              Điểm dự kiến (hệ 10)
              <input type="number" min="0" max="10" step="0.1" value={form.expectedGrade} onChange={(event) => setForm({ ...form, expectedGrade: event.target.value })} />
              <FieldError message={errors.expectedGrade} />
            </label>
            <label>
              Số tín chỉ
              <input type="number" min="0.5" step="0.5" value={form.credits} onChange={(event) => setForm({ ...form, credits: event.target.value })} />
              <FieldError message={errors.credits} />
            </label>
          </div>
          <div className="button-row">
            <button className="primary" type="submit" disabled={data.courses.length === 0}>{editingId ? 'Lưu thay đổi' : 'Thêm vào mô phỏng'}</button>
            {editingId && <button type="button" onClick={resetForm}>Hủy</button>}
          </div>
        </form>
      </section>

      <section className="panel gpa-table-panel">
        <div className="section-heading">
          <div><span className="eyebrow">Chi tiết</span><h2>Các môn đã nhập</h2></div>
        </div>
        {data.gpaEntries.length === 0 ? (
          <div className="empty-state compact"><h3>Chưa có điểm dự kiến</h3><p>Nhập điểm và tín chỉ để bắt đầu tính GPA.</p></div>
        ) : (
          <div className="table-scroll">
            <table>
              <thead><tr><th>Môn học</th><th>Hệ 10</th><th>Hệ 4</th><th>Tín chỉ</th><th /></tr></thead>
              <tbody>
                {data.gpaEntries.map((entry) => (
                  <tr key={entry.id} className={entry.credits === highestCredits ? 'high-credit-row' : undefined}>
                    <td>{data.courses.find((course) => course.id === entry.courseId)?.name ?? 'Môn học đã xóa'}{entry.credits === highestCredits && <span className="credit-highlight">Nhiều tín chỉ</span>}</td>
                    <td>{entry.expectedGrade.toFixed(1)}</td>
                    <td>{convertGrade10To4(entry.expectedGrade)?.toFixed(1)}</td>
                    <td>{entry.credits}</td>
                    <td className="table-actions"><button onClick={() => edit(entry)}>Sửa</button><button className="danger-button" onClick={() => updateData((current) => gpaRepository.remove(current, entry.id))}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel scale-panel">
        <div className="section-heading"><div><span className="eyebrow">Quy ước MVP</span><h2>Bảng quy đổi</h2></div></div>
        <div className="scale-grid">
          {gradeScale.map((band, index) => {
            const upper = index === 0 ? 10 : gradeScale[index - 1].minimum - 0.1
            return <div key={band.minimum}><strong>{band.minimum.toFixed(1)}–{upper.toFixed(1)}</strong><span>{band.point.toFixed(1)}</span></div>
          })}
        </div>
      </section>
    </div>
  )
}
