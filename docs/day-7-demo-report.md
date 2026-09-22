# Day 7 — Báo cáo tiến độ và kịch bản demo StudySpace

> Trạng thái: **Bản nháp**
>
> Nhánh chuẩn bị: `docs/demo-report`
>
> Quy ước: mọi nội dung chưa có bằng chứng trong repository hoặc chưa được nhóm xác nhận đều được đánh dấu `TODO`.

## 1. Mục tiêu Day 7

- Tổng hợp tiến độ từ Day 1 đến Day 7.
- Chốt người phụ trách và Definition of Done (DoD) cho từng hạng mục.
- Chuẩn bị kịch bản demo 3–5 phút cho luồng Courses → Assignments → Dashboard → GPA.
- Ghi nhận trung thực phần đã chạy được và phần còn thiếu; không dùng số liệu kiểm thử hoặc ảnh chưa được tạo và xác minh.

## 2. Timeline Day 1–Day 7

| Ngày | Mục tiêu / công việc | Người phụ trách | Trạng thái và bằng chứng |
|---|---|---|---|
| Day 1 | Khởi tạo React + Vite + TypeScript; định nghĩa model dữ liệu; tạo layout cơ bản. | Thành viên A — `TODO: bổ sung họ tên` | **Đã có trong repository:** cấu hình dự án, model trong `src/domain/types.ts`, layout trong `src/components/layout/`. |
| Day 2 | Tạo state dùng Context + reducer, lưu `localStorage`; hoàn thiện CRUD Courses và validation cơ bản. | Thành viên A — `TODO: bổ sung họ tên` | **Đã có trong repository:** `StudySpaceContext`, reducer, storage và giao diện thêm/sửa/xóa môn học. Commit nền: `57b599b`. |
| Day 3 | Hoàn thiện nghiệp vụ GPA và màn hình nhập điểm kỳ vọng. | Thành viên B — `TODO: bổ sung họ tên` | **Một phần:** đã có hàm quy đổi/tính GPA và unit test. `TODO:` màn hình GPA hiện vẫn là placeholder; cần bổ sung thao tác nhập/sửa điểm kỳ vọng. |
| Day 4 | Hoàn thiện CRUD Assignments, liên kết bài tập với môn học và deadline. | Thành viên C — `TODO: bổ sung họ tên` | `TODO:` mới có model `Assignment`; chưa có giao diện và action reducer tương ứng. |
| Day 5 | Hoàn thiện Dashboard từ dữ liệu Courses, Assignments và GPA; rà soát responsive. | Thành viên B — `TODO: bổ sung họ tên` | **Một phần:** Dashboard đã đọc state và hiển thị số môn, số bài theo trạng thái, GPA dự kiến. `TODO:` xác minh lại sau khi luồng Assignments và nhập GPA được hoàn thiện; `TODO:` kết quả rà soát responsive. |
| Day 6 | Tích hợp các nhánh tính năng; chạy test, typecheck/build và sửa lỗi hồi quy. | Cả nhóm; điều phối: `TODO: bổ sung họ tên` | **Một phần:** typecheck, 7 test hiện có và production build đều pass trên trạng thái làm việc dùng để soạn bản nháp. `TODO:` chưa có commit tích hợp Day 3–5 trong nhánh hiện tại. |
| Day 7 | Chốt tài liệu, dữ liệu demo, rehearsal 3–5 phút và báo cáo kết quả cuối. | Người demo: `TODO: bổ sung họ tên`; người bấm giờ/ghi lỗi: `TODO: bổ sung họ tên` | **Đang thực hiện:** có bản nháp này. `TODO:` chốt dữ liệu demo, ảnh minh họa (nếu cần), kết quả rehearsal và liên kết commit tích hợp. |

### Phân công theo hạng mục

| Hạng mục | Người chịu trách nhiệm chính | Người review | Đầu ra cần bàn giao |
|---|---|---|---|
| Foundation, state và lưu trữ | Thành viên A — `TODO: họ tên` | `TODO: họ tên` | Model, reducer/context, cơ chế lưu/khôi phục state. |
| Courses | Thành viên A — `TODO: họ tên` | `TODO: họ tên` | CRUD, validation, liên kết dữ liệu phụ thuộc khi xóa môn. |
| Assignments | Thành viên C — `TODO: họ tên` | `TODO: họ tên` | CRUD, deadline, trạng thái và liên kết Course. |
| GPA | Thành viên B — `TODO: họ tên` | `TODO: họ tên` | Nhập điểm kỳ vọng, quy đổi hệ 4 và GPA có trọng số tín chỉ. |
| Dashboard và responsive | Thành viên B — `TODO: họ tên` | `TODO: họ tên` | Chỉ số tổng hợp đúng theo state và giao diện dùng được trên kích thước màn hình đã thống nhất. |
| Kiểm thử, tích hợp và tài liệu demo | Cả nhóm; điều phối `TODO: họ tên` | `TODO: họ tên` | Kết quả test/build, danh sách lỗi còn lại, kịch bản và biên bản rehearsal. |

