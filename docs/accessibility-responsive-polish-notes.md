# Báo Cáo Hoàn Thiện Khả Năng Truy Cập (Accessibility) & Responsive Mobile

> **Milestone:** W5 — Hardening, Accessibility & Release Candidate  
> **Nhiệm vụ:** W5 · 22/10 · Hoàn thiện accessibility và responsive  
> **Người thực hiện:** Thuận + Trường (hỗ trợ bởi Thế Đặng / TehFine)  
> **Trello Card ID:** `6ade11cd52e83eb7c2a1014c`  
> **Nhánh Git:** `fix/accessibility-responsive-polish`  
> **Ngày hoàn thành:** 22/10/2026 (Nghiệm thu đồng bộ: 28/10/2026)  

---

## 1. Mục Tiêu & Phạm Vi Xử Lý

Dựa trên kết quả kiểm thử sơ bộ từ tài liệu baseline [`docs/accessibility-browser-baseline.md`](file:///home/Williams/Projects/StudySpace/docs/accessibility-browser-baseline.md), đợt hoàn thiện này xử lý dứt điểm toàn bộ 3 defect đã ghi nhận:

1. **Issue A11Y-01 (Medium):** Quản lý tiêu điểm (Focus Trap & Focus Restoration) trong hộp thoại [`Modal.tsx`](file:///home/Williams/Projects/StudySpace/src/components/Modal.tsx).
2. **Issue A11Y-02 (Low):** Liên kết trợ năng giữa ô nhập liệu và thông báo lỗi thông qua thuộc tính `aria-describedby` trong [`CourseForm.tsx`](file:///home/Williams/Projects/StudySpace/src/features/courses/CourseForm.tsx), [`ScheduleForm.tsx`](file:///home/Williams/Projects/StudySpace/src/features/schedule/ScheduleForm.tsx) và [`FieldError.tsx`](file:///home/Williams/Projects/StudySpace/src/components/FieldError.tsx).
3. **Issue A11Y-03 (Low):** Bổ sung nhãn hành động `aria-label` cho các nút bấm và ô tìm kiếm tại [`DashboardPage.tsx`](file:///home/Williams/Projects/StudySpace/src/pages/DashboardPage.tsx).
4. **Kiểm tra Responsive:** Đảm bảo trải nghiệm trên viewport di động hẹp (390px - iPhone 12/13/14) không bị tràn ngang layout.

---

## 2. Chi Tiết Các Thay Đổi & Giải Pháp Kỹ Thuật

### 2.1. Focus Trap & Phục Hồi Con Trỏ Trong `Modal.tsx`
- **Focus Trapping:** Khi modal mở, tự động đưa focus vào phần tử tương tác đầu tiên (hoặc nút đóng `×`). Khi người dùng bấm phím `Tab` tại phần tử tương tác cuối cùng, tiêu điểm sẽ tự động vòng lại phần tử đầu tiên. Khi bấm `Shift + Tab` tại phần tử đầu tiên, tiêu điểm vòng về phần tử cuối cùng.
- **Focus Restoration:** Lưu vết `previousActiveElement` trước khi modal mở; khi modal unmount hoặc đóng, tiêu điểm lập tức được trả về phần tử gốc, ngăn ngừa tình trạng mất focus trên Screen Reader.
- **Backdrop & Phím tắt:** Duy trì hỗ trợ phím `Escape` và sự kiện click ra vùng ngoài dialog để đóng modal.

### 2.2. Trợ Năng Cho Form & Báo Lỗi Ngữ Nghĩa
- **`CourseForm.tsx`:**
  - Ô "Tên môn học" được bổ sung `aria-describedby={errors.name ? 'course-name-error' : undefined}` trỏ tới thẻ `<small id="course-name-error" className="error">`.
  - Ô "Số tín chỉ" được bổ sung `aria-describedby={errors.credits ? 'credits-error' : undefined}` trỏ tới `<small id="credits-error" className="error">`.
- **`ScheduleForm.tsx`:**
  - Dropdown chọn môn học liên kết với `<small id="schedule-course-error">`.
  - Ô chọn giờ kết thúc liên kết với `<small id="end-time-error">`.
  - Hộp thoại cảnh báo trùng lịch có thuộc tính `role="alert"` và `aria-live="polite"` để Screen Reader đọc cảnh báo tức thì khi xuất hiện xung đột.
- **`FieldError.tsx`:** Bổ sung tham số tùy chọn `id?: string` để tái sử dụng ở bất kỳ form nào cần liên kết `aria-describedby`.

### 2.3. Nhãn Hành Động Tại `DashboardPage.tsx`
- Bổ sung `aria-label="Thêm công việc mới"` cho nút bấm chính `＋ Thêm công việc`.
- Bổ sung `aria-label="Xem tất cả bài tập"` cho nút `Xem tất cả →`.
- Bổ sung `aria-label="Tìm công việc hoặc môn học"` cho ô input tìm kiếm nhanh trên Dashboard.

---

## 3. Ma Trận Nghiệm Thu Responsive & Browser Testing

| Môi trường / Viewport | Kết quả hiển thị | Thao tác bằng phím / Cảm ứng | Đánh giá |
|---|---|---|:---:|
| **Mobile Safari (iOS 17, 390×844)** | Layout dọc co giãn vừa vặn, không có thanh cuộn ngang trang. | Nút bấm tối thiểu 44×44px, chạm chính xác. | ✅ PASS |
| **Chrome Android (412×915)** | Grid môn học và thẻ deadline tự ngắt dòng linh hoạt. | Bàn phím ảo mở lên không làm che khuất nút Lưu form. | ✅ PASS |
| **Desktop Chrome / Edge / Firefox** | Đầy đủ lưới tuần, modal hiển thị căn giữa, focus trap mượt mà. | Điều hướng Tab/Shift+Tab và phím Escape hoạt động 100%. | ✅ PASS |

---

## 4. Bằng Chứng Kiểm Thử Tự Động (Automated Tests)

Bộ kiểm thử tại [`src/test/accessibility.test.tsx`](file:///home/Williams/Projects/StudySpace/src/test/accessibility.test.tsx) bao gồm 10 bài test tự động đạt tỷ lệ **10/10 PASS (100%)**:
1. `Modal dialog accessibility > provides proper ARIA attributes and labels for screen readers` — **PASS**
2. `Modal dialog accessibility > triggers onClose when pressing the Escape key` — **PASS**
3. `Modal dialog accessibility > closes when clicking the backdrop outside dialog` — **PASS**
4. `Modal dialog accessibility > traps Tab key navigation inside modal focusable elements` — **PASS**
5. `Form accessibility & labels > associates all CourseForm inputs with labels via htmlFor/id` — **PASS**
6. `Form accessibility & labels > sets aria-invalid="true" on invalid fields in CourseForm upon submit` — **PASS**
7. `Form accessibility & labels > links input error messages via aria-describedby in CourseForm` — **PASS**
8. `Form accessibility & labels > associates all ScheduleForm inputs with labels and handles validation states` — **PASS**
9. `Form accessibility & labels > FieldError renders with role="alert" and aria-live="polite"` — **PASS**
10. `Keyboard navigation and Skip-Link > renders a skip-to-content link pointing to #main-content` — **PASS**

---

## 5. Kết Luận
Nhiệm vụ **W5 · 22/10 · Hoàn thiện accessibility và responsive** đã thỏa mãn 100% tiêu chí nghiệm thu (DoD), không còn bất kỳ lỗi truy cập nghiêm trọng nào trước khi bước vào quy trình đóng gói Release Candidate.
