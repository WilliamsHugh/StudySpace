# Ghi chú review UI và Day 3

**Ngày kiểm tra:** 20/09/2026 (ICT)  
**Nhánh:** `review/responsive-ui`  
**Trình duyệt:** Chromium headless  
**Kích thước:** desktop 1440×1000, tablet 768×1024, điện thoại 390×844 CSS px.

## Responsive và giao diện

| Màn hình | Kết quả | Bằng chứng |
|---|---|---|
| Dashboard — desktop | Đạt; thống kê và hai cột nội dung hiển thị trong viewport. | [Ảnh desktop](assets/dashboard-desktop.jpg) |
| Dashboard — tablet | Đạt; thanh điều hướng xuống hàng riêng, thẻ thống kê còn hai cột. | [Ảnh tablet](assets/dashboard-tablet.jpg) |
| Dashboard — điện thoại | Đạt; menu hai cột, thẻ thống kê hai cột, nội dung theo một cột. | [Ảnh điện thoại](assets/dashboard-mobile.jpg) |
| Form môn học — điện thoại | Đạt; modal nằm trong viewport, nút lưu/hủy nhìn thấy. | [Ảnh form môn học](assets/course-form-mobile.jpg) |
| Form lịch — điện thoại | Đạt; các trường xếp dọc, modal cuộn được trong chiều cao giới hạn. | [Ảnh form lịch](assets/schedule-form-mobile.jpg) |
| GPA — điện thoại | Phát hiện và sửa tràn ngang; xác nhận `scrollWidth` và viewport đều 375 px sau sửa. | [Ảnh GPA](assets/gpa-mobile.jpg) |

Ở breakpoint 900 px, header chuyển sang bố cục dọc để tránh nav tràn ngang. Ở điện thoại, hàng deadline chuyển thành lưới để giữ tiêu đề, trạng thái và ngày trong chiều rộng nhỏ. Lịch tuần giữ cuộn ngang có chủ ý ở viewport hẹp. Dashboard có một deadline quá hạn trong dữ liệu mẫu để kiểm tra badge/trạng thái trong demo.

## Popup

`src/components/Modal.test.tsx` kiểm tra nút Đóng, click nền ngoài, phím Escape và bảo đảm click trong hộp thoại không đóng popup. Cả hai kiểm thử đều đạt. Lỗi icon đóng popup được phản ánh trong thẻ Bug / Issue đã đánh dấu hoàn tất; trong code hiện tại nút đóng dùng chung component Modal.

## Bằng chứng cho thẻ Day 3 đã Done

| Tiêu chí | Bằng chứng code | Kiểm thử hiện có / thiếu |
|---|---|---|
| Hiển thị Thứ Hai đến Chủ Nhật, theo thứ tự giờ bắt đầu | `src/features/schedule/SchedulePage.tsx` | UI render nằm trong component; chưa có assertion riêng cho sắp xếp. |
| Màu lịch lấy từ môn học | `src/features/schedule/SchedulePage.tsx` (`--course-color`) | Chưa có assertion riêng cho màu. |
| Thêm lịch, chọn môn/ngày/giờ/phòng và validate | `src/features/schedule/ScheduleForm.tsx`, `src/utils/validation.ts` | `src/features/schedule/SchedulePage.test.tsx` kiểm tra thêm lịch hợp lệ và giờ kết thúc không hợp lệ; `src/utils/validation.test.ts` kiểm tra thiếu môn/giờ. |
| Sửa và xóa lịch | `src/features/schedule/SchedulePage.tsx` | Chưa có component regression test cho lưu sửa, xác nhận xóa và hủy xóa. Theo dõi ở [thẻ Testing Day 3](https://trello.com/c/MLbrXnqj/30-ki%E1%BB%83m-th%E1%BB%AD-b%E1%BB%95-sung-day-3-s%E1%BB%ADa-v%C3%A0-x%C3%B3a-th%E1%BB%9Di-kh%C3%B3a-bi%E1%BB%83u), owner Trường. |

**Kết luận Day 3:** phần triển khai Schedule có đủ luồng CRUD theo code; kiểm thử sửa/xóa còn là việc mở của Trường, được tách rõ khỏi bằng chứng triển khai. Không đánh dấu kiểm thử của Trường hoàn thành.

## Kiểm tra tự động

- `npm test -- --run`: 26 test pass.
- `npm run build`: pass.
- Ở viewport mobile 390 px, Dashboard, Courses, Schedule, Assignments, GPA và hai popup đều có `scrollWidth = clientWidth = 390` sau sửa.