> `TODO:` Nhóm xác nhận tên thật, vai trò và người review trước khi phát hành báo cáo. Các ký hiệu A/B/C chỉ là chỗ giữ vị trí, không phải thông tin thành viên đã được xác nhận.

## 3. Definition of Done

Một hạng mục chỉ được chuyển sang “Done” khi đáp ứng toàn bộ điều kiện áp dụng:

- Luồng người dùng theo acceptance criteria chạy được từ giao diện, không chỉ có model hoặc hàm nghiệp vụ.
- Dữ liệu được cập nhật đúng trong state và vẫn còn sau khi tải lại trang khi hạng mục yêu cầu lưu trữ.
- Có validation và trạng thái rỗng/lỗi phù hợp; thao tác xóa dữ liệu phụ thuộc không để lại bản ghi mồ côi.
- Logic quan trọng có test tự động; test hiện có đều pass.
- `npm run typecheck`, `npm test` và `npm run build` đều pass trên commit được demo.
- Không có lỗi nghiêm trọng trong các luồng Courses, Assignments, Dashboard và GPA.
- Giao diện được kiểm tra trên các kích thước màn hình do nhóm thống nhất. `TODO:` ghi rõ trình duyệt, viewport và kết quả kiểm tra.
- Code đã được review và tích hợp vào nhánh dùng cho demo. `TODO:` bổ sung commit tích hợp/PR sau khi có.
- Dữ liệu demo đã được duyệt, không chứa dữ liệu cá nhân hoặc số liệu chưa xác minh.
- Tài liệu Day 7 phản ánh đúng trạng thái thực tế; ảnh hoặc kết quả đo chưa có phải để `TODO`.

### DoD riêng theo luồng demo

- **Courses:** thêm, sửa và xóa môn; chặn tên trống và số tín chỉ ngoài phạm vi cho phép.
- **Assignments:** tạo bài tập thuộc một môn, đặt deadline, đổi trạng thái và thấy thay đổi trên Dashboard. `TODO: chưa có UI/logic hoàn chỉnh trong nhánh hiện tại`.
- **Dashboard:** số môn, số bài cần làm/đã hoàn thành và GPA lấy từ cùng một state, cập nhật sau thao tác demo.
- **GPA:** nhập điểm kỳ vọng theo môn, quy đổi và tính trung bình có trọng số tín chỉ; không cộng trùng tín chỉ. `TODO: chưa có UI nhập điểm trong nhánh hiện tại`.

## 4. Kịch bản demo 3–5 phút

Thời lượng mục tiêu: khoảng **4 phút**. Không nhập dữ liệu ngẫu hứng; trước buổi demo cần điền và duyệt bộ dữ liệu ở phần Chuẩn bị.

### Chuẩn bị trước demo

- Checkout đúng commit demo: `TODO: mã commit tích hợp`.
- Chạy ứng dụng và mở trang Dashboard trước khi bắt đầu.
- Dùng profile trình duyệt sạch hoặc xóa đúng khóa `localStorage` của StudySpace để tránh dữ liệu cũ làm sai kết quả.
- Bộ dữ liệu đã duyệt:
  - Course: `TODO: tên môn, giảng viên, số tín chỉ, màu`.
  - Assignment: `TODO: tiêu đề, course liên kết, deadline, trạng thái ban đầu`.
  - Điểm kỳ vọng: `TODO: điểm của từng course`.
- `TODO:` rehearsal và ghi thời lượng thực tế; `TODO:` chuẩn bị phương án dự phòng nếu thao tác trực tiếp gặp lỗi.

### 0:00–0:25 — Mở đầu

**Lời dẫn:** “StudySpace gom môn học, bài tập và điểm kỳ vọng vào một nơi. Trong vài phút, mình sẽ tạo dữ liệu học tập và cho thấy Dashboard cùng GPA cập nhật từ dữ liệu đó.”

- Chỉ nhanh bốn khu vực sẽ demo: Courses, Assignments, Dashboard và GPA.
- Không đọc toàn bộ menu hoặc giải thích kiến trúc ở phần này.

### 0:25–1:20 — Courses

1. Mở **Môn học**.
2. Nhập bộ Course đã được duyệt ở phần Chuẩn bị rồi bấm **Thêm môn học**.
3. Chỉ ra môn vừa tạo trong danh sách và số tín chỉ.
4. Sửa một trường đã định trước, lưu lại và xác nhận danh sách cập nhật.
5. Nếu cần minh họa validation, gửi form có tên trống; không xóa Course chính vì Assignment và GPA sẽ liên kết với Course này.

