# Ghi Chú Kiểm Thử & Nghiệm Thu: Advanced Assignments & Smart Filters (Milestone W3)

- **Người thực hiện:** Trường Lê (`Lht09112005` / `lehuytruongg2005@gmail.com`)
- **Vai trò:** QA & Feature Engineer
- **Giai đoạn:** Milestone W3 (07/10 – 13/10/2026)
- **Nhánh thực hiện:** `test/assignment-priority-search`
- **Trello Card:** `W3 · 13/10 · Kiểm thử workflow bài tập nâng cao` (ID: `6ade11c28e1782770ecfd587`)

---

## 1. Mục Tiêu & Phạm Vi Kiểm Thử

Đảm bảo các tính năng nâng cao của Module Quản lý bài tập (Milestone W3) hoạt động chính xác, ổn định và tương thích hoàn toàn với hệ thống lưu trữ hiện tại:
1. **Mức độ ưu tiên (Priority):**
   - Hỗ trợ 3 mức độ: `Thấp` (`low`), `Trung bình` (`medium`), `Cao` (`high`).
   - Mặc định là `medium` khi tạo mới hoặc khi nhập dữ liệu cũ không có mức ưu tiên.
   - Hiển thị badge màu sắc trực quan tương ứng trên từng thẻ bài tập.
2. **Hệ thống nhãn (Tags):**
   - Hỗ trợ người dùng nhập nhãn phân loại (cách nhau bởi dấu phẩy, vd: `Frontend, React`).
   - Chuẩn hóa khoảng trắng, loại bỏ nhãn rỗng và hiển thị dạng tag chips (`#React`, `#Backend`).
3. **Bộ lọc kết hợp & Tìm kiếm tức thời (Smart Search & Filters):**
   - Tìm kiếm từ khóa không phân biệt hoa thường theo tiêu đề (`title`), mô tả (`description`) và các nhãn (`tags`).
   - Bộ lọc đa tiêu chí: Lọc theo Môn học (`courseId`), Trạng thái (`status`: `todo`, `in-progress`, `done`) và Mức độ ưu tiên (`priority`: `low`, `medium`, `high`).
   - Nút **"Đặt lại"** (Reset filter) cho phép xóa nhanh tất cả tiêu chí lọc, khôi phục danh sách đầy đủ.
   - Xử lý trạng thái rỗng (`empty state`) khi không tìm thấy kết quả phù hợp với gợi ý hành động xóa lọc.
4. **Tính toàn vẹn dữ liệu & Tương thích ngược (Backward Compatibility):**
   - Cập nhật hàm kiểm thực schema `validateAssignment` trong `src/data/schemaValidation.ts` để lưu và khôi phục an toàn các trường `priority` và `tags`.
   - Giữ nguyên cấu trúc dữ liệu v1/v2 không làm vỡ các bài tập cũ chưa có nhãn hoặc mức ưu tiên.

---

## 2. Ma Trận Ca Kiểm Thử (Test Cases Matrix)

| STT | File / Suite | Nội dung kiểm thử | Kết quả |
|:---:|---|---|:---:|
| 1 | `src/domain/assignments.test.ts` | Phân tách chuỗi nhãn phân cách bằng dấu phẩy (`parseTags`) | **PASS** |
| 2 | `src/domain/assignments.test.ts` | Tìm kiếm bài tập theo tiêu đề, mô tả hoặc nhãn không phân biệt hoa thường | **PASS** |
| 3 | `src/domain/assignments.test.ts` | Lọc kết hợp đồng thời Môn học + Trạng thái + Mức ưu tiên | **PASS** |
| 4 | `src/features/assignments/advancedWorkflow.test.tsx` | Hiển thị đầy đủ badges mức ưu tiên (`Cao`, `Trung bình`, `Thấp`) và tag chips | **PASS** |
| 5 | `src/features/assignments/advancedWorkflow.test.tsx` | Tạo bài tập mới kèm mức ưu tiên và danh sách nhãn phân cách bằng dấu phẩy | **PASS** |
| 6 | `src/features/assignments/advancedWorkflow.test.tsx` | Tìm kiếm động theo từ khóa trong tiêu đề, mô tả và nhãn, hiển thị empty-state | **PASS** |
| 7 | `src/features/assignments/advancedWorkflow.test.tsx` | Kết hợp nhiều dropdown bộ lọc và bấm "Đặt lại" để phục hồi toàn bộ danh sách | **PASS** |
| 8 | `src/features/assignments/advancedWorkflow.test.tsx` | Chỉnh sửa bài tập hiện có, cập nhật lại mức ưu tiên và nhãn thành công | **PASS** |
| 9 | `src/data/schemaValidation.test.ts` | Schema validation đảm bảo dữ liệu `priority` và `tags` hợp lệ | **PASS** |
| 10 | `src/data/backupLifecycle.test.ts` | Backup/restore JSON và CSV giữ trọn vẹn dữ liệu bài tập | **PASS** |

---

## 3. Kết Quả Chạy Kiểm Thử Tự Động (Regression & Build)

### 3.1. Vitest Suite
```bash
npm test -- --run
```
- **Kết quả:** `18 passed (18 files)`
- **Tổng số tests:** `98 passed (98 tests)`
- **Thời gian chạy:** `~3.8s`
- **Không có lỗi hồi quy (0 regressions)**.

### 3.2. TypeScript & Vite Production Build
```bash
npm run build
```
- **Kết quả:** Biên dịch TypeScript (`tsc -b`) và đóng gói tài nguyên Vite thành công mà không phát sinh bất kỳ warning hay lỗi kiểu (0 type errors).
- **Bundle size:** `271.10 kB` JS (gzip: `82.75 kB`), `19.12 kB` CSS (gzip: `4.91 kB`).

---

## 4. Kết Luận Nghiệm Thu

- Toàn bộ tiêu chí nghiệm thu của Milestone W3 đã được cài đặt và bao phủ kiểm thử tự động 100%.
- Trải nghiệm người dùng mượt mà, hỗ trợ tìm kiếm nhanh, gắn nhãn tiện lợi và lọc đa tiêu chí linh hoạt.
- Sẵn sàng chuyển giao cho Milestone W4.
