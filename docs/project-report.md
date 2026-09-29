# Báo cáo dự án StudySpace

## 1. Tổng quan

StudySpace là MVP quản lý học tập cá nhân chạy trên trình duyệt. Sản phẩm giải quyết năm nhu cầu chính: quản lý môn học, lịch học, bài tập/deadline, GPA dự kiến và dashboard tổng hợp.

Ứng dụng sử dụng React, TypeScript và Vite. Dữ liệu được quản lý tập trung bằng Context/reducer và lưu vào local storage; dự án không yêu cầu backend cho phạm vi MVP.

## 2. Phạm vi chức năng

- CRUD môn học và validation dữ liệu đầu vào.
- Lịch học từ Thứ Hai đến Chủ Nhật, liên kết với môn học.
- CRUD bài tập, trạng thái, phát hiện quá hạn, filter kết hợp và sort deadline.
- GPA hệ 4 có trọng số tín chỉ, không tính trùng cùng một môn.
- Dashboard thống kê tiến độ, quá hạn, deadline sắp tới và GPA.
- Giao diện responsive và thao tác bàn phím cho menu/modal.
- Persistence, khôi phục dữ liệu lỗi và regression test.

## 3. Kiến trúc

Luồng dữ liệu chính:

```text
Page/Component
    ↓ action
StudySpaceContext
    ↓ dispatch
studySpaceReducer
    ↓ state mới
localStorage adapter
```

Nghiệp vụ được tách khỏi UI trong `src/domain`, giúp kiểm thử filter, deadline, GPA và validation mà không phụ thuộc trình duyệt.

## 4. Timeline

| Giai đoạn | Nội dung |
|---|---|
| Day 1–2 | Khởi tạo dự án, model dữ liệu, storage, layout và Course CRUD. |
| Day 3 | Schedule và GPA foundation. |
| Day 4 | Assignment domain và CRUD. |
| Day 5 | Dashboard, thống kê và test hiển thị. |
| Day 6 | Filter/sort assignment, responsive review và UI polish. |
| Day 7 | Full regression, sửa lỗi tích hợp, tài liệu và readiness review. |
| 29–30/09 | Khôi phục baseline sau merge, chuẩn hóa state, mở rộng regression và sửa hồ sơ nộp bài. |

## 5. Phân công có trong task board

| Nhóm việc | Owner ghi trong review |
|---|---|
| Filter và sorting | Thế |
| Responsive review | Thuận và Trường |
| Full-system testing | Trường |
| Critical bugs/final cleanup | Thuận và Thế |
| Project report | Thuận và Trường |

Các commit trong đợt khôi phục 29–30/09 được thực hiện bởi tài khoản Git `Lht09112005`. Bảng trên phản ánh phân công trong file review, không dùng để suy diễn tác giả của những commit không có metadata tương ứng.

## 6. Vấn đề và cách xử lý

### Hai kiến trúc bị trộn sau merge

Repository tồn tại đồng thời type/context cũ và mới, làm typecheck phát sinh khoảng 50 lỗi. Nhóm xử lý bằng cách chọn `StudySpaceContext` làm nguồn state duy nhất, chuyển Dashboard/Assignments/Schedule về cùng model và xóa implementation trùng.

### GPA có nguy cơ cộng trùng tín chỉ

Mỗi `courseId` được upsert thành một `GradeExpectation` hiệu lực. Dữ liệu cũ bị trùng cũng được chuẩn hóa khi load từ local storage.

### UI Schedule/Modal mất style

Sau khi thống nhất component, style lịch và modal không còn trong stylesheet. Responsive layer được phục hồi, đồng thời bổ sung focus trap, khóa scroll và trả focus cho phần tử mở modal.

### README sai dự án

README từng mô tả LogistiQ, không liên quan StudySpace. File đã được thay hoàn toàn bằng hướng dẫn đúng về chức năng, công nghệ, cài đặt và kiểm thử của StudySpace.

## 7. Kiểm thử

- 13 test files, 26 tests pass.
- TypeScript typecheck pass.
- Production build pass.
- Luồng tích hợp Course → Schedule → Assignment → GPA → Dashboard pass.
- Cascade cleanup, persistence, filter/sort, GPA deduplication và responsive navigation đều có regression test.

Chi tiết nằm trong [`final-regression-report.md`](final-regression-report.md).

## 8. Bài học

- Một nguồn state thống nhất quan trọng hơn việc giữ song song nhiều implementation sau merge.
- Commit nhỏ theo domain giúp truy nguyên regression và review dễ hơn.
- Test nghiệp vụ cần đi cùng test tương tác; chỉ một trong hai không đủ bảo vệ luồng người dùng.
- Tài liệu và README phải nằm trong final checklist vì sai hồ sơ có thể làm bản nộp không phản ánh sản phẩm thực tế.
- Timestamp Git phải phản ánh thời điểm thực hiện thật; deadline được ghi riêng để truy vết task.

## 9. Giới hạn và hướng phát triển

- Chưa có tài khoản hoặc đồng bộ nhiều thiết bị.
- Chưa có backend/cloud storage.
- Chưa có notification thật cho deadline.
- Có thể bổ sung import/export, recurring schedule và end-to-end browser test trong phiên bản tiếp theo.
