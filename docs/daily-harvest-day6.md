# Daily Harvest — Day 6

**Chủ đề:** Dashboard, filter/sort và responsive polish

## Mục tiêu

- Xác minh filter bài tập theo môn và trạng thái.
- Xác minh deadline được sắp xếp gần nhất trước.
- Review layout desktop/tablet/mobile và hành vi menu/modal.
- Ghi nhận lỗi có thể tái hiện để đưa vào final cleanup.

## Kết quả

- Filter môn và trạng thái hoạt động độc lập hoặc kết hợp.
- Sort deadline tạo mảng mới, không thay đổi thứ tự dữ liệu nguồn.
- Empty state và nút đặt lại filter có test tương tác.
- Sidebar mobile đóng bằng backdrop, Escape hoặc chọn trang; focus quay lại nút mở.
- Modal hỗ trợ Escape, focus trap, scroll lock và trả focus về opener.
- Khôi phục style Schedule/Modal bị mất sau merge.
- Sửa selector màu trạng thái Dashboard theo model `in_progress`/`completed`.

## Bằng chứng

- `test(assignments): verify filters and deadline ordering`
- `fix(ui): restore responsive schedule and modal layouts`
- `test(ui): cover responsive navigation and modal focus`
- `docs/final-regression-report.md`

## Vấn đề phát hiện

1. Repository có component từ hai kiến trúc khác nhau.
2. Schedule và Modal chạy được nhưng mất style.
3. Dashboard dùng tên status CSS cũ.
4. Ảnh responsive lịch sử không đủ để khẳng định pixel của code mới nhất.

## Bài học trong ngày

- Responsive review cần kiểm tra cả layout lẫn keyboard/focus behavior.
- Khi đổi enum trạng thái, phải kiểm tra cả logic, test và CSS selector.
- Bằng chứng cũ cần được ghi rõ là lịch sử, không tái sử dụng như ảnh current build.

## Trạng thái cuối ngày

Phần code và automated verification của Day 6 đã hoàn thành. Pixel-level browser sign-off cho commit mới nhất được ghi rõ là bước thủ công nếu yêu cầu ảnh mới.
