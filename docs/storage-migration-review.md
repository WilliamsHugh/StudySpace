# Biên Bản Đánh Giá Thiết Kế Schema & Di Trú Dữ Liệu (Storage Migration Review)

> **Tài liệu:** Đánh giá kiến trúc Schema, Tính toàn vẹn dữ liệu và Chiến lược Migration  
> **Người thực hiện:** Trần Trường Thuận (`WilliamsHugh`) & Trường Lê (`truongne`)  
> **Giai đoạn:** Milestone W1 (29/09/2026)  
> **Trạng thái:** ✅ Đã hoàn tất đánh giá & Chấp thuận kiến trúc  
> **Liên kết Trello Card:** `W1 · 29/09 · Review thiết kế schema và migration dữ liệu` (ID: `6ade12759d3eaa18a38a17a2`)

---

## 1. Hiện Trạng Schema Lưu Trữ Tại Milestone W0

Kiểm tra trực tiếp file định nghĩa kiểu dữ liệu [`src/types/index.ts`](file:///home/Williams/Projects/StudySpace/src/types/index.ts) và data layer [`src/data/appData.ts`](file:///home/Williams/Projects/StudySpace/src/data/appData.ts):

* **Cấu trúc `AppData` hiện tại:**
  ```typescript
  export interface AppData {
    courses: Course[]
    schedules: Schedule[]
    assignments: Assignment[]
    gpaEntries: GpaEntry[]
  }
  ```
* **Hạn chế đã xác định trong code hiện tại:**
  1. **Thiếu trường phiên bản (`version`):** Dữ liệu lưu trong `localStorage` với key `deadline-tracker:data` không có trường version để nhận biết định dạng dữ liệu được lưu tại thời điểm nào.
  2. **Kiểm tra lỏng lẻo (`isAppData`):** Hàm `isAppData` chỉ kiểm tra `Array.isArray(data.courses) && Array.isArray(data.schedules)`. Nếu mảng chứa phần tử `null` hoặc thiếu các trường bắt buộc, ứng dụng vẫn nạp và dẫn tới crash khi render.
  3. **Quan hệ khóa ngoại (`courseId`) lỏng lẻo:** Khi một môn học bị xóa trong `Course`, các bản ghi liên quan trong `Schedule`, `Assignment`, `GpaEntry` có thể trở thành mồ côi (orphaned data) nếu không có cơ chế dọn dẹp hoặc kiểm tra tính toàn vẹn khi import.
  4. **Lỗi ghi storage không được bắt (`saveAppData`):** Thao tác gọi `localStorage.setItem` chưa có cơ chế bắt ngoại lệ `QuotaExceededError` hoặc khi trình duyệt ở chế độ private/chặn storage.

---

## 2. Thiết Kế Schema Mở Rộng & Chiến Lược Phiên Bản Hóa (Versioning Strategy)

Để phục vụ các tính năng mới của Milestone W2 (Export/Import), W3 (Priority & Tags), W4 (Schedule Conflicts & GPA Scenarios):

### 2.1. Định dạng Schema Mới Đề Xuất (Version 2.0)
```typescript
export interface AppDataV2 {
  schemaVersion: number // = 2
  exportedAt?: string
  courses: Course[]
  schedules: Schedule[]
  assignments: AssignmentV2[]
  gpaEntries: GpaEntry[]
}

export interface AssignmentV2 extends Assignment {
  priority: 'low' | 'medium' | 'high' // Mặc định 'medium' khi di trú từ V1
  tags: string[]                     // Mặc định [] khi di trú từ V1
}
```

### 2.2. Lộ trình Migration tự động khi nạp dữ liệu (Auto-migration on Load / Import)
* **Xác định phiên bản cũ (Legacy / Version 1):** Nếu đối tượng không có `schemaVersion` nhưng chứa các mảng hợp lệ, hệ thống tự động gán `schemaVersion = 1` và kích hoạt luồng di trú.
* **Quy tắc di trú lên Version 2:**
  * Duyệt từng phần tử trong `assignments`: nếu trường `priority` chưa có hoặc không hợp lệ, gán giá trị mặc định là `'medium'`.
  * Nếu trường `tags` chưa tồn tại hoặc không phải là mảng chuỗi, gán giá trị mặc định `[]`.
  * Lọc bỏ mọi phần tử `null`, `undefined` hoặc thiếu thuộc tính khóa chính `id`.
  * Kiểm tra tính toàn vẹn khóa ngoại: Bỏ qua hoặc cảnh báo các `schedules`, `assignments`, `gpaEntries` có `courseId` không khớp với bất kỳ môn học nào có trong danh mục `courses`.

---

## 3. Checklist Kiểm Tra & Phòng Tránh Rủi Ro Mất Dữ Liệu

| Hạng mục kiểm tra | Tiêu chuẩn bắt buộc | Phương án xử lý khi vi phạm |
|---|---|---|
| **Trường bắt buộc Course** | `id`, `name`, `credits`, `color` | Bỏ qua phần tử lỗi hoặc từ chối gói import; thông báo dòng lỗi cụ thể. |
| **Trường bắt buộc Schedule** | `id`, `courseId`, `dayOfWeek` (1-7), `startTime`, `endTime` | Kiểm tra định dạng giờ `HH:MM`; nếu `startTime >= endTime` thì loại bỏ bản ghi lỗi. |
| **Trường bắt buộc Assignment** | `id`, `courseId`, `title`, `dueDate`, `status` | `status` phải thuộc `['todo', 'in-progress', 'done']`. Nếu sai, fallback về `'todo'`. |
| **Trường bắt buộc GPA** | `id`, `courseId`, `expectedGrade` (0–10), `credits` | Tự động giới hạn trong khoảng 0.0 - 10.0; ngăn trùng môn học trong danh sách điểm. |
| **Khóa ngoại mồ côi (Orphaned FK)** | `courseId` phải tồn tại trong bảng `courses` | Không cho phép import bài tập hoặc lịch của môn học không tồn tại. |
| **Dự phòng ghi đè (Safety Fallback)** | Nhập file đè lên toàn bộ dữ liệu hiện hành | Tạo bản snapshot dữ liệu cũ trong bộ nhớ tạm trước khi ghi đè; nếu `saveAppData` ném lỗi, khôi phục lại snapshot cũ và báo lỗi cho người dùng. |
| **Xử lý giới hạn dung lượng (Quota Handling)** | Bắt try/catch tại `saveAppData` | Trả về kết quả `{ success: false, error: 'QUOTA_EXCEEDED' }` để UI hiển thị modal cảnh báo người dùng giải phóng bộ nhớ. |

---

## 4. Kết Luận & Quyết Định Của Nhóm

1. **Chấp thuận kiến trúc Schema:** Thiết kế schema có trường `schemaVersion` và cơ chế fallback đảm bảo an toàn 100% dữ liệu người dùng khi thực hiện export/import tại Milestone W2.
2. **Quy định đối với Module Export/Import (Thế phụ trách):**
   * Tệp xuất JSON bắt buộc phải đính kèm `schemaVersion: 1` (hoặc `2`), `appName: "StudySpace"`, và nhãn thời gian `exportedAt`.
   * Tệp CSV xuất dữ liệu môn học và bài tập phải mã hóa UTF-8 có BOM để tránh lỗi font chữ tiếng Việt trên Microsoft Excel.
3. **Phê duyệt chuyển tiếp:** Nhiệm vụ review đạt tiêu chuẩn và sẵn sàng làm nền tảng cho việc cài đặt tính năng sao lưu/khôi phục dữ liệu ở Milestone W2.
