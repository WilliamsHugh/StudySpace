# Biên Bản Đánh Giá & Nghiệm Thu Release Candidate (RC Review)

> **Milestone:** W5 — Hardening, Accessibility & Release Candidate  
> **Nhiệm vụ:** W5 · 27/10 · Review release candidate và tài liệu bàn giao  
> **Người thực hiện:** Thuận (`WilliamsHugh`) & Trường (`truongne`), đồng thuận bởi Thế Đặng (`TehFine`)  
> **Trello Card ID:** `6ade127a571fda9904fb7bef`  
> **Nhánh Git:** `review/release-candidate`  
> **Ngày lập:** 27/10/2026 (Nghiệm thu đồng bộ: 28/10/2026)  

---

## 1. Mục Đích & Tiêu Chí Đánh Giá

Biên bản này là tài liệu thẩm định kỹ thuật chính thức trước khi phát hành phiên bản **StudySpace v1.0.0**, nhằm đối chiếu:
1. Phạm vi thực tế đã triển khai so với cam kết tại các milestone W0 – W5.
2. Tiêu chí Definition of Done (DoD) cho toàn bộ 57 thẻ nhiệm vụ trên Trello board [DeadlineTracker](https://trello.com/b/f01R567y/deadlinetracker).
3. Tình trạng các lỗi phát sinh (Defects / Issues) và xác nhận không còn bất kỳ blocker nào.
4. Đánh giá tính đồng bộ giữa tài liệu hướng dẫn và mã nguồn thực tế.

---

## 2. Bảng Đối Chiếu Phạm Vi Chức Năng (Scope vs Delivered Matrix)

| Milestone | Phạm vi cam kết | Sản phẩm mã nguồn / Tài liệu bàn giao | Đánh giá |
|---|---|---|:---:|
| **W0: Core MVP** | Quản lý Môn học, Thời khóa biểu tuần, Bài tập/Deadline quá hạn, GPA Simulator, Dashboard. | 35 thẻ đã bàn giao, code tại `src/features/` và `src/pages/`. | ✅ Đạt 100% |
| **W1: Planning & Data Arch** | Thiết kế sao lưu dữ liệu, sửa lỗi cấu trúc localStorage, baseline accessibility. | [`docs/local-data-backup-design.md`](file:///home/Williams/Projects/StudySpace/docs/local-data-backup-design.md), [`src/data/schemaValidation.test.ts`](file:///home/Williams/Projects/StudySpace/src/data/schemaValidation.test.ts). | ✅ Đạt 100% |
| **W2: Data Mobility** | Xuất dữ liệu JSON v2 + CSV UTF-8 BOM, Nhập và kiểm tra hợp lệ, bắt lỗi storage quota. | [`src/data/backupService.ts`](file:///home/Williams/Projects/StudySpace/src/data/backupService.ts), [`src/components/BackupRestoreModal.tsx`](file:///home/Williams/Projects/StudySpace/src/components/BackupRestoreModal.tsx). | ✅ Đạt 100% |
| **W3: Smart Assignments** | Độ ưu tiên bài tập (Priority), gắn nhãn (Tags), bộ lọc đa tiêu chí và tìm kiếm từ khóa. | [`src/domain/assignments.ts`](file:///home/Williams/Projects/StudySpace/src/domain/assignments.ts), [`src/pages/AssignmentsPage.tsx`](file:///home/Williams/Projects/StudySpace/src/pages/AssignmentsPage.tsx). | ✅ Đạt 100% |
| **W4: Schedule & GPA Insights** | Cảnh báo trùng lịch học, What-If GPA Scenario, Dashboard tải học tập theo tuần. | [`src/domain/schedule.ts`](file:///home/Williams/Projects/StudySpace/src/domain/schedule.ts), [`src/domain/gpa.ts`](file:///home/Williams/Projects/StudySpace/src/domain/gpa.ts), [`src/domain/workload.ts`](file:///home/Williams/Projects/StudySpace/src/domain/workload.ts). | ✅ Đạt 100% |
| **W5: Hardening & RC** | Quản lý focus trap modal, trợ năng form, triage lỗi storage, regression đa trình duyệt. | [`src/components/Modal.tsx`](file:///home/Williams/Projects/StudySpace/src/components/Modal.tsx), [`src/features/release/releaseRegression.test.tsx`](file:///home/Williams/Projects/StudySpace/src/features/release/releaseRegression.test.tsx). | ✅ Đạt 100% |

---

## 3. Thẩm Định Tiêu Chuẩn Hoàn Thành (Definition of Done)

- [x] **Mã nguồn sạch & Chuẩn TypeScript:** Không có lỗi kiểu dữ liệu (`any` không kiểm soát), tuân thủ component architecture của React 18.
- [x] **Kiểm thử tự động toàn diện:** **22 / 22 test suites**, **121 / 121 bài test đạt (100% pass rate)**.
- [x] **Đóng gói Production tối ưu:** Lệnh `npm run build` thực thi `tsc -b && vite build` hoàn tất sạch sẽ chỉ trong **737ms**, không sinh cảnh báo.
- [x] **Chuẩn Accessibility (WCAG 2.1 AA):** Có Skip-Link `#main-content`, quản lý Focus Trap trong modal dialog, tự phục hồi con trỏ sau khi đóng, liên kết `aria-describedby` và `role="alert"` đầy đủ.
- [x] **Responsive Mobile (Viewport 390px):** Đã kiểm tra thực tế trên kích thước di động hẹp (390×844), bảng biểu hỗ trợ cuộn ngang nội bộ, form nhập liệu co giãn tự nhiên, không làm vỡ khung viền trang.
- [x] **Không còn Blocker / Critical Bug:** Tất cả các issue ghi nhận trong backlog đều đã được tái hiện, sửa lỗi và có test case kiểm chứng tự động.

---

## 4. Quyết Định Nghiệm Thu & Phát Hành

Toàn bộ thành viên nhóm phát triển StudySpace (Thuận, Thế, Trường) đồng thuận phê duyệt:
* **Phiên bản:** `v1.0.0-rc` chính thức được chuyển trạng thái sang **Ready for Release**.
* **Kế hoạch tiếp theo:** Đóng gói tài liệu bàn giao, cập nhật `README.md` và tài liệu hướng dẫn demo tại nhánh `docs/release-demo-package`.
