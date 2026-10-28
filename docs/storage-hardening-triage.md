# Biên Bản Phân Loại & Tái Hiện Lỗi Dữ Liệu LocalStorage (Storage Hardening Triage)

> **Milestone:** W5 — Hardening, Accessibility & Release Candidate  
> **Nhiệm vụ:** W5 · 25/10 · Tái hiện và phân loại lỗi dữ liệu local  
> **Người thực hiện:** Thuận (WilliamsHugh) & Đội ngũ kỹ thuật StudySpace  
> **Trello Card ID:** `6ade127c07adeca4e8fb9877`  
> **Nhánh Git:** `fix/storage-hardening`  
> **Ngày lập:** 25/10/2026 (Nghiệm thu đồng bộ: 28/10/2026)  

---

## 1. Mục Tiêu & Bối Cảnh

Trong quá trình chuẩn bị phát hành phiên bản Release Candidate (RC), đội ngũ kỹ thuật đã rà soát toàn bộ vòng đời lưu trữ và đọc/ghi dữ liệu ngoại tuyến (`offline-first`) qua Web Storage API (`localStorage`). 

Hai rủi ro dữ liệu nghiêm trọng được phân loại, tái hiện và kiểm chứng phương án khắc phục:
1. **Rủi ro 1 (Data Corruption Crash):** Payload `localStorage` sai cấu trúc hoặc chứa giá trị rác/`null` dẫn đến sập màn hình trắng (White Screen of Death) khi React render.
2. **Rủi ro 2 (Storage Write Failure & Quota Exceeded):** Trình duyệt hết dung lượng lưu trữ (`QuotaExceededError`) hoặc chặn lưu trữ trong chế độ Ẩn danh (Private/Incognito) mà không có cơ chế cảnh báo người dùng và rollback dữ liệu.

---

## 2. Chi Tiết Từng Lỗi, Các Bước Tái Hiện & Phương Án Xử Lý

### 2.1. Lỗi 1: Payload localStorage Sai Cấu Trúc Gây Sập Màn Hình

* **Mã định danh:** `BUG-STORAGE-01`
* **Thẻ Trello liên kết:** `W1 · 29/09 · Bug: Dữ liệu localStorage sai cấu trúc làm lỗi màn hình` (`6ade126facd70906709d3ddd`)
* **Mức độ nghiêm trọng:** `High / Blocker` (Gây gián đoạn hoàn toàn ứng dụng)

#### Các bước tái hiện (Reproduction Steps):
1. Mở DevTools Console trên trình duyệt tại tab StudySpace.
2. Tiêm dữ liệu lỗi vào key lưu trữ chính:
   ```javascript
   localStorage.setItem('study_space_data', JSON.stringify({
     courses: [null, { id: 'c1', name: '' }],
     assignments: "invalid_string",
     schedules: null
   }));
   ```
3. Tải lại trang (F5).
4. **Hiện tượng quan sát được (trước khi fix):** Hàm render tại `CoursesPage` và `DashboardPage` gọi `data.courses.map(...)` gặp phần tử `null` dẫn đến lỗi runtime `TypeError: Cannot read properties of null (reading 'id')`, toàn bộ ứng dụng sập trắng.

#### Nguyên nhân gốc (Root Cause):
Hàm `loadAppData()` trước đây chỉ dùng `JSON.parse()` cơ bản mà không kiểm tra tính toàn vẹn của từng trường mảng và kiểu dữ liệu của các thực thể con bên trong `courses`, `assignments`, `schedules`, `gpaEntries`.

