# Biên Bản Kiểm Thử Vòng Đời Sao Lưu & Khôi Phục Dữ Liệu (Backup & Restore Lifecycle)

> **Milestone:** W2 — Data Backup & Recovery Lifecycle  
> **Nhiệm vụ:** W2 · 06/10 · Kiểm thử vòng đời backup/restore  
> **Người thực hiện:** Trường Lê (`truongne` / `Lht09112005` / `lehuytruongg2005@gmail.com`)  
> **Trello Card ID:** `6ade11b633ca7306245d0327`  
> **Nhánh Git:** `test/data-backup-restore`  
> **Ngày lập:** 06/10/2026  

---

## 1. Mục Tiêu Kiểm Thử

Nhiệm vụ này thực hiện kiểm chứng toàn diện tính đúng đắn, an toàn và khả năng tự phục hồi của chu trình sao lưu (Export) và khôi phục (Import/Restore) dữ liệu người dùng theo thiết kế kiến trúc tại [`docs/local-data-backup-design.md`](file:///home/Williams/Projects/StudySpace/docs/local-data-backup-design.md).

Phạm vi kiểm thử bao gồm:
1. **Kiểm thử chu trình khép kín (Round-Trip Test):** Đảm bảo dữ liệu của cả 5 module (`Courses`, `Schedules`, `Assignments`, `GPA`, `Dashboard`) khi xuất ra JSON Envelope v2 và nhập trở lại phải giữ nguyên vẹn 100%.
2. **Kiểm thử định dạng CSV:** Kiểm chứng bảng xuất CSV Môn học và Bài tập đạt chuẩn RFC 4180, có tiền tố UTF-8 BOM (`\uFEFF`) để hiển thị tiếng Việt chính xác trên Microsoft Excel, xử lý dấu phẩy, dấu ngoặc kép và ký tự xuống dòng.
3. **Kiểm thử xử lý dữ liệu lỗi (Corrupted / Malformed Payloads):** Chặn các file JSON lỗi cú pháp, sai kiểu dữ liệu, phiên bản schema tương lai không hỗ trợ, hoặc file rỗng.
4. **Kiểm thử toàn vẹn tham chiếu (Referential Integrity):** Tự động lọc bỏ các bản ghi mồ côi (`courseId` không tồn tại) và khử trùng lặp môn học trong GPA.
5. **Kiểm thử an toàn bộ nhớ (Safety Rollback & Quota Handling):** Đảm bảo khi xảy ra lỗi ghi bộ nhớ (`QuotaExceededError`), hệ thống tự động hoàn tác (rollback) về bản snapshot dữ liệu cũ, không làm trắng hoặc mất mát dữ liệu đang có của người dùng.

---

## 2. Ma Trận Ca Kiểm Thử (Test Cases Matrix)

| Mã TC | Hạng mục kiểm thử | Dữ liệu đầu vào / Điều kiện | Kết quả mong đợi | Trạng thái |
|:---:|---|---|---|:---:|
| **TC01** | **Full JSON Round-trip** | Bộ dữ liệu hoàn chỉnh 5 module kèm ký tự đặc biệt, dấu ngoặc kép, xuống dòng. | File xuất chứa `schemaVersion: 2`, `exportedAt`, `appVersion: "0.2.0"`. Nhập lại vào storage trống khớp 100% dữ liệu gốc. | ✅ PASS |
| **TC02** | **CSV Escaping RFC 4180** | Chuỗi chứa dấu phẩy, dấu ngoặc kép `""`, xuống dòng `\n`. | Bao bọc bởi cặp ngoặc kép `""`, nhân đôi dấu ngoặc kép bên trong thành `""""`. | ✅ PASS |
| **TC03** | **CSV Môn học** | Danh sách 2 môn học kèm giảng viên, số tín chỉ, màu hex. | File có tiền tố `\uFEFF`, header `ID,Tên môn học,Giảng viên,Số tín chỉ,Mã màu`, dữ liệu đúng cột. | ✅ PASS |
| **TC04** | **CSV Bài tập** | Danh sách bài tập có môn học, trạng thái `todo`, `in-progress`, `done`. | File có `\uFEFF`, map đúng trạng thái tiếng Việt: *Chưa làm*, *Đang làm*, *Hoàn thành*, hiển thị đúng tên môn học. | ✅ PASS |
| **TC05** | **Khóa ngoại mồ côi trong CSV** | Bài tập tham chiếu `courseId` không tồn tại trong danh mục môn. | Tên môn học hiển thị dự phòng: `"Môn học đã xóa"` mà không gây crash. | ✅ PASS |
| **TC06** | **JSON sai cú pháp** | Chuỗi JSON gãy cú pháp `{ broken: json syntax`. | Từ chối khôi phục, báo lỗi `"Tệp sao lưu không đúng định dạng JSON hợp lệ"`. | ✅ PASS |
| **TC07** | **File rỗng / khoảng trắng** | Tệp tin có độ dài 0 byte hoặc chỉ có khoảng trắng. | Báo lỗi `"Tệp sao lưu rỗng hoặc không có nội dung"`. | ✅ PASS |
| **TC08** | **Payload không phải Object** | JSON chứa mảng `[]`, số `12345`, boolean `true`. | Báo lỗi `"Nội dung tệp sao lưu phải là một JSON object"`. | ✅ PASS |
| **TC09** | **Phiên bản Schema mới (> 2)** | File chứa `schemaVersion: 99`. | Từ chối khôi phục, báo lỗi yêu cầu người dùng nâng cấp ứng dụng. | ✅ PASS |
| **TC10** | **Không có môn học hợp lệ** | File JSON có mảng `courses: []` hoặc tất cả môn đều thiếu `id`/`name`. | Từ chối khôi phục, thông báo không có môn học hợp lệ (chống xóa trắng dữ liệu). | ✅ PASS |
| **TC11** | **Lọc bản ghi mồ côi khi Import** | File chứa lịch học, bài tập, GPA có `courseId` không khớp môn học nào. | Giữ lại môn học hợp lệ, tự động loại bỏ các bản ghi mồ côi và ghi nhận log cảnh báo `issues`. | ✅ PASS |
| **TC12** | **Khử trùng lặp môn học GPA** | File chứa 2 bản ghi GPA cho cùng một môn học. | Chỉ giữ bản ghi đầu tiên, loại bỏ bản ghi thứ 2 để bảo toàn thuật toán tính GPA. | ✅ PASS |
| **TC13** | **Tương thích ngược dữ liệu v1** | Payload dạng unversioned (không có envelope) từ thời kỳ MVP. | Tự động nâng cấp lên schema v2, điền các giá trị mặc định cho trường còn thiếu và khôi phục thành công. | ✅ PASS |
| **TC14** | **Rollback khi QuotaExceededError** | Giả lập `storage.setItem` ném ngoại lệ `QuotaExceededError`. | Hàm trả về `success: false` kèm thông báo lỗi, tự động khôi phục lại dữ liệu gốc từ snapshot an toàn. | ✅ PASS |

---

## 3. Kết Quả Kiểm Thử Tự Động (Automated Test Execution)

Bộ kiểm thử tự động được triển khai chi tiết tại file [`src/data/backupLifecycle.test.ts`](file:///home/Williams/Projects/StudySpace/src/data/backupLifecycle.test.ts):

```bash
$ vitest run src/data/backupLifecycle.test.ts

 ✓ src/data/backupLifecycle.test.ts (14 tests) 20ms
   ✓ 1. Full JSON Round-Trip across all modules > exports and restores complete data with envelope schemaVersion 2
   ✓ 2. CSV Export specification & escaping > escapes fields with quotes, commas, and newlines per RFC 4180
   ✓ 2. CSV Export specification & escaping > exports courses CSV with UTF-8 BOM, headers and valid row formats
   ✓ 2. CSV Export specification & escaping > exports assignments CSV with mapped Vietnamese statuses and resolved course names
   ✓ 2. CSV Export specification & escaping > resolves course name as "Môn học đã xóa" when courseId is orphaned in assignments CSV
   ✓ 3. Validation of corrupted and invalid backup files > rejects corrupted JSON syntax
   ✓ 3. Validation of corrupted and invalid backup files > rejects empty or whitespace-only files
   ✓ 3. Validation of corrupted and invalid backup files > rejects non-object JSON payloads
   ✓ 3. Validation of corrupted and invalid backup files > rejects unsupported future schema version (> 2)
   ✓ 3. Validation of corrupted and invalid backup files > rejects backup file containing no valid courses
   ✓ 4. Referential Integrity & Data Sanitization during import > strips orphaned schedules, assignments, and duplicate GPA entries
   ✓ 4. Referential Integrity & Data Sanitization during import > supports backward compatible import of unversioned v1 data
   ✓ 5. Safety Rollback & Storage Quota Handling > preserves existing localStorage when restoring invalid data
   ✓ 5. Safety Rollback & Storage Quota Handling > rolls back to previous snapshot if storage.setItem throws QuotaExceededError

Test Files  1 passed (1)
     Tests  14 passed (14)
```

---

## 4. Kết Luận Nghiệm Thu

Task **`W2 · 06/10 · Kiểm thử vòng đời backup/restore`** đã thỏa mãn 100% tiêu chí hoàn thành (Definition of Done):
- [x] Đã kiểm chứng đầy đủ luồng xuất & nhập dữ liệu dự phòng cho 5 module.
- [x] Bao phủ toàn bộ các kịch bản lỗi: file hỏng, sai version, mồ côi khóa ngoại, trùng lặp GPA.
- [x] Đảm bảo tiêu chuẩn CSV hiển thị đúng tiếng Việt trên Excel nhờ UTF-8 BOM (`\uFEFF`).
- [x] Đảm bảo cơ chế an toàn: Snapshot dữ liệu trước khi ghi và tự động rollback khi gặp sự cố bộ nhớ.
- [x] Toàn bộ 14 ca kiểm thử tự động vượt qua kiểm thử với tỷ lệ pass 100%.
- [x] Đủ điều kiện nghiệm thu và chuyển sang trạng thái **Done**.
