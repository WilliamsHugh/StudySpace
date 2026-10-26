# Kế Hoạch Lộ Trình Nâng Cấp Sau MVP (Post-MVP Roadmap) — StudySpace

> **Tài liệu:** Kế hoạch lộ trình và Định nghĩa hoàn thành (DoD) giai đoạn hậu MVP  
> **Người thực hiện (Owner):** Trần Trường Thuận (`WilliamsHugh` / `thuantruongtran0905@gmail.com`)  
> **Giai đoạn:** Milestone W1 (24/09/2026)  
> **Trạng thái:** ✅ Đã nghiệm thu & Thống nhất nội bộ  
> **Liên kết Trello Card:** `W1 · 24/09 · Chốt phạm vi bản nâng cấp sau MVP` (ID: `6ade11ace653a8b4b073e555`)

---

## 1. Bối Cảnh & Mục Tiêu Tổng Thể

Sau khi hoàn thành Milestone W0 (MVP Foundation & Core Delivery) với 35/35 nhiệm vụ được bàn giao, toàn bộ luồng nghiệp vụ cơ bản (Quản lý môn học, Thời khóa biểu tuần, Bài tập/Deadline quá hạn, GPA Simulator, Dashboard) đã hoạt động ổn định và vượt qua 32/32 bài kiểm thử tự động.

Giai đoạn 5 tuần tiếp theo (W1 – W5: từ 24/09/2026 đến 27/10/2026) tập trung vào việc **nâng cấp tính toàn vẹn dữ liệu, tối ưu hóa quy trình quản lý thời gian của sinh viên, mở rộng tính năng thông minh và chuẩn bị phát hành phiên bản Release Candidate (RC)**.

---

## 2. Các Mục Tiêu Đo Được (Measurable Goals)

Nhóm thống nhất 4 mục tiêu trọng tâm, có thể định lượng rõ ràng:

1. **Toàn vẹn & An toàn Dữ liệu (Data Resilience & Portability):**
   * Đạt 100% tỷ lệ sao lưu và khôi phục thành công qua file JSON có schema versioning.
   * Xử lý 100% các tình huống lỗi khi `localStorage` bị quá quota (`QuotaExceededError`) hoặc dữ liệu nhập vào bị sai cấu trúc, có thông báo hướng dẫn rõ ràng trên giao diện, không để phát sinh uncaught exception làm trắng trang.

2. **Nâng cao Hiệu suất Quản lý Bài tập (Smart Deadline Management):**
   * Cho phép phân loại bài tập theo 3 mức ưu tiên (`low`, `medium`, `high`) và gắn nhãn (tags).
   * Cung cấp khả năng tìm kiếm tức thì theo từ khóa kết hợp bộ lọc đa tiêu chí (môn học, trạng thái, độ ưu tiên) với độ trễ phản hồi UI < 50ms trên client.

3. **Cảnh báo Xung đột & Hỗ trợ Kế hoạch Học tập (Schedule & GPA Insights):**
   * Phát hiện chính xác 100% các cặp lịch học bị trùng lặp/chồng lấn khung giờ trong cùng ngày học (không báo sai đối với các khung giờ tiếp giáp liên tiếp).
   * Hỗ trợ lưu trữ và so sánh các kịch bản GPA dự kiến giả định mà không làm ghi đè hay sai lệch điểm chính thức đang lưu.
   * Cung cấp góc nhìn phụ tải học tập theo tuần (Weekly Workload Widget) trên Dashboard.

4. **Khả năng Tiếp cận & Độ Ổn định Phát hành (Accessibility & Quality Release):**
   * Hỗ trợ đầy đủ điều hướng bằng bàn phím (Tab, Enter, Escape cho Modal) và bổ sung chuẩn nhãn `aria-label`.
   * Đảm bảo tính tương thích hiển thị (zero horizontal scrollbar) trên kích thước màn hình điện thoại tối thiểu 390px.
   * Duy trì 100% tỷ lệ pass của toàn bộ Test Suites và build production sạch (`npm run build`).

---

## 3. Ma Trận Ưu Tiên Giá Trị vs Rủi Ro (Value vs. Risk Matrix)