#### Giải pháp kỹ thuật đã triển khai & Kiểm chứng:
- **Xây dựng bộ kiểm định Schema nghiêm ngặt:** Triển khai hàm [`isAppData`](file:///home/Williams/Projects/StudySpace/src/data/appData.ts#L30-L50) xác thực cấu trúc cấp cao và lọc sạch dữ liệu mồ côi (`sanitizeAppData`).
- **Cơ chế Fallback an toàn:** Nếu payload bị hỏng hoặc không đạt chuẩn, hệ thống tự động ghi nhật ký cảnh báo và nạp bộ dữ liệu mặc định ban đầu (`initialData`) mà không để sập UI.
- **Bằng chứng kiểm thử:** Bộ unit test tại [`src/data/schemaValidation.test.ts`](file:///home/Williams/Projects/StudySpace/src/data/schemaValidation.test.ts) và [`src/data/storage.test.ts`](file:///home/Williams/Projects/StudySpace/src/data/storage.test.ts) bao phủ 100% tình huống payload lỗi.

---

### 2.2. Lỗi 2: Trình Duyệt Bị Chặn Hoặc Vượt Hạn Ngạch Ghi (`QuotaExceededError`)

* **Mã định danh:** `BUG-STORAGE-02`
* **Thẻ Trello liên kết:** `W2 · 06/10 · Bug: Không xử lý lỗi khi ghi localStorage` (`6ade127236f23d4e2198110c`)
* **Mức độ nghiêm trọng:** `High` (Mất mát dữ liệu ngầm mà người dùng không biết)

#### Các bước tái hiện (Reproduction Steps):
1. Chạy ứng dụng trong môi trường iframe bị chặn quyền Storage (Storage Access Blocked) hoặc giả lập dung lượng bộ nhớ `localStorage` đã đầy.
2. Người dùng tạo mới hoặc cập nhật một Môn học / Bài tập / Điểm GPA.
3. Trình duyệt ném ngoại lệ `QuotaExceededError` (DOM Exception 22).
4. **Hiện tượng quan sát được (trước khi fix):** Lỗi unhandled exception bung ra console, React state cập nhật cục bộ nhưng `localStorage` không lưu được; khi người dùng refresh hoặc mở tab mới, toàn bộ dữ liệu vừa nhập bị biến mất không dấu vết.

#### Nguyên nhân gốc (Root Cause):
Hàm ghi `localStorage.setItem` không được bọc trong khối `try...catch`, thiếu cơ chế phát tín hiệu báo lỗi ra ngoài component và thiếu snapshot rollback để bảo vệ dữ liệu trước đó.

#### Giải pháp kỹ thuật đã triển khai & Kiểm chứng:
- **Try-Catch & Error Signaling:** Trong [`src/data/appData.ts`](file:///home/Williams/Projects/StudySpace/src/data/appData.ts#L52-L68), bọc toàn bộ thao tác `setItem` trong `try...catch`, trả về cờ trạng thái boolean và kích hoạt callback `onError`.
- **Banner cảnh báo trực quan:** Tại [`src/App.tsx`](file:///home/Williams/Projects/StudySpace/src/App.tsx#L43-L60), hiển thị banner cảnh báo đỏ nổi bật (`role="alert"`, `aria-live="assertive"`) khi không thể lưu trữ, kèm nút xuất JSON khẩn cấp để bảo toàn dữ liệu.
- **Snapshot Dự phòng & Safe Rollback:** Trong [`src/data/backupService.ts`](file:///home/Williams/Projects/StudySpace/src/data/backupService.ts#L170-L210), trước khi ghi đè dữ liệu khôi phục, hệ thống tự động tạo snapshot; nếu gặp lỗi quota hoặc parse, tự động rollback về trạng thái an toàn ban đầu.
- **Bằng chứng kiểm thử:** 14/14 automated tests tại [`src/data/backupLifecycle.test.ts`](file:///home/Williams/Projects/StudySpace/src/data/backupLifecycle.test.ts) đã kiểm chứng thành công kịch bản rollback khi ném `QuotaExceededError`.

---

## 3. Ma Trận Đánh Giá Triage & Trạng Thái

| Mã Lỗi | Tên lỗi | Phân loại | Mức độ | Trạng thái | Thẻ Trello tương ứng |
|---|---|---|:---:|:---:|:---:|
| `BUG-STORAGE-01` | Payload localStorage sai cấu trúc gây sập | Schema Validation | High | ✅ Đã khắc phục & verify | `6ade126facd70906709d3ddd` |
| `BUG-STORAGE-02` | QuotaExceededError / Chặn ghi Web Storage | Storage Hardening | High | ✅ Đã khắc phục & verify | `6ade127236f23d4e2198110c` |

---

## 4. Kết Luận
Cả hai nguy cơ lỗi dữ liệu local đã được tái hiện rõ ràng, phân loại chi tiết và kiểm chứng độ ổn định với 100% test case xanh. Hệ thống lưu trữ đạt tiêu chuẩn ổn định cấp Release Candidate.
