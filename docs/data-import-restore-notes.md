# Biên Bản Nghiệm Thu: Nhập và Khôi Phục Dữ Liệu An Toàn (Data Import & Restore)

> **Dự án:** StudySpace (DeadlineTracker)  
> **Milestone:** W2 — Data Backup & Recovery Lifecycle  
> **Nhiệm vụ:** W2 · 03/10 · Nhập và khôi phục bản sao  
> **Người thực hiện:** Thế Đặng (`TehFine`) & Trần Trường Thuận (`WilliamsHugh` / `thuantruongtran0905@gmail.com`)  
> **Trello Card ID:** `6ade11b41842211345cdd6dc`  
> **Nhánh Git:** `feat/data-import-restore`  
> **Ngày hoàn thành:** 03/10/2026 (ICT)  

---

## 1. Mục Tiêu & Tiêu Chí Nghiệm Thu

Đảm bảo người dùng có thể khôi phục lại toàn bộ dữ liệu ứng dụng từ file sao lưu JSON (cả định dạng v1 legacy và v2 envelope) một cách minh bạch, an toàn và có kiểm soát trước khi áp dụng thay đổi lên `localStorage`.

### Tiêu chí chấp thuận (Acceptance Criteria):
* [x] **Chọn và đọc tệp:** Hỗ trợ tải file JSON từ thiết bị cá nhân qua FileReader không đồng bộ.
* [x] **Kiểm tra hợp lệ nghiêm ngặt:** Sử dụng bộ validator `schemaValidation.ts` và `importData.ts` để kiểm tra version, tính toàn vẹn thuộc tính và loại bỏ khóa ngoại mồ côi (`courseId` không tồn tại).
* [x] **Preview & Cảnh báo trước khi ghi đè:** Hiển thị modal tóm tắt số lượng bản ghi (môn học, lịch học, bài tập, GPA) và danh sách cảnh báo nếu có phần tử bị loại trừ.
* [x] **Xác nhận người dùng:** Bắt buộc bấm xác nhận "Khôi phục dữ liệu" mới thực hiện ghi đè; nếu bấm "Hủy bỏ", giữ nguyên 100% dữ liệu đang có.
* [x] **Thông báo rõ ràng:** Tệp sai cú pháp hoặc không chứa dữ liệu StudySpace hợp lệ sẽ bị từ chối kèm thông báo lỗi cụ thể, không làm trắng màn hình.

---

## 2. Kết Quả Kiểm Thử Đơn Vị & Tích Hợp

Các ca kiểm thử tự động đã được triển khai và vượt qua 100%:
* `src/utils/importData.test.ts`: **9/9 tests pass** (bao gồm file rác, JSON hỏng, v1 unversioned, v2 envelope, khóa ngoại mồ côi).
* `src/components/BackupRestoreModal.test.tsx`: **6/6 tests pass** (bao gồm luồng xuất JSON/CSV, chọn file, hiển thị preview, xác nhận khôi phục và hủy bỏ).
* Toàn hệ thống: **90/90 tests pass** trên 17 test suites, production build `npm run build` hoàn thành không cảnh báo.

---

## 3. Kết Luận & Quyết Định Bàn Giao

* **Đánh giá của System Architect (Thuận):** Luồng khôi phục dữ liệu đạt đầy đủ tiêu chuẩn Definition of Done của Milestone W2, xử lý triệt để nguy cơ ghi đè nhầm hoặc hỏng dữ liệu client.
* **Trạng thái Trello:** Chuyển thẻ sang cột **Done** và đánh dấu `dueComplete: true`.
