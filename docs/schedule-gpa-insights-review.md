# Báo Cáo Đánh Giá & Rà Soát Kỹ Thuật (Review Notes: Milestone W4)

- **Người thực hiện:** Trường Lê (`Lht09112005` / `lehuytruongg2005@gmail.com`) phối hợp cùng Thuận & Thế
- **Thời gian:** 20/10/2026
- **Phạm vi review:**
  1. Module Cảnh báo trùng lịch học (`src/domain/schedule.ts`, `src/features/schedule/ScheduleForm.tsx`)
  2. Module Mô phỏng kịch bản GPA (`src/domain/gpa.ts`, `src/pages/GpaPage.tsx`)
  3. Module Tải học tập tuần (`src/domain/workload.ts`, `src/pages/DashboardPage.tsx`)

---

## 1. Kết Quả Rà Soát Logic

### 1.1. Ranh giới giao nhau của thời gian học (Interval Overlap)
- **Công thức áp dụng:** `start1 < end2 && start2 < end1` trên cùng `dayOfWeek`.
- **Ranh giới tiếp giáp:** Với `s1: 08:00 – 10:00` và `s2: 10:00 – 12:00`: Do `10:00 < 10:00` trả về `false`, hệ thống xác định chính xác là **không trùng** (tiết học liền kề).
- **Trường hợp cùng ID:** Khi người dùng mở modal để chỉnh sửa một lịch học đã tồn tại, thuật toán tự động bỏ qua chính bản ghi đó, không báo lỗi giả.
- **Trải nghiệm xác nhận:** Form hiển thị chi tiết tên môn học, thời gian và phòng học bị trùng, có checkbox xác nhận dành cho trường hợp đặc biệt (ví dụ học 2 môn song song có thỏa thuận).

### 1.2. Tính an toàn của kịch bản GPA (State Purity & Isolation)
- Khi người dùng bấm "Thử nghiệm kịch bản GPA", state được khởi tạo độc lập trong component (`scenarioGrades`).
- Các thay đổi điểm số trong kịch bản chỉ kích hoạt tính toán tạm thời thông qua `compareGpaScenario()`, hoàn toàn **không gọi `updateData`** hay làm thay đổi `data.gpaEntries`.
- Khi người dùng bấm "Đặt lại" hoặc "Đóng", dữ liệu ban đầu được giữ nguyên vẹn 100%.
- Chỉ khi bấm "Áp dụng kịch bản vào điểm chính thức" thì `updateData` mới được thực thi.

### 1.3. Widget Tải học tập tuần trên Dashboard
- Sử dụng hàm chuẩn hóa ngày địa phương `formatLocalDate()` để tránh lỗi lệch ngày do chuyển đổi múi giờ UTC/ISO.
- Phân loại rõ ràng 3 mức tải: Rảnh rỗi (0 việc), Vừa phải (1–2 việc), Bận rộn (≥ 3 việc).

---

## 2. Checklist DoD (Definition of Done)

- [x] Không có lỗi type TypeScript (`npm run build` pass 100%).
- [x] Toàn bộ 21 test suites (114 tests) pass sạch không hồi quy.
- [x] Giao diện hỗ trợ đầy đủ tiếng Việt và nhãn trợ năng (`aria-label`, `role="alert"`).
- [x] Đáp ứng đầy đủ tiêu chí nghiệm thu của Milestone W4 trên Trello.
