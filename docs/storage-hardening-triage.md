# Biên Bản Tái Hiện & Phân Loại Lỗi Dữ Liệu Cục Bộ (Storage Hardening Triage Notes)

> **Milestone:** W5 — Hardening, Accessibility & Release Candidate  
> **Nhiệm vụ:** W5 · 25/10 · Tái hiện và phân loại lỗi dữ liệu local  
> **Người thực hiện:** Trần Trường Thuận (`WilliamsHugh` / `thuantruongtran0905@gmail.com`)  
> **Trello Card ID:** `6ade127c07adeca4e8fb9877` ([Trello Link](https://trello.com/c/mZ5hD4bK/52-w5-25-10-t%C3%A1i-hi%E1%BB%87n-v%C3%A0-ph%C3%A2n-lo%E1%BA%A1i-l%E1%BB%97i-d%E1%BB%AF-li%E1%BB%87u-local))  
> **Nhánh Git:** `fix/storage-hardening`  
> **Ngày lập:** 25/10/2026 (Nghiệm thu đồng bộ: 28/10/2026)  
> **Trạng thái:** ✅ Đã hoàn tất Triage, Bản vá & Kiểm chứng tự động (100% Pass)  

---

## 1. Mục Tiêu Triage

Trong quá trình chuẩn bị phát hành phiên bản Release Candidate (RC), hệ thống lưu trữ dữ liệu local (`localStorage`) trên trình duyệt đối mặt với hai rủi ro cốt lõi có thể ảnh hưởng trực tiếp đến người dùng cuối:
1. **Rủi ro 1 (Malformed / Corrupted Payload):** Dữ liệu trong `localStorage` bị lỗi cú pháp JSON, thiếu các mảng bắt buộc hoặc chứa các phần tử hỏng (`null`, thiếu ID, sai định dạng kiểu dữ liệu) do người dùng chỉnh sửa devtools hoặc lỗi phiên bản cũ dẫn tới crash trang khi render.
2. **Rủi ro 2 (Silent Quota Exceeded / Storage Blocking):** Trình duyệt từ chối ghi dữ liệu (do đầy quota 5MB, hoặc người dùng duyệt web ở chế độ Private Browsing / tắt quyền Storage), `localStorage.setItem` ném ngoại lệ `QuotaExceededError` mà ứng dụng không bắt, dẫn tới mất dữ liệu âm thầm mà người dùng không hề hay biết.

Biên bản này ghi nhận chi tiết các bước tái hiện (Reproduction), phân loại mức độ nghiêm trọng (Severity / Impact) và các giải pháp kỹ thuật đã triển khai cùng bằng chứng kiểm thử tự động.

---

## 2. Chi Tiết Phân Loại & Tái Hiện Lỗi

### Issue STO-01: Payload LocalStorage sai cấu trúc gây lỗi Render

- **Mã định danh:** `STO-01`
- **Mức độ nghiêm trọng:** `High` (Có thể làm ứng dụng dừng hoạt động ngay tại màn hình khởi động).
- **Phân loại:** Data Integrity / Crash Prevention.
- **Môi trường bị ảnh hưởng:** Toàn bộ trình duyệt khi dữ liệu local bị hỏng hoặc sau khi import file backup lỗi.
- **Các bước tái hiện (Reproduction Steps):**
  1. Mở StudySpace trên trình duyệt Chrome/Firefox.
  2. Mở Developer Tools -> Application -> Storage -> Local Storage.
  3. Đặt giá trị `deadline-tracker:data` thành chuỗi JSON hỏng: `{"courses": [null, {"name": "No ID"}], "schedules": "invalid"}` hoặc `{ syntax error`.
  4. Tải lại trang (F5).
  5. *Hành vi trước khi vá:* `loadAppData()` parse ra cấu trúc không hợp lệ; các hàm render duyệt mảng gọi `.map((c) => c.name)` gặp phần tử `null` gây `TypeError: Cannot read properties of null (reading 'name')` làm trắng trang.
- **Giải pháp kỹ thuật (Mitigation):**
  - Tích hợp lớp `sanitizeAppData(raw)` trong [`src/data/schemaValidation.ts`](file:///home/Williams/Projects/StudySpace/src/data/schemaValidation.ts):
    - Bọc khối `JSON.parse` trong `try / catch`, tự động fallback về `demoData` cấu trúc chuẩn nếu chuỗi JSON không hợp lệ hoặc parse ra kiểu nguyên thủy (`null`, số, chuỗi).
    - Duyệt từng phần tử của `courses`, `schedules`, `assignments`, `gpaEntries` qua hàm validate độc lập (`validateCourse`, `validateSchedule`, v.v.).
    - Tự động lọc bỏ các phần tử `null`, bản ghi thiếu khóa chính `id`, bản ghi tham chiếu `courseId` mồ côi (orphaned foreign keys).
    - Tự động di trú (Auto-migration) các bản ghi legacy V1 thiếu trường `priority` và `tags` sang giá trị mặc định (`priority = 'medium'`, `tags = []`).

---

### Issue STO-02: `setItem` thất bại không có cảnh báo tới người dùng

- **Mã định danh:** `STO-02`
- **Mức độ nghiêm trọng:** `High` (Mất dữ liệu âm thầm, vi phạm nguyên tắc phản hồi người dùng).
- **Phân loại:** Storage Quota / Error Visibility.
- **Môi trường bị ảnh hưởng:** Safari Private Browsing, Chrome Incognito khi bật chặn site data, hoặc khi dung lượng lưu trữ vượt quá giới hạn trình duyệt (~5MB - 10MB).
- **Các bước tái hiện (Reproduction Steps):**
  1. Tạo mock `Storage.prototype.setItem` ném `DOMException('QuotaExceededError')`.
  2. Thêm mới một môn học hoặc công việc trên giao diện.
  3. Người dùng thấy form đóng và bài tập xuất hiện tạm thời trong React memory state.
  4. *Hành vi trước khi vá:* Ngoại lệ không được bắt hoặc chỉ log ra console; người dùng ngỡ rằng dữ liệu đã lưu an toàn. Khi đóng tab hoặc F5, toàn bộ công việc vừa tạo biến mất.
- **Giải pháp kỹ thuật (Mitigation):**
  - Trong [`src/data/appData.ts`](file:///home/Williams/Projects/StudySpace/src/data/appData.ts): Hàm `saveAppData` bắt lỗi an toàn và trả về giá trị `boolean` (`true` khi thành công, `false` khi có ngoại lệ).
  - Trong [`src/context/AppDataContext.tsx`](file:///home/Williams/Projects/StudySpace/src/context/AppDataContext.tsx): Quản lý state `storageError: string | null`. Khi `saveAppData` trả về `false`, lập tức kích hoạt thông điệp cảnh báo rõ ràng.
  - Trong [`src/App.tsx`](file:///home/Williams/Projects/StudySpace/src/App.tsx): Hiển thị banner nổi bật `.storage-error-banner` ngay đầu trang:
    ```html
    <div className="storage-error-banner" role="alert" aria-live="assertive">
      <strong>Cảnh báo lưu trữ:</strong> Không thể lưu dữ liệu vào bộ nhớ trình duyệt...
      <button aria-label="Đóng thông báo lỗi lưu trữ">×</button>
    </div>
    ```
  - Cung cấp nút xóa cảnh báo `clearStorageError` và hướng dẫn người dùng xuất file JSON sao lưu kịp thời qua tính năng "Sao lưu / Khôi phục".

---

## 3. Bằng Chứng Kiểm Thử Tự Động (Verification Evidence)

Tất cả các tình huống tái hiện và biện pháp phòng vệ đã được kiểm thử tự động tại [`src/data/storageHardening.test.tsx`](file:///home/Williams/Projects/StudySpace/src/data/storageHardening.test.tsx) với kết quả **6/6 Tests PASS (100%)**:

1. `Issue 1: safely recovers when localStorage contains corrupted non-JSON string` — **PASS**
2. `Issue 1: safely recovers when localStorage payload is primitive or null` — **PASS**
3. `Issue 1: sanitizes corrupt records (null, missing id, invalid types) without app crash` — **PASS**
4. `Issue 1: auto-migrates legacy v1 payload missing priority and tags` — **PASS**
5. `Issue 2: catches QuotaExceededError in saveAppData without unhandled exception and returns false` — **PASS**
6. `Issue 2: displays visible warning banner when storage.setItem throws QuotaExceededError in UI` — **PASS**

---

## 4. Kết Luận & Bàn Giao

- Hai vấn đề dữ liệu local đã được phân loại, định danh mã lỗi, có bước tái hiện rõ ràng và giải pháp phòng thủ triệt để ở cả tầng dữ liệu lẫn tầng UI.
- Thẻ công việc **`W5 · 25/10 · Tái hiện và phân loại lỗi dữ liệu local`** đủ điều kiện hoàn thành và chuyển sang danh mục **Done**.
