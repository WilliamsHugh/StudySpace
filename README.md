# StudySpace

StudySpace là ứng dụng quản lý học tập cá nhân được xây dựng bằng React, TypeScript và Vite. Ứng dụng tập trung môn học, thời khóa biểu, bài tập/deadline và GPA dự kiến trong một giao diện responsive, đồng thời lưu dữ liệu trực tiếp trên trình duyệt.

## Chức năng

- Dashboard tổng hợp số môn học, tiến độ bài tập, deadline quá hạn và GPA dự kiến.
- Thêm, sửa và xóa môn học với validation tên, tín chỉ và màu nhận diện.
- Quản lý lịch học theo Thứ Hai–Chủ Nhật, sắp xếp theo giờ bắt đầu.
- Thêm, sửa, xóa và cập nhật trạng thái bài tập.
- Lọc bài tập theo môn/trạng thái và sắp xếp theo deadline gần nhất.
- Tính GPA hệ 4 theo trọng số tín chỉ.
- Cập nhật điểm của cùng một môn mà không cộng trùng tín chỉ.
- Lưu và khôi phục dữ liệu bằng `localStorage`.
- Sidebar responsive, modal hỗ trợ Escape, focus trap và thao tác bàn phím.

## Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Giao diện | React 19, CSS |
| Ngôn ngữ | TypeScript 5 |
| Build tool | Vite 7 |
| State | React Context và reducer |
| Lưu trữ | Web Storage API |
| Kiểm thử | Vitest, Testing Library, jsdom |

## Cài đặt và chạy

Yêu cầu Node.js và npm.

```bash
npm install
npm run dev
```

Vite sẽ in địa chỉ local trong terminal, mặc định thường là `http://localhost:5173`.

## Quality gate

```bash
npm test
npm run typecheck
npm run build
```

Baseline hiện tại:

- 13 test files pass.
- 26 tests pass.
- Typecheck pass.
- Production build pass.

## Kiến trúc thư mục

```text
src/
├── components/       # Modal và layout dùng chung
├── data/             # Default state và local-storage adapter
├── domain/           # Type và nghiệp vụ course/assignment/GPA/schedule
├── features/         # Feature UI độc lập như Schedule
├── pages/            # Dashboard, Courses, Assignments và GPA
├── state/            # StudySpaceContext và reducer
└── test/             # Thiết lập môi trường kiểm thử
tests/                # Unit test nghiệp vụ và persistence
docs/                 # Báo cáo review/regression và tài liệu dự án
```

## Mô hình dữ liệu

`StudySpaceState` là nguồn dữ liệu thống nhất, gồm:

- `courses`
- `schedule`
- `assignments`
- `gradeExpectations`
- `settings`

Mọi thay đổi đi qua `StudySpaceContext` và `studySpaceReducer`. State sau đó được lưu vào `localStorage` với key version hóa.

## Kiểm thử nổi bật

- Luồng hoàn chỉnh Course → Schedule → Assignment → GPA → Dashboard.
- Filter môn học/trạng thái và thứ tự deadline.
- GPA không cộng trùng tín chỉ khi nhập lại cùng môn.
- Chuẩn hóa dữ liệu GPA trùng từ local storage.
- Cascade cleanup khi xóa môn học.
- Điều hướng responsive và quản lý focus của modal.

Kết quả regression chi tiết nằm tại [`docs/final-regression-report.md`](docs/final-regression-report.md).

## Giới hạn

- Dữ liệu chỉ nằm trên trình duyệt hiện tại; chưa có backend hoặc đồng bộ tài khoản.
- Lịch tuần cuộn ngang có chủ ý trên màn hình nhỏ.
- Ảnh review trong `docs/assets` là bằng chứng lịch sử và có thể không phản ánh chính xác pixel của commit mới nhất.
