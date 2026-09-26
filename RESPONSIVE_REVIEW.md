# Day 6 — Responsive review

## Phạm vi

Đã rà soát Dashboard, Courses, Assignments, GPA và navigation ở ba nhóm kích thước:

- Desktop: sidebar cố định, nội dung hai cột và các bảng/danh sách tận dụng chiều ngang.
- Tablet (`721–980px`): form và danh sách chuyển thành một cột; thống kê còn hai cột.
- Mobile (`320–720px`): sidebar chuyển thành drawer, khoảng đệm thu gọn, form và nội dung xếp dọc.

Không thay đổi cách tính GPA, validation nghiệp vụ, sắp xếp deadline hoặc CRUD Assignments.

## Kết quả rà soát

### Layout và chống tràn

- Bổ sung `min-width: 0`, giới hạn chiều rộng và ngắt từ cho tiêu đề, form, tên môn, mô tả và trạng thái dài.
- Form hai cột chuyển thành một cột ở màn hình hẹp; nhóm nút có thể xuống dòng và mở rộng để dễ thao tác.
- Danh sách môn học, bài tập và deadline chuyển cách bố trí điều khiển ở `430px` trở xuống.
- Bảng GPA chuyển sang dạng từng khối có nhãn ở `560px` trở xuống; input điểm luôn nằm trong viewport.
- Header cắt gọn tiêu đề dài và giữ vùng thao tác không bị co.

### Navigation mobile

- Sidebar đóng được loại khỏi thứ tự focus bằng `visibility`.
- Có backdrop và nút đóng trong drawer; cả hai đều có nhãn truy cập.
- Hỗ trợ đóng bằng `Escape`, khóa cuộn nền, giữ focus trong drawer và trả focus về nút menu.
- Nút menu dùng `aria-expanded`/`aria-controls`; trang hiện tại dùng `aria-current="page"`.

### Accessibility cơ bản

- Liên kết `label` và control bằng `htmlFor`/`id` cho form Courses và Assignments.
- Lỗi validation dùng `aria-invalid` và `aria-describedby`.
- Thêm focus ring nhất quán cho button, input, select và textarea.
- Bảng GPA có caption dành cho screen reader; các input điểm giữ nhãn riêng theo môn.
- Các thao tác navigation, sửa/xóa và đổi trạng thái đều dùng phần tử tương tác native, hỗ trợ keyboard.

## Checklist kiểm tra

- [x] Dashboard: hero, thống kê và deadline không tràn ở desktop/tablet/mobile.
- [x] Courses: form, tên môn dài và cụm nút sửa/xóa co giãn an toàn.
- [x] Assignments: form datetime/select và danh sách bài tập xếp dọc trên mobile.
- [x] GPA: bảng desktop có scroll dự phòng; mobile hiển thị theo hàng có nhãn.
- [x] Sidebar: mở, backdrop, nút đóng, `Escape`, focus và khóa cuộn.
- [x] Breakpoint nhỏ nhất được hỗ trợ: `320px` theo `min-width` của ứng dụng.

## Xác minh tự động

Các lệnh bắt buộc được chạy từ root của worktree:

```text
npm install
npm test
npm run typecheck
npm run build
```
