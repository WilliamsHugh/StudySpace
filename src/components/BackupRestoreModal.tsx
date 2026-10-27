import { useRef, useState, type ChangeEvent } from 'react'
import { Modal } from './Modal'
import {
  exportAppDataToJson,
  exportAssignmentsToCsv,
  exportCoursesToCsv,
} from '../utils/exportData'
import {
  readJsonFile,
  validateBackupFileContent,
  type ImportPreview,
} from '../utils/importData'
import type { AppData } from '../types'

interface Props {
  data: AppData
  onRestore: (restoredData: AppData) => void
  onClose: () => void
}

export function BackupRestoreModal({ data, onRestore, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [pendingPreview, setPendingPreview] = useState<ImportPreview | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string>('')

  function handleExportJson() {
    try {
      const filename = exportAppDataToJson(data)
      setErrorMessage(null)
      setNotification(`Đã xuất bản sao lưu "${filename}" thành công!`)
    } catch {
      setErrorMessage('Không thể xuất file JSON sao lưu.')
    }
  }

  function handleExportCoursesCsv() {
    try {
      const filename = exportCoursesToCsv(data.courses)
      setErrorMessage(null)
      setNotification(`Đã xuất danh sách môn học "${filename}" thành công!`)
    } catch {
      setErrorMessage('Không thể xuất file CSV môn học.')
    }
  }

  function handleExportAssignmentsCsv() {
    try {
      const filename = exportAssignmentsToCsv(data.assignments, data.courses)
      setErrorMessage(null)
      setNotification(`Đã xuất danh sách bài tập "${filename}" thành công!`)
    } catch {
      setErrorMessage('Không thể xuất file CSV bài tập.')
    }
  }

  async function handleFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setNotification(null)
    setSelectedFileName(file.name)

    try {
      const text = await readJsonFile(file)
      const result = validateBackupFileContent(text)

      if (!result.valid || !result.preview) {
        setErrorMessage(result.error || 'Tệp sao lưu không hợp lệ.')
        setPendingPreview(null)
      } else {
        setPendingPreview(result.preview)
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Có lỗi xảy ra khi đọc tệp.')
      setPendingPreview(null)
    } finally {
      // Reset input để người dùng có thể chọn lại cùng một file nếu muốn
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function handleConfirmRestore() {
    if (!pendingPreview) return
    onRestore(pendingPreview.data)
    setPendingPreview(null)
    setNotification('Khôi phục dữ liệu thành công!')
  }

  function handleCancelRestore() {
    setPendingPreview(null)
    setSelectedFileName('')
    setErrorMessage(null)
  }

  return (
    <Modal title="Sao lưu & Khôi phục dữ liệu" onClose={onClose}>
      <div className="backup-modal-content" style={{ display: 'grid', gap: '20px' }}>
        {notification && (
          <div className="notice" role="status" style={{ color: '#065f46', background: '#d1fae5' }}>
            ✓ {notification}
          </div>
        )}

        {errorMessage && (
          <div className="global-error" role="alert">
            ⚠ {errorMessage}
          </div>
        )}

        {/* Khối xác nhận khôi phục khi đã chọn file JSON hợp lệ */}
        {pendingPreview ? (
          <section className="restore-confirm-panel" style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
            <h3 style={{ margin: '0 0 10px', color: '#1e293b', fontSize: '1.05rem' }}>
              Xác nhận khôi phục từ tệp: <em>{selectedFileName}</em>
            </h3>
            {pendingPreview.exportedAt && (
              <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#64748b' }}>
                Thời gian xuất: {new Date(pendingPreview.exportedAt).toLocaleString('vi-VN')}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0' }}>
              <div style={{ padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <small style={{ color: '#64748b' }}>Môn học:</small> <strong>{pendingPreview.coursesCount}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <small style={{ color: '#64748b' }}>Lịch học tuần:</small> <strong>{pendingPreview.schedulesCount}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <small style={{ color: '#64748b' }}>Bài tập & Deadline:</small> <strong>{pendingPreview.assignmentsCount}</strong>
              </div>
              <div style={{ padding: '8px 12px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <small style={{ color: '#64748b' }}>Điểm GPA:</small> <strong>{pendingPreview.gpaCount}</strong>
              </div>
            </div>

            <p style={{ margin: '12px 0', fontSize: '0.85rem', color: '#b91c1c', fontWeight: 600 }}>
              ⚠ Lưu ý: Dữ liệu hiện tại trên trình duyệt sẽ được thay thế bằng dữ liệu từ bản sao lưu này.
            </p>

            <div className="button-row" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '14px' }}>
              <button type="button" className="button secondary" onClick={handleCancelRestore}>
                Hủy bỏ
              </button>
              <button
                type="button"
                className="button primary"
                style={{ background: '#dc2626', borderColor: '#dc2626' }}
                onClick={handleConfirmRestore}
              >
                Khôi phục dữ liệu
              </button>
            </div>
          </section>
        ) : (
          <>
            {/* Mục Xuất dữ liệu */}
            <section>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#334155' }}>Xuất dữ liệu dự phòng</h3>
              <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>
                Tải bản sao dữ liệu về máy để lưu trữ hoặc mở trên bảng tính Excel.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <button type="button" className="button primary" onClick={handleExportJson}>
                  Xuất toàn bộ (JSON)
                </button>
                <button type="button" className="button secondary" onClick={handleExportCoursesCsv}>
                  Xuất môn học (CSV)
                </button>
                <button type="button" className="button secondary" onClick={handleExportAssignmentsCsv}>
                  Xuất bài tập (CSV)
                </button>
              </div>
            </section>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '4px 0' }} />

            {/* Mục Nhập dữ liệu */}
            <section>
              <h3 style={{ margin: '0 0 8px', fontSize: '1rem', color: '#334155' }}>Khôi phục từ bản sao lưu</h3>
              <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>
                Chọn tệp JSON sao lưu hợp lệ để khôi phục lại môn học, lịch và bài tập.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                style={{ display: 'none' }}
                aria-label="Tải lên tệp sao lưu JSON"
                onChange={handleFileSelected}
              />
              <button
                type="button"
                className="button secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                📂 Chọn tệp sao lưu (.json)
              </button>
            </section>
          </>
        )}
      </div>
    </Modal>
  )
}
