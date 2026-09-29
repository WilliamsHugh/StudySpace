# Báo cáo responsive và full-system regression

**Ngày kiểm tra:** 30/09/2026 (ICT)
**Nhánh:** `test/final-regression`
**Nhánh nền:** `fix/core-stability`

## Phạm vi

- Điều hướng giữa Dashboard, Courses, Schedule, Assignments và GPA.
- Luồng tạo môn học → tạo lịch học → tạo bài tập → nhập GPA → kiểm tra Dashboard.
- Lưu trạng thái vào local storage.
- Lọc bài tập theo môn và trạng thái, sắp xếp deadline.
- Không cộng trùng tín chỉ khi cập nhật điểm của cùng một môn.
- Schedule CRUD và xóa dữ liệu liên quan khi xóa môn.
- Menu responsive, modal, thao tác bàn phím và quản lý focus.

## Responsive review

| Mốc giao diện | Kết quả | Bằng chứng |
|---|---|---|
| Desktop trên 980 px | Đạt kiểm tra cấu trúc: sidebar cố định, nội dung có giới hạn chiều rộng, Dashboard bốn cột và form/list hai cột. | `src/styles.css`, `src/dashboard.css` |
| Tablet 721–980 px | Đạt kiểm tra cấu trúc: thống kê chuyển hai cột; Courses/Assignments chuyển một cột; GPA summary xếp dọc. | Media query 980/950 px |
| Mobile đến 720 px | Đạt kiểm tra hành vi: sidebar chuyển thành drawer, có backdrop, Escape đóng menu và focus quay lại nút mở. | `src/components/layout/AppShell.test.tsx` |
| Mobile đến 560 px | Đạt kiểm tra cấu trúc: bảng GPA chuyển dạng khối, bộ lọc bài tập một cột. | Media query 560 px |
| Mobile modal/schedule | Đạt kiểm tra code và hành vi: modal giới hạn theo `100dvh`, cuộn dọc, form time chuyển một cột; lịch tuần cuộn ngang có chủ ý. | `src/responsive.css`, `src/components/Modal.test.tsx` |

Ảnh trong `docs/assets` là bằng chứng lịch sử của review ngày 20/09 và không được dùng để khẳng định pixel-perfect cho nhánh hiện tại. Theo giới hạn truy cập của phiên làm việc, lượt review này không chạy trình duyệt hoặc tạo ảnh ngoài workspace; kết luận responsive dựa trên CSS breakpoint và kiểm thử hành vi DOM.

## Lỗi phát hiện và xử lý

1. Schedule và Modal mất style sau khi hợp nhất hai kiến trúc.
   - Khôi phục layout lịch tuần, form, modal và breakpoint mobile trong `src/responsive.css`.
2. Dashboard dùng class trạng thái cũ `in-progress`/`done` trong khi model dùng `in_progress`/`completed`.
   - Bổ sung selector đúng cho model thống nhất.
3. Modal chỉ hỗ trợ Escape, chưa quản lý focus.
   - Thêm focus ban đầu, focus trap, khóa scroll và trả focus về phần tử mở modal.

## Kết quả tự động

| Gate | Kết quả |
|---|---|
| `npm test -- --reporter=verbose --pool=forks --maxWorkers=1` | 13 file, 26 test pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass; 48 module được transform |

## Truy vết Trello

- Day 6 — UI polish and responsive check: deadline 21/09/2026 18:00 ICT.
- Day 7 — Full system testing: deadline 22/09/2026 11:30 ICT.
- Day 7 — Fix critical bugs and final cleanup: deadline 22/09/2026 15:30 ICT.

## Kết luận

Các quality gate tự động đều đạt. Không còn lỗi TypeScript/build hoặc regression chức năng được ghi nhận trong phạm vi kiểm thử. Pixel-level visual sign-off trên trình duyệt thật vẫn là bước thủ công riêng nếu dự án yêu cầu ảnh mới cho bản hiện tại.
