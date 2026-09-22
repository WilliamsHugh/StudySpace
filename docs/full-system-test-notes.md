# Ghi chú kiểm thử toàn hệ thống

**Ngày kiểm tra theo kế hoạch Trello:** 22/09/2026 08:00–11:30 (ICT)  
**Người thực hiện:** Trường Lê  
**Nhánh:** `test/full-system-regression`  
**Build kiểm tra:** StudySpace trên `main` sau PR #6 và #7

## Kết quả

| Luồng | Kết quả | Bằng chứng |
|---|---|---|
| Tạo môn học | Đạt | `src/features/courses/CoursesPage.test.tsx` |
| Sửa và xóa môn học | Đạt | `src/features/courses/CoursesPage.test.tsx` |
| Tạo thời khóa biểu | Đạt | `src/features/schedule/SchedulePage.test.tsx` |
| Sửa thời khóa biểu | Đạt | `src/features/schedule/SchedulePage.test.tsx` |
| Hủy và xác nhận xóa thời khóa biểu | Đạt | `src/features/schedule/SchedulePage.test.tsx` |
| Tạo, sửa và xóa bài tập | Đạt | `src/data/storage.test.ts`, `src/pages/AssignmentsPage.tsx` |
| Lọc, sắp xếp bài tập | Đạt | `src/pages/AssignmentsPage.test.tsx` |
| Đổi trạng thái và nhận diện quá hạn | Đạt | `src/domain/assignments.test.ts`, `src/pages/DashboardPage.test.tsx` |
| GPA và dữ liệu trùng môn | Đạt | `src/domain/gpa.test.ts`, `src/data/storage.test.ts` |
| Lưu dữ liệu sau khi tải lại | Đạt | `src/data/storage.test.ts` |
| Đóng popup bằng nút, nền ngoài, Escape | Đạt | `src/components/Modal.test.tsx` |

## Lệnh xác minh

```text
npm test -- --run
9 test files passed
30 tests passed

npm run build
production build passed
```

## Kết luận

Các luồng MVP chính chạy đạt trên build hiện tại. Các lỗi đã ghi trước đó gồm popup đóng và GPA đếm trùng môn đã có fix cùng regression test. Không phát hiện lỗi mới trong lần kiểm tra này.

## Giới hạn

Đây là biên bản kiểm thử dựa trên test tự động và build production trong repository. Các thay đổi phụ thuộc trình duyệt hoặc dữ liệu `localStorage` thực tế vẫn nên được kiểm tra lại khi demo trên thiết bị trình bày.
