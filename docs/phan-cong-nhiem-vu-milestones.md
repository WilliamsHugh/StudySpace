# Kế Hoạch Phân Công Nhiệm Vụ Chi Tiết Theo Milestone — StudySpace

> **Dự án:** StudySpace (DeadlineTracker)  
> **Nguồn quản lý trực tiếp:** [Trello Board DeadlineTracker](https://trello.com/b/f01R567y/deadlinetracker)  
> **Ngày xuất bản:** 26/10/2026  
> **Phiên bản:** 2.0 (Đồng bộ theo MCP Composio & Git history)

---

## 1. Đội Ngũ Thực Hiện & Phân Định Vai Trò

Dựa trên phân tích commit history trên Git và trách nhiệm chuyên môn:

| STT | Thành viên | Git Account / Email | Trello Account | Vai trò trọng tâm |
|:---:|---|---|---|---|
| 1 | **Trần Trường Thuận** | `WilliamsHugh`<br>`thuantruongtran0905@gmail.com` | `trntrngthun` | **Team Lead & System Architect**: Kiến trúc hệ thống, UI/UX Foundation, Dashboard, logic Deadline/Quá hạn, Responsive Review, Demo & Hồ sơ phát hành. |
| 2 | **Thế Đặng** | `Teh fine`<br>`dangvanthe2005@gmail.com` | `thdng2` | **Core Feature Developer**: CRUD Môn học & Bài tập, GPA Simulator (thuật toán & UI), Bộ lọc/Sắp xếp, Xử lý sao lưu dữ liệu `localStorage`. |
| 3 | **Trường Lê** | `truongne`<br>`lehuytruongg2005@gmail.com` | `trngle7` | **QA & Feature Engineer**: CRUD Thời khóa biểu tuần, kiểm thử đơn vị, kiểm thử tích hợp giao diện, Full-system Regression Testing, Accessibility. |

> [!NOTE]
> *Thành viên Anh Lý Tuấn không tham gia đóng góp mã nguồn trên Git và đã được rút khỏi toàn bộ phân công nhiệm vụ.*

---

## 2. Tổng Hợp Khối Lượng Công Việc (Workload Matrix)

| Thành viên | Tổng số Task | W0 (MVP) | W1 (Planning) | W2 (Backup) | W3 (Features) | W4 (Insights) | W5 (Release) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Thuận** | **31** | 19 | 2 | 2 | 1 | 3 | 4 |
| **Thế** | **22** | 13 | 2 | 2 | 1 | 3 | 1 |
| **Trường** | **20** | 12 | 2 | 1 | 1 | 1 | 3 |

---

## 3. Kế Hoạch Chi Tiết Theo Từng Milestone

### Milestone W0: MVP Foundation & Core Delivery (16/09 – 22/09/2026)
- **Mục tiêu:** Xây dựng hoàn thiện ứng dụng StudySpace MVP: Quản lý môn học, Thời khóa biểu tuần, Quản lý bài tập/deadline quá hạn, GPA simulator và Dashboard tổng quan. Chạy full-system test và chuẩn bị demo.
- **Trạng thái:** ✅ Hoàn thành (35/35 tasks đã bàn giao và kiểm thử)

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `Done` | **W0 · 16/09 · Kickoff và chốt phạm vi MVP** | Thuận | 2026-09-16 | Owner: Thuận<br>Goal: Chốt phạm vi MVP Deadline Tracker.<br>Tasks:<br>- Xác nhận tính năng chính: môn học, thời khóa biểu, bài tập/deadline, trạng thái, GPA simulator.<br>- Xác định tech stack đơn giản.<br>- Ghi Definition of Done cho từng tính năng.<br>Output: MVP scope được nhóm đồng ý.<br><br>Kết... |
| `Done` | **W0 · 16/09 · User stories và tiêu chí nghiệm thu** | Thuận, Trường | 2026-09-16 | Owner: Thuận + Trường<br>Goal: Viết user stories cho từng module.<br>Tasks:<br>- US01 quản lý môn học.<br>- US02 thời khóa biểu.<br>- US03 bài tập/deadline.<br>- US04 trạng thái.<br>- US05 deadline sắp tới.<br>- US06 GPA simulator.<br>Output: Danh sách user stories + acceptance criteria.<br><br>Kết ... |
| `Done` | **W0 · 16/09 · Mô hình dữ liệu và wireframe** | Thế, Thuận | 2026-09-16 | Owner: Thế + Thuận<br>Goal: Thiết kế dữ liệu và khung giao diện.<br>Tasks:<br>- Model Course: name, teacher, credits, color.<br>- Model Schedule: courseId, dayOfWeek, startTime, endTime, room.<br>- Model Assignment: courseId, title, description, dueDate, status.<br>- Model GPA: expectedScore, gradeP... |
| `Daily Harvest` | **W0 · 16/09 · Daily Harvest — Phạm vi và thiết kế** | Thuận | 2026-09-16 | Harvest 1 review (2026-09-17): MVP scope and Definition of Done are recorded in the Day 1 kickoff card; all six user stories and acceptance criteria are in the Day 1 user-stories card. The data model is recorded in the Day 1 design card and represented in src/types/index.ts. The first UI layout is i... |
| `Done` | **W0 · 17/09 · Khởi tạo ứng dụng và layout nền** | Thuận | 2026-09-17 | Owner: Thuận<br>Goal: Khởi tạo project và giao diện nền.<br>Tasks:<br>- Tạo cấu trúc project.<br>- Tạo navigation: Dashboard, Courses, Schedule, Assignments, GPA.<br>- Tạo layout responsive cơ bản.<br>- Chuẩn bị dữ liệu mẫu.<br>Output: app chạy được với layout chính. |
| `Done` | **W0 · 17/09 · CRUD quản lý môn học** | Thế | 2026-09-17 | Owner: Thế<br>Goal: Làm chức năng quản lý môn học.<br>Tasks:<br>- Thêm môn học: tên, giảng viên, tín chỉ, màu.<br>- Hiển thị danh sách môn học.<br>- Sửa thông tin môn học.<br>- Xóa môn học.<br>Output: module Courses dùng được. |
| `Done` | **W0 · 17/09 · Kiểm thử môn học** | Trường | 2026-09-17 | Owner: Trường<br>Goal: Kiểm thử module môn học.<br>Tasks:<br>- Test thêm môn hợp lệ.<br>- Test thiếu tên môn.<br>- Test tín chỉ không hợp lệ.<br>- Test sửa/xóa môn.<br>- Ghi bug vào list Bug / Issue nếu có.<br>Output: test notes cho Courses. |
| `Daily Harvest` | **W0 · 17/09 · Daily Harvest — Khởi tạo và môn học** | Thuận | 2026-09-17 | Theo kế hoạch triển khai sprint và tài liệu kỹ thuật. |
| `Done` | **W0 · 18/09 · Form thời khóa biểu và xử lý dữ liệu** | Thế | 2026-09-18 | Owner: Thế<br>Goal: Làm chức năng thêm thời khóa biểu.<br>Tasks:<br>- Chọn môn học.<br>- Nhập thứ trong tuần.<br>- Nhập giờ bắt đầu/kết thúc.<br>- Nhập phòng học hoặc ghi chú.<br>- Validate giờ học hợp lệ.<br>Output: tạo lịch học được theo từng môn. |
| `Done` | **W0 · 18/09 · Thời khóa biểu tuần** | Thuận | 2026-09-18 | Owner: Thuận<br>Goal: Hiển thị thời khóa biểu theo tuần.<br>Tasks:<br>- Tạo bảng Thứ 2 đến Chủ nhật.<br>- Hiển thị môn học theo khung giờ.<br>- Màu môn học khớp với Course.<br>- Thêm sửa/xóa lịch học.<br>Output: màn hình Schedule hoàn chỉnh mức MVP. |
| `Done` | **W0 · 18/09 · Kiểm thử thời khóa biểu** | Trường | 2026-09-18 | Owner: Trường<br>Goal: Kiểm thử thời khóa biểu.<br>Tasks:<br>- Test thêm lịch học hợp lệ.<br>- Test thiếu môn học.<br>- Test giờ kết thúc trước giờ bắt đầu.<br>- Test sửa/xóa lịch học.<br>- Ghi bug nếu có.<br>Output: test notes cho Schedule. |
| `Daily Harvest` | **W0 · 18/09 · Daily Harvest — Thời khóa biểu** | Trường | 2026-09-18 | Theo kế hoạch triển khai sprint và tài liệu kỹ thuật. |
| `Done` | **W0 · 19/09 · Form và CRUD bài tập** | Thế | 2026-09-19 | Owner: Thế<br>Goal: Làm chức năng thêm bài tập/deadline.<br>Tasks:<br>- Chọn môn học.<br>- Nhập tiêu đề bài tập.<br>- Nhập mô tả.<br>- Nhập hạn nộp.<br>- Sửa/xóa bài tập.<br>Output: module Assignments có CRUD cơ bản. |
| `Done` | **W0 · 19/09 · Trạng thái bài tập và logic quá hạn** | Thuận | 2026-09-19 | Owner: Thuận<br>Goal: Quản lý trạng thái bài tập.<br>Tasks:<br>- Trạng thái: Chưa làm, Đang làm, Hoàn thành.<br>- Tự hiển thị Quá hạn khi quá deadline và chưa hoàn thành.<br>- Sắp xếp deadline gần nhất lên trước.<br>- Hiển thị badge trạng thái.<br>Output: danh sách bài tập có trạng thái rõ ràng. |
| `Done` | **W0 · 19/09 · Kiểm thử bài tập và quá hạn** | Trường | 2026-09-19 | Owner: Trường<br>Goal: Kiểm thử bài tập/deadline.<br>Tasks:<br>- Test thêm bài tập hợp lệ.<br>- Test thiếu deadline.<br>- Test đổi trạng thái.<br>- Test quá hạn.<br>- Test sắp xếp deadline.<br>Output: test notes cho Assignments. |
| `Daily Harvest` | **W0 · 19/09 · Daily Harvest — Bài tập và deadline** | Thế | 2026-09-19 | Theo kế hoạch triển khai sprint và tài liệu kỹ thuật. |
| `Done` | **W0 · 20/09 · Công thức và quy đổi GPA** | Thế | 2026-09-20 | Owner: Thế<br>Goal: Xây dựng logic giả lập GPA.<br>Tasks:<br>- Nhập tín chỉ mỗi môn.<br>- Nhập điểm dự kiến hệ 10.<br>- Quy đổi hệ 10 sang hệ 4.<br>- Công thức GPA = sum(gradePoint * credits) / sum(credits).<br>- Xử lý môn chưa nhập điểm.<br>Output: hàm tính GPA ổn định. |
| `Done` | **W0 · 20/09 · Giao diện GPA simulator** | Thế | 2026-09-20 | Owner: Thuận<br>Goal: Tạo giao diện GPA Simulator.<br>Tasks:<br>- Hiển thị danh sách môn + tín chỉ.<br>- Ô nhập điểm dự kiến.<br>- GPA cập nhật khi đổi điểm.<br>- Hiển thị kết quả GPA học kỳ.<br>- Highlight môn nhiều tín chỉ.<br>Output: màn hình GPA Simulator demo được. |
| `Done` | **W0 · 20/09 · Kiểm thử GPA simulator** | Thuận | 2026-09-20 | Owner: Trường<br>Goal: Kiểm thử tính GPA.<br>Tasks:<br>- Test bộ điểm mẫu.<br>- Test tín chỉ bằng 0 hoặc trống.<br>- Test điểm ngoài khoảng 0-10.<br>- Test thay đổi điểm và cập nhật GPA.<br>- Ghi bug nếu có.<br>Output: test notes cho GPA Simulator. |
| `Daily Harvest` | **W0 · 20/09 · Daily Harvest — GPA simulator** | Thế | 2026-09-20 | Theo kế hoạch triển khai sprint và tài liệu kỹ thuật. |
| `Done` | **W0 · 21/09 · Dashboard tổng quan** | Thuận | 2026-09-21 | Owner: Thuận<br>Goal: Tạo dashboard tổng quan.<br>Tasks:<br>- Tổng số môn học.<br>- Tổng số bài tập.<br>- Số bài chưa làm, đang làm, hoàn thành, quá hạn.<br>- Deadline gần nhất.<br>- GPA dự kiến.<br>Output: Dashboard có dữ liệu tổng quan để demo.<br><br>Kết quả 20/09/2026: Dashboard có tổng môn, tổn... |
| `Done` | **W0 · 21/09 · Lọc và sắp xếp deadline** | Thế | 2026-09-21 | Owner: Thế<br>Goal: Thêm lọc/sắp xếp cơ bản.<br>Tasks:<br>- Lọc bài tập theo môn.<br>- Lọc bài tập theo trạng thái.<br>- Sắp xếp theo deadline gần nhất.<br>- Reset filter.<br>Output: danh sách deadline dễ theo dõi hơn. |
| `Done` | **W0 · 21/09 · Kiểm thử lọc và sắp xếp bài tập** | Thế | 2026-09-21 | Owner: Thế<br>Goal: Xác nhận bộ lọc và sắp xếp deadline hoạt động đúng.<br>Branch: test/assignment-filter-verification<br><br>Tasks:<br>- Kiểm thử lọc bài tập theo môn và trạng thái.<br>- Kiểm thử sắp xếp theo hạn nộp gần nhất.<br>- Kiểm thử đặt cả hai bộ lọc về “Tất cả” và trạng thái không có kết q... |
| `Done` | **W0 · 21/09 · Review responsive và thao tác đóng popup** | Thuận, Trường | 2026-09-21 | Owner: Thuận + Trường<br>Goal: Rà soát giao diện trên các kích thước màn hình và cách đóng popup.<br>Branch: review/responsive-ui<br><br>Tasks:<br>- Kiểm tra Dashboard, Courses, Schedule, Assignments và GPA trên desktop, tablet và điện thoại.<br>- Kiểm tra cuộn ngang lịch tuần; tìm nội dung bị tràn ... |
| `Done` | **W0 · 21/09 · Polish giao diện và kiểm tra responsive** | Thuận, Trường | 2026-09-21 | Owner: Thuận + Trường<br>Goal: Làm giao diện gọn và dễ demo.<br>Tasks:<br>- Kiểm tra khoảng cách, font, màu trạng thái.<br>- Kiểm tra responsive laptop/mobile.<br>- Sửa lỗi hiển thị form và table.<br>- Chuẩn bị dữ liệu demo mẫu.<br>Output: giao diện sạch, demo mượt.<br><br>Kết quả 20/09/2026: Đã tin... |
| `Done` | **W0 · 21/09 · Review Day 3: đối chiếu code và kiểm thử** | Thuận, Trường | 2026-09-21 | Owner: Thuận + Trường<br>Goal: Đối chiếu tiêu chí của các task Day 3 với code hiện tại.<br>Branch: review/day3-done-evidence<br><br>Tasks:<br>- Đối chiếu từng yêu cầu trong các thẻ Day 3 với tính năng đã có trên main.<br>- Tách rõ bằng chứng triển khai và phần còn thiếu kiểm thử hồi quy.<br>- Xác nh... |
| `Done` | **W0 · 21/09 · Kiểm thử sửa và xóa thời khóa biểu** | Trường | 2026-09-21 | Owner: Trường<br>Goal: Bổ sung kiểm thử hồi quy cho thao tác sửa và xóa thời khóa biểu.<br>Branch: test/schedule-crud-regression<br><br>Tasks:<br>- Kiểm thử sửa môn học, thứ, giờ và phòng.<br>- Kiểm thử xác nhận xóa; kiểm thử hủy xóa.<br>- Ghi kết quả kiểm thử và lỗi phát hiện được.<br><br>Acceptanc... |
| `Daily Harvest` | **W0 · 21/09 · Daily Harvest — Dashboard và polish** | Thuận | 2026-09-21 | Kết quả 20/09/2026: Rà soát hoàn tất: Dashboard summary ở main; responsive/polish và ảnh demo ở `review/responsive-ui`; filter/sorting vẫn là đầu việc của Thế. Kiểm tra 28/28 test và build pass. Day 7/full-system testing còn mở chờ Trường/Thế. |
| `Done` | **W0 · 22/09 · Kiểm thử toàn hệ thống** | Trường | 2026-09-22 | Owner: Trường<br>Goal: Kiểm thử toàn bộ luồng sử dụng.<br>Branch: test/full-system-regression<br><br>Tasks:<br>- Tạo môn học.<br>- Tạo thời khóa biểu.<br>- Tạo bài tập/deadline.<br>- Đổi trạng thái bài tập.<br>- Kiểm tra quá hạn và completed.<br>- Kiểm tra GPA simulator và dữ liệu lưu qua reload.<br... |
| `Done` | **W0 · 22/09 · Kiểm thử hồi quy GPA không tính trùng môn** | Thế | 2026-09-22 | Owner: Thế<br>Goal: Đảm bảo một môn học không bị tính tín chỉ nhiều lần trong GPA.<br>Branch: test/gpa-duplicate-course<br><br>Liên quan: thẻ Bug / Issue về việc nhập trùng điểm dự kiến cho cùng môn.<br><br>Tasks:<br>- Thêm cùng một môn hai lần với hai điểm dự kiến khác nhau.<br>- Kiểm tra chỉ có mộ... |
| `Done` | **W0 · 22/09 · Sửa lỗi quan trọng và dọn dẹp** | Thế, Thuận | 2026-09-22 | Owner: Thuận + Thế<br>Goal: Sửa lỗi quan trọng trước demo.<br>Tasks:<br>- Ưu tiên bug ảnh hưởng demo.<br>- Sửa lỗi validate dữ liệu.<br>- Sửa lỗi hiển thị trạng thái/deadline.<br>- Kiểm tra lại sau khi fix.<br>Output: bản demo ổn định.<br><br>Kết quả 20/09/2026: Đã sửa GPA tính lặp tín chỉ theo môn,... |
| `Done` | **W0 · 22/09 · Sửa bug GPA đếm trùng môn** | Thế, Thuận | 2026-09-22 | Suggested owner: Thế<br>Suggested branch: fix/gpa-duplicate-course<br><br>Reproduction:<br>1. Add an expected grade for a course.<br>2. Add another expected grade for the same course.<br>3. Both rows contribute their credits to the weighted GPA.<br><br>Actual: one course can be counted multiple time... |
| `Done` | **W0 · 22/09 · Kịch bản demo và báo cáo dự án** | Thuận, Trường | 2026-09-22 | Owner: Thuận + Trường<br>Goal: Chuẩn bị báo cáo môn quản lý dự án phần mềm.<br>Tasks:<br>- Viết demo script 3-5 phút.<br>- Chụp Trello board: To Do, Doing, Review, Testing, Done, Daily Harvest.<br>- Mô tả phân công 3 thành viên.<br>- Mô tả timeline theo ngày.<br>- Ghi bài học rút ra từ daily harvest... |
| `Daily Harvest` | **W0 · 22/09 · Daily Harvest — Rà soát cuối và sẵn sàng bàn giao** | Thuận, Trường | 2026-09-22 | Kết quả cập nhật 26/09/2026: Đã hoàn tất sau khi bổ sung đầy đủ test và biên bản full-system. Daily Harvest Day 7 đã có báo cáo tại `docs/demo-report.md`; toàn bộ test/build pass. |
| `Done` | **W0 · 20/09 · Sửa icon đóng popup thêm môn** | Thuận | — | Ở popup thêm môn học icon tắt pop bị lỗi giao diện. |

---

### Milestone W1: Post-MVP Planning & Data Architecture (24/09 – 29/09/2026)
- **Mục tiêu:** Đánh giá sau MVP, thiết kế kiến trúc sao lưu/khôi phục dữ liệu (localStorage backup & export), phân tích lỗi dữ liệu và rà soát tiêu chuẩn accessibility.
- **Trạng thái:** ✅ Hoàn thành (5/5 tasks đã nghiệm thu và kiểm thử)

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `Done` | **W1 · 24/09 · Chốt phạm vi bản nâng cấp sau MVP** | Thuận | 2026-09-24 | Owner: Thuận<br>Giai đoạn: W1 (24/09)<br>Goal: Xác định phạm vi 5 tuần sau khi MVP và baseline test đã hoàn tất.<br>Nhánh gợi ý: planning/post-mvp-roadmap<br><br>Tasks:<br>- Chọn mục tiêu người dùng cho bản kế tiếp.<br>- Ưu tiên các hạng mục theo giá trị/rủi ro.<br>- Chốt rõ những gì chưa làm trong ...<br><br>Output: Đã hoàn tất tài liệu `docs/post-mvp-roadmap.md`. |
| `Done` | **W1 · 26/09 · Thiết kế sao lưu và khôi phục dữ liệu** | Thế | 2026-09-26 | Owner: Thế<br>Giai đoạn: W1 (26/09)<br>Goal: Thiết kế cách người dùng xuất bản sao localStorage và khôi phục dữ liệu an toàn.<br>Nhánh gợi ý: design/local-data-backup<br><br>Tasks:<br>- Chọn định dạng JSON và CSV phù hợp từng dữ liệu.<br>- Định nghĩa schema/version và hành vi khi thiếu trường.<br>- Thiết kế xác nhận trước khi ghi đè dữ liệu.<br><br>Output: Đã hoàn tất tài liệu thiết kế tại `docs/local-data-backup-design.md`. |
| `Done` | **W1 · 29/09 · Bug: Dữ liệu localStorage sai cấu trúc làm lỗi màn hình** | Thế | 2026-09-29 | Owner: Thế (Teh fine)<br>Giai đoạn: W1 (23–29/09)<br>Nhánh gợi ý: fix/storage-schema-validation<br><br>Goal: Chặn dữ liệu JSON có cấu trúc sai lọt vào app và làm các trang lỗi khi render.<br><br>Reproduction:<br>- Lưu JSON hợp lệ về cú pháp nhưng có `courses: [null]` hoặc phần tử thiếu các trường bắt buộc vào localStorage key `deadline-tracker:data`.<br>- Tải lại ứng dụng và mở Courses.<br><br>Output: Đã hoàn tất sửa lỗi tại `src/data/appData.ts`, `src/data/storage.ts` và vượt qua bộ test tại `src/data/storage.test.ts`. |
| `Done` | **W1 · 29/09 · Review thiết kế schema và migration dữ liệu** | Thuận, Trường | 2026-09-29 | Owner: Thuận + Trường (WilliamsHugh + truongne)<br>Giai đoạn: W1<br>Nhánh gợi ý: review/storage-migration<br><br>Goal: Rà soát schema/version cho dữ liệu local trước khi thêm export/import.<br><br>Tasks:<br>- Đối chiếu Course, Schedule, Assignment, GPA với schema đang lưu.<br>- Xem xét dữ liệu cũ, t...<br><br>Output: Đã hoàn tất biên bản `docs/storage-migration-review.md`. |
| `Done` | **W1 · 29/09 · Rà soát accessibility và trình duyệt** | Trường | 2026-09-29 | Owner: Trường<br>Giai đoạn: W1 (29/09)<br>Goal: Lập baseline khả năng truy cập và tương thích trình duyệt cho các màn hình hiện có.<br>Nhánh gợi ý: test/accessibility-browser-baseline<br><br>Tasks:<br>- Kiểm tra điều hướng bàn phím và focus modal.<br>- Kiểm tra label, tương phản, thông báo lỗi.<br>- Rà soát Chrome, Firefox, Safari, Edge và Mobile.<br><br>Output: Đã hoàn tất báo cáo kiểm thử baseline tại `docs/accessibility-browser-baseline.md` và bộ test tự động tại `src/test/accessibility.test.tsx`. |

---

### Milestone W2: Data Backup & Recovery Lifecycle (30/09 – 06/10/2026)
- **Mục tiêu:** Triển khai tính năng Xuất/Nhập dữ liệu dự phòng (JSON/CSV), bắt ngoại lệ ghi đè localStorage quá quota và viết bộ kiểm thử lifecycle backup/restore.
- **Trạng thái:** 📋 To Do & Testing

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `To Do` | **W2 · 01/10 · Xuất dữ liệu người dùng** | Thế | 2026-10-01 | Owner: Thế<br>Giai đoạn: W2 (01/10)<br>Goal: Cho phép tải bản sao môn học, lịch, bài tập và GPA từ dữ liệu local hiện có.<br>Nhánh gợi ý: feat/data-export<br><br>Tasks:<br>- Xuất toàn bộ dữ liệu dạng JSON có version.<br>- Thêm CSV cho môn học và bài tập.<br>- Tên file có ngày tạo, thông báo khi xuất... |
| `To Do` | **W2 · 03/10 · Nhập và khôi phục bản sao** | Thế, Thuận | 2026-10-03 | Owner: Thế + Thuận<br>Giai đoạn: W2 (03/10)<br>Goal: Khôi phục dữ liệu từ bản JSON có kiểm tra hợp lệ trước khi thay dữ liệu đang dùng.<br>Nhánh gợi ý: feat/data-import-restore<br><br>Tasks:<br>- Chọn và đọc file JSON.<br>- Validate version, cấu trúc và quan hệ courseId.<br>- Hiển thị tóm tắt và yêu... |
| `Bug / Issue` | **W2 · 06/10 · Bug: Không xử lý lỗi khi ghi localStorage** | Thuận | 2026-10-06 | Owner: Thuận (WilliamsHugh)<br>Giai đoạn: W2 (30/09–06/10)<br>Nhánh gợi ý: fix/storage-write-error<br><br>Goal: Xử lý trường hợp trình duyệt từ chối ghi localStorage hoặc hết quota.<br><br>Reproduction:<br>- Chạy khi storage bị chặn/đầy hoặc `setItem` ném `QuotaExceededError`.<br>- Thay đổi dữ liệu ... |
| `Testing` | **W2 · 06/10 · Kiểm thử vòng đời backup/restore** | Trường | 2026-10-06 | Owner: Trường<br>Giai đoạn: W2 (06/10)<br>Goal: Kiểm chứng export/import qua bộ dữ liệu thật và tình huống lỗi.<br>Nhánh gợi ý: test/data-backup-restore<br><br>Tasks:<br>- Kiểm tra round-trip cho đủ 5 module.<br>- Thử file hỏng, sai version, thiếu môn tham chiếu.<br>- Thử hủy ghi đè và dữ liệu lớn v... |

---

### Milestone W3: Advanced Assignments & Smart Filters (07/10 – 13/10/2026)
- **Mục tiêu:** Nâng cấp quản lý bài tập: thêm mức độ ưu tiên (Priority), gắn nhãn (Tags), bộ lọc đa tiêu chí kết hợp tìm kiếm và kiểm thử workflow bài tập nâng cao.
- **Trạng thái:** 📋 To Do & Testing

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `To Do` | **W3 · 08/10 · Thêm mức ưu tiên và nhãn bài tập** | Thuận | 2026-10-08 | Owner: Thuận<br>Giai đoạn: W3 (08/10)<br>Goal: Giúp người dùng nhận biết bài tập quan trọng và phân nhóm theo chủ đề.<br>Nhánh gợi ý: feat/assignment-priority-tags<br><br>Tasks:<br>- Thêm mức ưu tiên thấp/vừa/cao.<br>- Cho phép gắn nhãn ngắn cho bài tập.<br>- Hiển thị ưu tiên/nhãn trong danh sách và... |
| `To Do` | **W3 · 10/10 · Tìm kiếm và bộ lọc kết hợp** | Thế | 2026-10-10 | Owner: Thế<br>Giai đoạn: W3 (10/10)<br>Goal: Mở rộng danh sách deadline để tìm nhanh theo tiêu đề/mô tả và kết hợp bộ lọc.<br>Nhánh gợi ý: feat/assignment-search-filters<br><br>Tasks:<br>- Tìm theo tiêu đề và mô tả.<br>- Kết hợp môn, trạng thái và ưu tiên.<br>- Có thao tác xóa toàn bộ điều kiện lọc.... |
| `Testing` | **W3 · 13/10 · Kiểm thử workflow bài tập nâng cao** | Trường | 2026-10-13 | Owner: Trường<br>Giai đoạn: W3 (13/10)<br>Goal: Kiểm tra đồng thời CRUD, tìm kiếm, bộ lọc, ưu tiên và deadline.<br>Nhánh gợi ý: test/assignment-priority-search<br><br>Tasks:<br>- Bao phủ kết hợp nhiều filter và reset.<br>- Kiểm tra deadline quá hạn/hoàn thành.<br>- Kiểm tra dữ liệu giữ nguyên sau re... |

---

### Milestone W4: Schedule Insights & GPA Scenarios (14/10 – 20/10/2026)
- **Mục tiêu:** Thêm thuật toán cảnh báo trùng lịch học, dự đoán nhiều kịch bản điểm GPA mục tiêu và hiển thị biểu đồ tải học tập theo tuần trên Dashboard.
- **Trạng thái:** 📋 To Do, Review & Testing

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `To Do` | **W4 · 15/10 · Cảnh báo trùng lịch học** | Thuận, Thế | 2026-10-15 | Owner: Thuận + Thế<br>Giai đoạn: W4 (15/10)<br>Goal: Phát hiện hai lịch học cùng ngày có thời gian chồng lấn.<br>Nhánh gợi ý: feat/schedule-conflict-detection<br><br>Tasks:<br>- Xác định quy tắc giao nhau của khoảng giờ.<br>- Cảnh báo khi thêm/sửa lịch bị trùng.<br>- Cho phép người dùng quay lại chỉ... |
| `To Do` | **W4 · 17/10 · So sánh các kịch bản GPA** | Thế | 2026-10-17 | Owner: Thế<br>Giai đoạn: W4 (17/10)<br>Goal: Cho phép thử các mức điểm khác nhau để xem ảnh hưởng lên GPA mà không ghi đè kết quả đang lưu.<br>Nhánh gợi ý: feat/gpa-scenario-comparison<br><br>Tasks:<br>- Tạo kịch bản tạm từ điểm hiện tại.<br>- So sánh GPA dự kiến giữa các kịch bản.<br>- Xóa/reset kị... |
| `Review` | **W4 · 20/10 · Review cảnh báo trùng lịch và kịch bản GPA** | Thuận, Thế | 2026-10-20 | Owner: Thuận + Thế (WilliamsHugh + Teh fine)<br>Giai đoạn: W4<br>Nhánh gợi ý: review/schedule-gpa-insights<br><br>Goal: Đánh giá logic và trải nghiệm của hai feature trước khi tích hợp.<br><br>Tasks:<br>- Rà soát trường hợp thời gian giao nhau/tiếp giáp và lịch khác ngày.<br>- Kiểm tra kịch bản GPA ... |
| `Testing` | **W4 · 20/10 · Kiểm thử Schedule và GPA insights** | Trường | 2026-10-20 | Owner: Trường<br>Giai đoạn: W4 (20/10)<br>Goal: Kiểm tra ranh giới giờ trùng lịch, kịch bản GPA và widget Dashboard.<br>Nhánh gợi ý: test/schedule-gpa-insights<br><br>Tasks:<br>- Test các khoảng giờ chồng lấn/tiếp giáp.<br>- Test dữ liệu GPA không bị ghi đè.<br>- Đối chiếu số liệu workload với danh ... |
| `To Do` | **W4 · 20/10 · Dashboard tải học tập theo tuần** | Thuận | 2026-10-20 | Owner: Thuận<br>Giai đoạn: W4 (20/10)<br>Goal: Bổ sung góc nhìn tuần về số deadline, việc quá hạn và lịch học để hỗ trợ sắp xếp thời gian.<br>Nhánh gợi ý: feat/dashboard-weekly-workload<br><br>Tasks:<br>- Tổng hợp bài tập theo tuần.<br>- Hiển thị workload và deadline gần nhất.<br>- Thêm trạng thái r... |

---

### Milestone W5: Hardening, Accessibility & Release Candidate (21/10 – 27/10/2026)
- **Mục tiêu:** Kiểm thử hồi quy trên nhiều trình duyệt, sửa lỗi cấu trúc dữ liệu local, hoàn thiện tiêu chuẩn tương thích thiết bị và chuẩn bị hồ sơ bàn giao Release Candidate.
- **Trạng thái:** ⚡ Đang thực hiện (In Progress / RC Review)

| Cột Kanban | Tên nhiệm vụ | Người phụ trách | Hạn chót | Mô tả / Tiêu chí nghiệm thu |
|---|---|---|:---:|---|
| `To Do` | **W5 · 22/10 · Hoàn thiện accessibility và responsive** | Thuận, Trường | 2026-10-22 | Owner: Thuận + Trường<br>Giai đoạn: W5 (22/10)<br>Goal: Xử lý các vấn đề ưu tiên từ baseline, chuẩn bị giao diện cho người dùng thực.<br>Nhánh gợi ý: fix/accessibility-responsive-polish<br><br>Tasks:<br>- Đảm bảo thao tác chính dùng được bằng bàn phím.<br>- Sửa focus và thông báo lỗi form.<br>- Kiểm... |
| `Testing` | **W5 · 25/10 · Regression đa trình duyệt và release candidate** | Trường, Thế | 2026-10-25 | Owner: Trường + Thế<br>Giai đoạn: W5 (25/10)<br>Goal: Chạy lại luồng MVP và tính năng mới trên các trình duyệt/màn hình mục tiêu.<br>Nhánh gợi ý: test/release-regression<br><br>Tasks:<br>- Chạy test/build sạch.<br>- Kiểm tra CRUD, backup/restore, filters, conflict, GPA scenarios.<br>- Ghi bug còn lạ... |
| `Doing` | **W5 · 25/10 · Tái hiện và phân loại lỗi dữ liệu local** | Thuận | 2026-10-27 | Owner: Thuận (WilliamsHugh)<br>Bắt đầu: 25/10/2026<br>Nhánh gợi ý: fix/storage-hardening<br><br>Goal: Đang rà soát hai rủi ro dữ liệu được phát hiện khi kiểm tra code hiện tại.<br><br>Tasks đang làm:<br>- Xác minh payload localStorage sai cấu trúc có thể làm render lỗi.<br>- Xác minh lỗi setItem có ... |
| `Review` | **W5 · 27/10 · Review release candidate và tài liệu bàn giao** | Thuận, Trường | 2026-10-27 | Owner: Thuận + Trường (WilliamsHugh + truongne)<br>Giai đoạn: W5<br>Nhánh gợi ý: review/release-candidate<br><br>Goal: Rà soát bản phát hành cuối cùng so với scope và các card Done.<br><br>Tasks:<br>- Đối chiếu acceptance criteria, test notes và known issues.<br>- Rà soát hướng dẫn chạy, backup/rest... |
| `To Do` | **W5 · 27/10 · Đóng gói tài liệu và kế hoạch phát hành** | Thuận | 2026-10-27 | Owner: Thuận<br>Giai đoạn: W5 (27/10)<br>Goal: Chuẩn bị tài liệu sử dụng, demo và ghi chú phát hành cho phiên bản sau MVP.<br>Nhánh gợi ý: docs/release-demo-package<br><br>Tasks:<br>- Cập nhật hướng dẫn cài/chạy và backup dữ liệu.<br>- Ghi phạm vi release, known issues và changelog.<br>- Cập nhật de... |

---

## 4. Quy Trình Phối Hợp & Tiêu Chuẩn Nghiệm Thu (DoD)

### 4.1. Quy trình Git & Nhánh làm việc
1. **Quy tắc đặt nhánh:**
   - Tính năng mới: `feat/<tên-chức-năng>` (vd: `feat/courses-schedule`, `feat/assignments-gpa`)
   - Kiểm thử & Đảm bảo chất lượng: `test/<tên-module>` (vd: `test/full-system-regression`)
   - Sửa lỗi: `fix/<tên-bug>` (vd: `fix/critical-bugs`, `fix/gpa-duplicate`)
   - Đánh giá giao diện: `review/<tên-màn-hình>` (vd: `review/responsive-ui`)
2. **Quy trình Merge:**
   - Tất cả PR cần ít nhất 1 thành viên review và phê duyệt.
   - Code trên nhánh `main` phải luôn đảm bảo build thành công (`npm run build`) và vượt qua 100% test suites (`npm test -- --run`).

### 4.2. Tiêu chí hoàn thành (Definition of Done - DoD)
Một task được kéo sang cột **Done** trên Trello khi thỏa mãn toàn bộ các điều kiện:
- [x] Đã code hoàn chỉnh và tuân thủ định dạng TypeScript/React.
- [x] Có kiểm thử đơn vị hoặc kiểm thử hồi quy tương ứng (Unit / Regression Test).
- [x] Kiểm thử tự động chạy pass (hiện tại `32/32 tests pass`).
- [x] Không gây lỗi tràn ngang (overflow) trên thiết bị di động (mobile responsive 390px).
- [x] Đã cập nhật biên bản hoặc ghi chú kiểm thử trong thư mục `docs/` nếu là task Milestone.
