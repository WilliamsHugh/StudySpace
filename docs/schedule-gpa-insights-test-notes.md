# Ghi Chú Kiểm Thử & Nghiệm Thu: Schedule Insights & GPA Scenarios (Milestone W4)

- **Người thực hiện:** Trường Lê (`Lht09112005` / `lehuytruongg2005@gmail.com`)
- **Vai trò:** QA & Feature Engineer
- **Giai đoạn:** Milestone W4 (14/10 – 20/10/2026)
- **Nhánh thực hiện:** `test/schedule-gpa-insights`
- **Trello Card:** `W4 · 20/10 · Kiểm thử Schedule và GPA insights` (ID: `6ade11cc6f173b20aee92a42`)

---

## 1. Mục Tiêu & Tiêu Chí Nghiệm Thu (Acceptance Criteria)

Kiểm thử và xác minh toàn diện các tính năng của Milestone W4:
1. **Cảnh báo trùng lịch học (Schedule Conflict Detection):**
   - Thuật toán xác định giao nhau của 2 khoảng thời gian `[startTime, endTime)` trên cùng một ngày trong tuần.
   - Xử lý chính xác các trường hợp ranh giới:
     - Trùng một phần hoặc toàn bộ thời gian: Báo cảnh báo conflict rõ ràng.
     - Thời gian tiếp giáp (Touching boundary, vd: `08:00 – 10:00` và `10:00 – 12:00`): Hợp lệ, không cảnh báo.
     - Khác ngày trong tuần: Hợp lệ, không cảnh báo.
   - Trải nghiệm thêm/sửa lịch: Hiển thị cảnh báo trực quan kèm thông tin môn, phòng học bị trùng và cho phép người dùng xác nhận lưu nếu thực sự cần hoặc quay lại điều chỉnh.
2. **So sánh kịch bản GPA mục tiêu (What-If Analysis):**
   - Cho phép người dùng thử các mức điểm khác nhau của từng môn học để xem ngay ảnh hưởng lên điểm GPA tích lũy.
   - Tính toán chênh lệch (+ / -) thời gian thực.
   - Đảm bảo kịch bản thử nghiệm hoàn toàn không làm bẩn hoặc ghi đè `data.gpaEntries` đang lưu cho đến khi người dùng bấm "Áp dụng vào điểm chính thức".
   - Hỗ trợ thao tác đặt lại kịch bản (Reset) và đóng mô phỏng an toàn.
3. **Widget Tải học tập theo tuần (Weekly Workload Widget) trên Dashboard:**
   - Phân tích và tổng hợp số buổi học và số deadline bài tập theo 7 ngày trong tuần (Thứ Hai đến Chủ Nhật).
   - Tự động gắn nhãn trạng thái tải học tập theo số lượng:
     - `0 việc`: `Rảnh rỗi`
     - `1 – 2 việc`: `Vừa phải`
     - `≥ 3 việc`: `Bận rộn`
   - Xác định ngày bận rộn nhất trong tuần (`peakDay`) và hiển thị thanh tóm tắt nhanh.

---

## 2. Ma Trận Ca Kiểm Thử (Test Cases Matrix)

| STT | File Kiểm Thử | Tên Test Case | Kết Quả |
|:---:|---|---|:---:|
| 1 | `src/domain/schedule.test.ts` | Phát hiện giao thoa thời gian trên cùng một ngày (trùng lấn / lồng nhau) | **PASS** |
| 2 | `src/domain/schedule.test.ts` | Không báo trùng đối với các khoảng giờ tiếp giáp (10:00 = 10:00) | **PASS** |
| 3 | `src/domain/schedule.test.ts` | Không báo trùng đối với các lịch học ở hai ngày khác nhau | **PASS** |
| 4 | `src/domain/schedule.test.ts` | Loại trừ chính bản thân candidate khi chỉnh sửa lịch học có sẵn | **PASS** |
| 5 | `src/domain/schedule.test.ts` | Xuất đầy đủ thông tin phòng học và môn học bị trùng | **PASS** |
| 6 | `src/domain/gpa.test.ts` | So sánh GPA hiện tại và kịch bản mục tiêu không làm biến đổi state gốc | **PASS** |
| 7 | `src/domain/workload.test.ts` | Xác định chuẩn xác ngày Thứ Hai đầu tuần theo múi giờ địa phương | **PASS** |
| 8 | `src/domain/workload.test.ts` | Phân nhóm đúng số buổi học và hạn nộp theo 7 ngày, tính đúng peakDay | **PASS** |
| 9 | `src/features/insights/scheduleGpaInsights.test.tsx` | SchedulePage cảnh báo conflict, chặn lưu nhầm và cho phép xác nhận lưu | **PASS** |
| 10 | `src/features/insights/scheduleGpaInsights.test.tsx` | SchedulePage lưu êm đẹp các giờ học tiếp giáp mà không có cảnh báo thừa | **PASS** |
| 11 | `src/features/insights/scheduleGpaInsights.test.tsx` | GpaPage mô phỏng kịch bản, tính chênh lệch điểm và áp dụng vào state chính | **PASS** |
| 12 | `src/features/insights/scheduleGpaInsights.test.tsx` | DashboardPage hiển thị widget tải tuần với đầy đủ 7 ngày và chip trạng thái | **PASS** |
| 13 | `src/features/schedule/SchedulePage.test.tsx` | Thêm, sửa, xóa lịch học và cảnh báo conflict trên form | **PASS** |

---

## 3. Kết Quả Kiểm Thử Toàn Diện (Full Regression Run)

```bash
npm test -- --run
```
- **Số lượng test file:** `21 passed (21 files)`
- **Tổng số ca kiểm thử:** `114 passed (114 tests)`
- **Thời gian chạy:** `~3.9s`
- **Hồi quy (Regressions):** `0`

```bash
npm run build
```
- **Biên dịch TypeScript (`tsc -b`):** 0 errors.
- **Vite Build (`vite build`):** Thành công trong `819ms`.

---

## 4. Kết Luận Nghiệm Thu

Milestone W4 đạt chất lượng nghiệm thu cao:
- Thuật toán trùng lịch chuẩn xác tuyệt đối đến từng ranh giới giờ phút.
- Giao diện mô phỏng kịch bản GPA thân thiện, không lo mất mát dữ liệu gốc.
- Widget tải học tập tuần trên Dashboard mang lại giá trị thực tiễn cao cho sinh viên.
