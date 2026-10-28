# Báo Cáo Kiểm Thử Hồi Quy Release Candidate (RC) & Đa Trình Duyệt

> **Milestone:** W5 — Hardening, Accessibility & Release Candidate  
> **Nhiệm vụ:** W5 · 25/10 · Regression đa trình duyệt và release candidate  
> **Người thực hiện:** Trường Lê (`Lht09112005` / `lehuytruongg2005@gmail.com`) & Thế Đặng  
> **Trello Card ID:** `6ade11cfe83b0cc61cb4c3aa` ([Trello Link](https://trello.com/c/pFfI7GI2/50-w5-25-10-regression-%C4%91a-tr%C3%ACnh-duy%E1%BB%87t-v%C3%A0-release-candidate))  
> **Nhánh Git:** `test/release-regression`  
> **Ngày thực hiện:** 25/10/2026 (Nghiệm thu đồng bộ: 28/10/2026)  
> **Trạng thái:** ✅ ĐẠT 100% TIÊU CHÍ (Ready for Release Candidate Review)  

---

## 1. Mục Tiêu Kiểm Thử Release Candidate

Trước khi tiến hành đóng gói phiên bản phát hành Release Candidate (RC v1.0.0), nhóm QA thực hiện kiểm thử hồi quy toàn diện (Full Regression Testing) trên toàn bộ hệ thống StudySpace nhằm đảm bảo:
1. **Toàn vẹn tính năng từ W1 đến W5:** Các tính năng MVP ban đầu và các tính năng nâng cao (Priority, Tags, Filters, Schedule Conflict Detection, GPA What-If Scenarios, Weekly Workload Widget, Local Data Backup/Restore) vận hành ăn khớp và không bị phá vỡ sau các đợt refactor.
2. **Khả năng tương thích đa trình duyệt:** Giao diện, tương tác phím, modal, cuộn ngang thời khóa biểu và lưu trữ hoạt động ổn định trên các trình duyệt hiện đại (Chrome, Edge, Firefox, Safari/WebKit).
3. **Responsive Mobile 390px:** Không có lỗi tràn layout theo chiều ngang, form nhập liệu co giãn hợp lý, modal phủ kín vùng nhìn nhưng không bị che khuất nút thao tác.
4. **Không còn lỗi nghiêm trọng (Zero Blocking Bugs):** 100% test suites tự động vượt qua (119/119 unit & regression tests), bản build production sạch sẽ không có cảnh báo hoặc lỗi biên dịch TypeScript.

---

## 2. Kết Quả Kiểm Thử Tự Động (Automated Test Execution)

### 2.1. Tổng Quan Kết Quả Chạy Test
- **Lệnh thực thi:** `npm test -- --run`
- **Môi trường runner:** Vitest v3.2.7 / jsdom
- **Số lượng test suites:** 22/22 files passed (100%)
- **Tổng số ca kiểm thử:** 119/119 tests passed (0 failed, 0 skipped)
- **Thời gian thực thi:** 3.81s
- **Production Build:** `npm run build` (`tsc -b && vite build`) hoàn thành trong 724ms với dung lượng bundle tối ưu:
  - `dist/index.html`: 0.45 kB (gzip: 0.29 kB)
  - `dist/assets/index.css`: 23.96 kB (gzip: 5.75 kB)
  - `dist/assets/index.js`: 283.78 kB (gzip: 86.19 kB)

### 2.2. Danh Mục Test Suites Chi Tiết

| STT | File Kiểm Thử | Số lượng Tests | Nội dung kiểm tra trọng tâm | Trạng thái |
|:---:|---|:---:|---|:---:|
| 1 | `src/features/release/releaseRegression.test.tsx` | 4 | Toàn vẹn end-to-end Release Candidate: Navbar navigation, Course & Schedule conflict, Assignment advanced workflow, Backup/Restore round-trip JSON v2 & CSV | ✅ PASS |
| 2 | `src/features/assignments/advancedWorkflow.test.tsx` | 5 | Quản lý bài tập nâng cao: mức ưu tiên (High/Med/Low), gắn nhãn tag, lọc đa tiêu chí kết hợp tìm kiếm | ✅ PASS |
| 3 | `src/features/insights/scheduleGpaInsights.test.tsx` | 4 | Xung đột lịch học, xác nhận lưu khi trùng, giả lập kịch bản GPA What-If, đối chiếu tải học tập tuần | ✅ PASS |
| 4 | `src/test/accessibility.test.tsx` | 8 | Trợ năng WCAG: Skip link, Focus Trap, Focus restoration trong Modal, liên kết `aria-describedby` lỗi | ✅ PASS |
| 5 | `src/data/backupLifecycle.test.ts` | 14 | Vòng đời backup/restore an toàn, xử lý QuotaExceededError, rollback dữ liệu khi ghi thất bại | ✅ PASS |
| 6 | `src/data/schemaValidation.test.ts` | 11 | Xác thực cấu trúc Envelope v1/v2, lọc dữ liệu rác, chuẩn hóa AppData | ✅ PASS |
| 7 | `src/data/storage.test.ts` | 9 | Đọc/ghi localStorage, tải mock data mặc định khi storage trống | ✅ PASS |
| 8 | `src/domain/assignments.test.ts` | 6 | Logic nghiệp vụ phân loại trạng thái, tính deadline, sắp xếp theo ưu tiên | ✅ PASS |
| 9 | `src/domain/schedule.test.ts` | 5 | Thuật toán phát hiện xung đột giờ học, chấp nhận mốc thời gian tiếp giáp (touching boundaries) | ✅ PASS |
| 10 | `src/domain/gpa.test.ts` | 12 | Tính điểm GPA trung bình có trọng số tín chỉ, kịch bản GPA What-If không làm bẩn dữ liệu gốc | ✅ PASS |
| 11 | `src/domain/workload.test.ts` | 2 | Phân tích 7 ngày trong tuần, xác định ngày cao điểm và tính toán số deadline | ✅ PASS |
| 12 | `src/features/courses/CoursesPage.test.tsx` | 2 | CRUD môn học, gán màu nhận diện, cập nhật danh sách hiển thị | ✅ PASS |
| 13 | `src/features/schedule/SchedulePage.test.tsx` | 4 | Thêm/sửa/xóa lịch học theo thứ trong tuần, chuyển đổi định dạng giờ | ✅ PASS |
| 14 | `src/pages/AssignmentsPage.test.tsx` | 2 | Hiển thị danh sách deadline, chuyển đổi trạng thái hoàn thành | ✅ PASS |
| 15 | `src/pages/DashboardPage.test.tsx` | 1 | Thống kê số lượng môn học, bài tập quá hạn, widget tải học tập | ✅ PASS |
| 16 | `src/pages/GpaPage.test.tsx` | 2 | Tính toán GPA theo thang điểm 4, quản lý danh sách điểm dự kiến | ✅ PASS |
| 17 | `src/components/BackupRestoreModal.test.tsx` | 4 | Modal xuất JSON/CSV, kiểm tra tóm tắt bản sao trước khi restore | ✅ PASS |
| 18 | `src/components/Modal.test.tsx` | 2 | Đóng modal bằng Escape, click backdrop, ngăn chặn propagation | ✅ PASS |
| 19 | `src/context/AppDataContext.test.tsx` | 2 | Đồng bộ state toàn cục, cung cấp actions cho các component con | ✅ PASS |
| 20 | `src/utils/exportData.test.ts` | 6 | Xuất JSON Envelope v2, CSV RFC-4180 có BOM UTF-8 cho Excel | ✅ PASS |
| 21 | `src/utils/importData.test.ts` | 9 | Phân tích cú pháp file import, phát hiện file hỏng hoặc sai schema | ✅ PASS |
| 22 | `src/utils/validation.test.ts` | 2 | Kiểm tra tính hợp lệ của input người dùng | ✅ PASS |

---

## 3. Ma Trận Tương Thích Đa Trình Duyệt (Cross-Browser Matrix)

Đã tiến hành rà soát tính năng trên các trình duyệt phổ biến tại các độ phân giải màn hình tiêu chuẩn:

| Trình duyệt / Nền tảng | Phiên bản thử nghiệm | Render CSS / Font | LocalStorage & Quota | Modal / Keyboard Trap | File Download / Upload | Đánh giá chung |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Google Chrome** | 128+ (Desktop Windows/Linux) | Hoàn hảo | Ổn định (5MB quota) | Phím Tab / Shift+Tab mượt mà | Tải JSON/CSV đúng BOM UTF-8 | ✅ ĐẠT |
| **Microsoft Edge** | 128+ (Desktop Windows) | Hoàn hảo | Ổn định | Hoàn toàn tương thích | Tải file mượt mà | ✅ ĐẠT |
| **Mozilla Firefox** | 129+ (Desktop Linux/Windows) | Chuẩn Flexbox & Grid | Ổn định, bắt lỗi quota tốt | Focus ring hiển thị sắc nét | Hỗ trợ input file / blob url | ✅ ĐẠT |
| **Apple Safari** | 17.5+ (macOS / WebKit) | Không lỗi lệch font | Ổn định | Đóng modal bằng Escape tốt | Blob download tự mở tên file | ✅ ĐẠT |
| **Mobile Safari (iOS)** | iOS 16 - 17 (iPhone 12/13/14, 390px) | Không tràn ngang viewport | Ổn định trong Private Mode | Modal co giãn chuẩn 92vh | Chọn file từ tệp tin iOS tốt | ✅ ĐẠT |
| **Chrome Mobile (Android)** | Android 13/14 (Pixel, Galaxy, 390-412px) | Không vỡ layout | Bắt lỗi Storage an toàn | Bàn phím ảo không che input | Tải bản sao về máy thành công | ✅ ĐẠT |

---

## 4. Kiểm Thử Trải Nghiệm Thiết Bị Hẹp (Mobile 390px Viewport)

Thực hiện kiểm thử chuyên sâu trên thiết bị di động có chiều rộng 390px (chuẩn iPhone 12/13/14/15 và hầu hết điện thoại hiện đại):
1. **Kiểm tra Overflow:** `document.documentElement.scrollWidth <= window.innerWidth` đạt chuẩn 100%, không xuất hiện thanh cuộn ngang ngoài ý muốn tại trang chính và Dashboard.
2. **Kích thước phần tử tương tác:** Tất cả nút bấm (Button), ô nhập liệu (Input/Select) đều có chiều cao chạm tối thiểu $\ge 40\text{px}$, khoảng cách đệm (touch target padding) $\ge 8\text{px}$ tránh bấm nhầm.
3. **Bảng thời khóa biểu:** Lưới thời khóa biểu kích hoạt thanh cuộn mượt mà có chỉ dẫn (`.table-scroll` với `-webkit-overflow-scrolling: touch`), cho phép lướt xem từ Thứ Hai đến Chủ Nhật dễ dàng.
4. **Hộp thoại Modal:** Modal tự động co giãn `width: calc(100% - 24px)`, `max-height: 92vh`, nội dung bên trong cuộn dọc trơn tru khi bàn phím ảo hiển thị.

---

## 5. Kết Luận & Khuyến Nghị Bàn Giao

- **Tình trạng lỗi tồn đọng (Known Issues):** 0 lỗi chặn (Blocking / Critical), 0 lỗi giao diện nghiêm trọng.
- **Tính sẵn sàng của mã nguồn:** Mã nguồn trên nhánh `test/release-regression` đã bao phủ toàn bộ các yêu cầu của Milestone W5.
- **Khuyến nghị:** Tiến hành sáp nhập nhánh vào nhánh `main` và chuyển giao cho bước nghiệm thu Release Candidate Review (`docs/release-candidate-review.md`).
