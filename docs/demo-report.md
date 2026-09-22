# StudySpace — Báo cáo MVP và kịch bản demo

Ngày rà soát: 20/09/2026
Repository: `WilliamsHugh/StudySpace`
Trello: https://trello.com/b/f01R567y/deadlinetracker

## 1. Mục tiêu và phạm vi

StudySpace là MVP hỗ trợ sinh viên quản lý môn học, thời khóa biểu, bài tập và điểm dự kiến. Ứng dụng dùng React, Vite, TypeScript, CSS responsive và `localStorage`; phiên bản MVP chưa cần backend.

Các module trong phạm vi:

- **Courses:** thêm, xem, sửa, xóa môn; lưu tên, giảng viên, tín chỉ và màu.
- **Schedule:** tạo lịch học theo môn, thứ, giờ và phòng; xem lịch tuần.
- **Assignments:** quản lý bài tập, mô tả, hạn nộp và trạng thái.
- **Trạng thái:** Chưa làm, Đang làm, Hoàn thành; tự hiển thị Quá hạn khi đã đến hạn mà chưa hoàn thành.
- **GPA simulator:** đổi điểm hệ 10 sang hệ 4 và tính trung bình có trọng số tín chỉ.
- **Dashboard:** tổng quan môn, bài tập, trạng thái, deadline gần nhất và GPA dự kiến.

## 2. Kết quả và kiểm chứng

- Đã xử lý lỗi GPA tính lặp tín chỉ khi có nhiều bản ghi điểm cho cùng môn. Quy tắc hiện tại giữ một kết quả có hiệu lực cho mỗi môn; có kiểm thử hồi quy trong `src/domain/gpa.test.ts`.
- Đã chỉnh bố cục responsive để các màn hình và nội dung GPA không làm tràn ngang ở viewport điện thoại; kiểm tra trên Dashboard, Courses, Schedule, Assignments, GPA và modal.
- Đã kiểm tra modal đóng bằng nút đóng, click nền ngoài và Escape; click bên trong không đóng modal (`src/components/Modal.test.tsx`).
- Đã rà soát Day 3; bằng chứng và phần kiểm thử CRUD Schedule còn thiếu được ghi trong [`ui-review-notes.md`](ui-review-notes.md). Kiểm thử bổ sung sửa/xóa lịch vẫn là đầu việc của Trường.
- Kiểm tra kỹ thuật trên nhánh tổng hợp: `npm test -- --run` — **10 file, 32 test pass**; `npm run build` — **pass**. Biên bản full-system: [`full-system-test-notes.md`](full-system-test-notes.md).

Ảnh giao diện kiểm tra nằm trong [`docs/assets`](assets/): Dashboard desktop/tablet/mobile, GPA mobile và hai form mobile. Ảnh trạng thái Trello dạng sơ đồ được tạo từ dữ liệu Trello MCP tại [`trello-board-snapshot.svg`](trello-board-snapshot.svg). Đây là bản tổng hợp trạng thái theo cột, không phải ảnh chụp nguyên bản giao diện Trello.

## 3. Kịch bản demo (3–5 phút)

1. **Mở Dashboard (30 giây):** chỉ nhanh tổng số môn/bài tập, phân bố trạng thái, deadline gần nhất và GPA dự kiến.
2. **Courses (40 giây):** mở danh sách môn, thêm hoặc sửa một môn, chỉ ra tín chỉ và màu môn học.
3. **Schedule (40 giây):** xem lịch tuần theo thứ; mở form để cho thấy lịch gắn với môn, giờ và phòng.
4. **Assignments (50 giây):** mở danh sách deadline; chỉ trạng thái và bài quá hạn mẫu. Đổi một bài sang Hoàn thành để minh họa trạng thái quá hạn không áp dụng cho bài đã hoàn tất.
5. **GPA (50 giây):** nhập điểm dự kiến và giải thích GPA có trọng số theo tín chỉ. Nêu trường hợp nhập cùng môn được bảo vệ bởi kiểm thử hồi quy, không cộng tín chỉ lần hai.
6. **Responsive (30 giây):** chuyển viewport điện thoại, lướt Dashboard và GPA, mở/đóng modal bằng nút hoặc Escape.
7. **Kết thúc (20 giây):** nhắc dữ liệu MVP lưu ở localStorage và nêu trạng thái kiểm thử/đầu việc còn lại.

## 4. Phân công và trạng thái công việc

Trello là nguồn trạng thái trực tiếp; sơ đồ trong repo chỉ là ảnh chụp dữ liệu tại thời điểm nêu trên.

- **Thuận:** phạm vi MVP, project setup, weekly timetable, logic trạng thái/deadline, Dashboard summary, responsive/popup review, Day 3 evidence, sửa lỗi quan trọng và tài liệu demo.
- **Thế:** Courses, Schedule form, Assignments CRUD, GPA simulator, filter/sorting; các kiểm thử lọc và GPA regression được giao vẫn cần xác nhận/hoàn tất trên Trello.
- **Trường:** kiểm thử Courses/Assignments/Schedule và full-system test; kiểm thử sửa/xóa Schedule còn mở.

### Timeline theo kế hoạch Trello

| Ngày | Trọng tâm |
|---|---|
| Day 1 | Kickoff, phạm vi MVP, user stories, data model/wireframe |
| Day 2 | Project setup, Courses CRUD và kiểm thử |
| Day 3 | Schedule form, weekly view và kiểm thử |
| Day 4 | Assignment CRUD, trạng thái/quá hạn và kiểm thử |
| Day 5 | GPA formula/UI và kiểm thử |
| Day 6 | Dashboard, filter/sorting, UI polish và responsive review |
| Day 7 | Full-system testing, sửa lỗi, demo và báo cáo |

### Việc còn mở trên Trello

- Full-system testing — Trường.
- Kiểm thử sửa/xóa Schedule — Trường.
- Kiểm thử filter/sorting và kiểm thử GPA trùng môn — Thế.
- Daily Harvest Day 7 chỉ nên chốt sau khi nhóm hoàn tất kiểm thử tổng thể.

## 5. Bài học rút ra

- Thẻ Done cần được đối chiếu với code và test; trạng thái hoàn thành không thay thế bằng chứng kiểm thử.
- Kiểm thử hồi quy cho lỗi dữ liệu như GPA trùng môn giúp giữ đúng mẫu số tín chỉ khi thay đổi logic.
- Kiểm tra ở viewport thực tế phát hiện lỗi tràn ngang mà desktop không thể hiện.
- Chốt người phụ trách và đầu ra kiểm thử riêng giúp không nhầm phần đã có code với phần đã được kiểm thử đầy đủ.

## 6. Cách chạy dự án

```bash
npm install
npm run dev
```

Kiểm tra trước demo:

```bash
npm test -- --run
npm run build
```