**Điểm cần nói:** Courses là dữ liệu gốc; số tín chỉ được dùng làm trọng số GPA, còn Assignment tham chiếu đến Course.

### 1:20–2:15 — Assignments

1. Mở **Bài tập**.
2. Tạo Assignment bằng bộ dữ liệu đã duyệt, chọn Course vừa tạo và deadline định trước.
3. Đổi trạng thái theo kịch bản đã duyệt, ví dụ từ trạng thái ban đầu sang trạng thái tiếp theo.
4. Xác nhận Assignment xuất hiện đúng nhóm/bộ lọc và vẫn còn sau khi tải lại trang nếu có bước kiểm tra persistence.

**Trạng thái hiện tại:** `TODO:` UI và reducer cho Assignments chưa có trong nhánh hiện tại. Chỉ thực hiện phần này sau khi đạt DoD; trong rehearsal hiện tại phải nói rõ đây là phần chưa hoàn thiện, không mô tả như đã chạy thành công.

### 2:15–3:05 — Dashboard

1. Quay lại **Tổng quan**.
2. Chỉ ra thẻ số môn học đã phản ánh Course vừa thêm.
3. Đối chiếu số bài cần làm/đã hoàn thành với trạng thái Assignment vừa thao tác.
4. Chỉ ra vùng GPA dự kiến và giải thích kết quả sẽ xuất hiện sau khi nhập điểm kỳ vọng.

**Trạng thái hiện tại:** thẻ Dashboard đã đọc dữ liệu từ state; `TODO:` kiểm chứng số Assignment và GPA sau khi các màn hình nhập liệu tương ứng được tích hợp. Không ghi trước con số kỳ vọng khi bộ dữ liệu demo chưa được duyệt.

### 3:05–3:50 — GPA

1. Mở **GPA dự kiến**.
2. Nhập điểm kỳ vọng đã duyệt cho Course demo.
3. Chỉ ra mức quy đổi hệ 4 và GPA có trọng số theo tín chỉ.
4. Quay lại Dashboard để xác nhận GPA dự kiến đồng bộ.

**Trạng thái hiện tại:** đã có logic tính GPA và test đơn vị; `TODO:` màn hình nhập điểm kỳ vọng chưa được triển khai. Không trình bày giá trị GPA cụ thể cho đến khi dữ liệu demo được chốt và kết quả được ứng dụng tính trực tiếp.

### 3:50–4:10 — Kết thúc

**Lời kết:** “Luồng vừa rồi cho thấy dữ liệu được nối từ môn học và bài tập đến Dashboard, đồng thời GPA được tính theo tín chỉ. Các mục còn `TODO` trong báo cáo là điều kiện phải hoàn tất trước bản demo chính thức.”

## 5. Nhật ký xác minh

| Kiểm tra | Kết quả | Bằng chứng / ghi chú |
|---|---|---|
| `npm run typecheck` | **Pass** | TypeScript project build kết thúc với exit code 0. |
| `npm test` | **Pass** | Vitest: 3 test files, 7 tests pass. |
| `npm run build` | **Pass** | TypeScript build và Vite production build kết thúc với exit code 0; 41 modules được transform. |
| Courses | Một phần đã có | Có UI CRUD và validation; `TODO:` rehearsal trên commit demo. |
| Assignments | `TODO` | Hiện là placeholder. |
| Dashboard | Một phần đã có | Đọc state hiện tại; phụ thuộc luồng Assignments/GPA để xác minh đầy đủ. |
| GPA | Một phần đã có | Có logic và unit test; UI nhập điểm là `TODO`. |
| Responsive | `TODO` | Chưa có ma trận viewport/kết quả kiểm tra được xác nhận. |
| Ảnh minh họa | `TODO` | Chưa tạo/chưa xác minh; không chèn ảnh thay thế. |

## 6. Việc cần chốt trước demo chính thức

- `TODO:` điền tên thành viên, người review, người demo và người bấm giờ.
- `TODO:` tích hợp và xác minh Assignments cùng giao diện nhập GPA.
- `TODO:` duyệt bộ dữ liệu demo, sau đó ghi kết quả do ứng dụng tạo ra thay vì tính/điền thủ công.
- `TODO:` chạy toàn bộ lệnh kiểm tra trên commit demo và cập nhật nhật ký xác minh.
- `TODO:` rehearsal trong khung 3–5 phút, ghi lại thời lượng và lỗi phát sinh.
- `TODO:` chỉ bổ sung ảnh chụp màn hình sau khi ảnh được tạo từ đúng commit demo và được kiểm tra.
