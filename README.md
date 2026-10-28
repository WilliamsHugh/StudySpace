# StudySpace — Deadline Tracker

> **Ứng dụng quản lý học tập, theo dõi thời khóa biểu, tiến độ deadline và mô phỏng điểm GPA cá nhân hóa.**  
> *Được xây dựng với React 18, TypeScript và Vite theo kiến trúc Offline-First (lưu trữ cục bộ bảo mật).*

---

## 1. Tính Năng Nổi Bật (Key Features)

### 📚 Quản Lý Môn Học (Courses)
* Thêm, sửa, xóa môn học kèm thông tin giảng viên, số tín chỉ và mã màu nhận diện trực quan.
* Tự động đồng bộ màu sắc nhận diện sang Thời khóa biểu, Thẻ deadline và Biểu đồ tải học tập.

### 📅 Thời Khóa Biểu Tuần & Cảnh Báo Trùng Lịch (Schedule & Conflict Detection)
* Lưới lịch tuần trực quan 7 ngày (Thứ Hai đến Chủ Nhật).
* **Phát hiện trùng lịch tự động:** Cảnh báo tức thì khi hai buổi học có khung giờ giao thoa (`startA < endB && startB < endA`), phân biệt chính xác giờ tiếp giáp liên tiếp và hỗ trợ lưu có chủ đích.

### 📝 Quản Lý Bài Tập Nâng Cao (Smart Assignments)
* Phân loại mức độ ưu tiên: **Thấp (Low)**, **Vừa (Medium)**, **Cao (High)** với huy hiệu màu sắc.
* Hỗ trợ gắn nhãn linh hoạt (**Tags** dạng `#BaoCao`, `#DoAn`).
* **Bộ lọc thông minh kết hợp:** Lọc đa chiều theo Môn học, Trạng thái (Chưa làm / Đang làm / Hoàn thành), Mức ưu tiên và tìm kiếm từ khóa theo thời gian thực.
* Tự động tính toán trạng thái **Quá hạn** dựa trên thời gian thực tế.

### 🎯 Mô Phỏng & Kịch Bản GPA Giả Định (GPA Simulator & What-If Scenarios)
* Tính toán điểm trung bình tích lũy GPA hệ 4 có trọng số tín chỉ: `Σ (điểm hệ 4 × tín chỉ) / Σ tín chỉ`.
* **Công cụ What-If Analysis:** Thử nghiệm thay đổi điểm số dự kiến độc lập hoàn toàn mà không làm ghi đè hay xáo trộn dữ liệu điểm chính thức, hiển thị chênh lệch $\Delta$ GPA tức thì.
* Tùy chọn 1-click để áp dụng kịch bản điểm vào bảng điểm chính thức khi đã hài lòng.

### 📊 Dashboard Tổng Quan & Phân Bổ Tải Học Tập (Weekly Workload)
* Thống kê nhanh: Số môn học, tổng số bài tập, bài tập quá hạn và điểm GPA mục tiêu.
* **Widget tải học tập 7 ngày:** Tự động tổng hợp số lượng tiết học và deadline theo từng ngày trong tuần hiện tại, đánh dấu mức độ tải (Rảnh rỗi, Vừa phải, Bận rộn) và chỉ báo ngày bận rộn nhất (Peak Day).

### 💾 An Toàn Dữ Liệu & Sao Lưu Ngoại Tuyến (Offline Data Mobility)
* **Sao lưu JSON Envelope v2:** Xuất và khôi phục toàn bộ dữ liệu ứng dụng kèm metadata phiên bản.
* **Xuất CSV tương thích Microsoft Excel:** Hỗ trợ xuất bảng Môn học và Bài tập chuẩn UTF-8 BOM (`\uFEFF`).
* **Cơ chế tự bảo vệ & phục hồi:** Tự động phát hiện và làm sạch payload hỏng, snapshot dự phòng và hoàn tác (safe rollback) khi bộ nhớ trình duyệt đầy (`QuotaExceededError`).
* **Trợ năng chuẩn WCAG 2.1 AA:** Hỗ trợ Skip-Link `#main-content`, Focus Trap trong modal dialog, điều hướng 100% bằng bàn phím và giao diện co giãn tối ưu cho màn hình di động (390px).

---

## 2. Hướng Dẫn Cài Đặt & Chạy Ứng Dụng

### Yêu cầu môi trường
* **Node.js:** phiên bản `18.x` hoặc `20.x+`
* **npm:** phiên bản `9.x+`

### Các bước cài đặt
```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev
```
Sau khi chạy lệnh, truy cập trình duyệt tại địa chỉ: `http://localhost:5173`.

---

## 3. Kiểm Thử & Đóng Gói (Testing & Build)

### Chạy toàn bộ kiểm thử tự động (Unit, Integration, E2E)
```bash
# Chạy toàn bộ test suites với Vitest
npm test -- --run
```
> *Hiện tại ứng dụng vượt qua **100% (127 / 127 tests)** trên 23 test suites mà không có cảnh báo nào.*

### Kiểm tra kiểu dữ liệu & Đóng gói sản phẩm
```bash
# Kiểm tra TypeScript và build production
npm run build
```
Thư mục sản phẩm sau khi build sẽ được tạo tại `/dist` với kích thước bundle tối ưu sẵn sàng deploy tĩnh (Vercel, Netlify, GitHub Pages).

---

## 4. Cấu Trúc Mã Nguồn (Architecture Overview)

```text
StudySpace/
├── src/
│   ├── components/         # Các thành phần giao diện dùng chung (Modal, FieldError, BackupRestoreModal)
│   ├── context/            # React Context quản lý trạng thái toàn cục (AppDataContext)
│   ├── data/               # Tầng lưu trữ, schema validation, backup/restore và initialData
│   ├── domain/             # Logic nghiệp vụ thuần túy (courses, schedule, assignments, gpa, workload)
│   ├── features/           # Các màn hình tính năng (courses, schedule, assignments, insights, release)
│   ├── pages/              # Các trang chính (DashboardPage, AssignmentsPage, GpaPage)
│   ├── test/               # Kiểm thử khả năng truy cập (accessibility) và trình duyệt
│   ├── types/              # Định nghĩa TypeScript cho toàn bộ ứng dụng
│   ├── App.tsx             # Shell ứng dụng chính, điều hướng navbar và banner báo lỗi
│   └── styles.css          # Hệ thống CSS Design Tokens, responsive và trợ năng
├── docs/                   # Tài liệu thiết kế kỹ thuật, biên bản review, kế hoạch milestone
└── package.json
```

---

## 5. Bản Quyền & Giấy Phép
Dự án được phát triển phục vụ mục đích học tập và quản lý công việc cá nhân. Giữ toàn quyền tác quyền nội bộ nhóm phát triển StudySpace.