| Hạng mục nâng cấp | Giá trị người dùng | Rủi ro kỹ thuật | Mức ưu tiên | Milestone dự kiến | Phụ trách chính |
|---|:---:|:---:|:---:|:---:|:---:|
| **Xử lý lỗi ghi localStorage & Quota Exceeded** | Rất cao | Trung bình | **P0 (Bắt buộc)** | W2 | Thuận |
| **Xuất / Nhập và Khôi phục dữ liệu (JSON/CSV)** | Rất cao | Cao (mất dữ liệu nếu lỗi) | **P0 (Bắt buộc)** | W2 | Thế, Thuận |
| **Mức ưu tiên & Nhãn bài tập (Priority & Tags)** | Cao | Thấp | **P1 (Quan trọng)** | W3 | Thuận |
| **Bộ lọc đa tiêu chí & Tìm kiếm bài tập** | Cao | Thấp | **P1 (Quan trọng)** | W3 | Thế |
| **Thuật toán cảnh báo trùng lịch học** | Cao | Trung bình | **P1 (Quan trọng)** | W4 | Thuận, Thế |
| **Widget tải học tập theo tuần trên Dashboard** | Trung bình | Thấp | **P2 (Nên có)** | W4 | Thuận |
| **So sánh kịch bản GPA song song** | Trung bình | Thấp | **P2 (Nên có)** | W4 | Thế |
| **Hoàn thiện Accessibility (a11y) & Mobile Polish** | Cao | Thấp | **P1 (Quan trọng)** | W5 | Thuận, Trường |
| **Đóng gói phát hành Release Candidate & Docs** | Rất cao | Thấp | **P0 (Bắt buộc)** | W5 | Thuận, Trường |

---

## 4. Phân Định Phạm Vi: Những Gì Làm và Chưa Làm

### 4.1. Trong phạm vi (In Scope)
* Kiến trúc lưu trữ Local Client: Mở rộng `AppData` hỗ trợ version, schema migration cho dữ liệu cũ.
* Cơ chế Export/Import dữ liệu định dạng JSON kèm metadata, hỗ trợ CSV export cho bảng biểu môn học.
* Cập nhật trường `priority` và `tags` cho bài tập, nâng cấp các form nhập liệu và màn hình hiển thị.
* Thuật toán kiểm tra giao thoa thời gian (`time overlap algorithm`) cho lịch học trong tuần.
* Kịch bản GPA nháp tạm thời (Sandbox / Scenario comparison).
* Nâng cấp widget phụ tải Dashboard theo tuần.
* Đảm bảo chuẩn Accessibility (focus trap, phím Escape, screen reader labels).
* Đóng gói hồ sơ phát hành, changelog và hướng dẫn kiểm thử.

### 4.2. Ngoài phạm vi đợt này (Out of Scope — Chưa triển khai)
* **Backend Database & Server Sync:** Không dựng máy chủ backend NodeJS/Python hoặc cơ sở dữ liệu từ xa (PostgreSQL/MongoDB). Giữ nguyên mô hình Client-side offline-first bằng `localStorage`.
* **Xác thực người dùng từ xa (Cloud Auth):** Chưa hỗ trợ đăng nhập nhiều tài khoản qua Google/OAuth2 hoặc phân quyền tài khoản trên đám mây.
* **Đồng bộ thời gian thực đa thiết bị (Real-time Cloud Sync / WebSockets):** Dữ liệu di chuyển giữa các thiết bị thông qua tệp xuất/nhập JSON thủ công.
* **Push Notification cấp hệ điều hành (Native OS Push):** Chưa đăng ký Service Worker Web Push Notification nền mà sử dụng cảnh báo trực quan trên giao diện ứng dụng.

---

## 5. Định Nghĩa Hoàn Thành (Definition of Done — DoD) Cập Nhật

Một nhiệm vụ thuộc giai đoạn hậu MVP chỉ được chuyển sang cột **Done** khi đáp ứng đủ các tiêu chuẩn sau:

1. **Mã nguồn & Kiểu dữ liệu:** Đã được code hoàn thiện, tuân thủ TypeScript nghiêm ngặt (không dùng `any`), tương thích với cấu trúc component hiện hữu.
2. **Kiểm thử tự động:** Mọi logic nghiệp vụ mới đều có Unit Test hoặc Regression Test đi kèm; toàn bộ test suite (`npm test -- --run`) phải pass 100%.
3. **Build thành công:** Lệnh `npm run build` chạy thành công không có lỗi syntax hoặc cảnh báo type.
4. **Không lỗi giao diện:** Kiểm tra hiển thị responsive không có hiện tượng vỡ layout hoặc thanh cuộn ngang ngoài ý muốn trên viewport di động chuẩn (390px).
5. **Ghi nhận & Bàn giao:** Cập nhật tài liệu kỹ thuật hoặc biên bản review trong thư mục `docs/`, commit git rõ ràng theo quy chuẩn và cập nhật trạng thái thẻ tương ứng trên Trello.
