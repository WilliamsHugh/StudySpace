# Final submission checklist

## Code và quality gate

- [x] Dependency lockfile tồn tại.
- [x] Toàn bộ feature dùng shared domain types và `StudySpaceContext`.
- [x] Assignment filter/sort có unit và interaction test.
- [x] GPA duplicate-course có domain, UI và storage regression test.
- [x] Full workflow có integration test.
- [x] Schedule CRUD và cascade cleanup có regression test.
- [x] Responsive navigation và modal focus có test.
- [x] `npm test` pass: 13 file, 26 test.
- [x] `npm run typecheck` pass.
- [x] `npm run build` pass.

## Tài liệu trong repository

- [x] README đúng dự án StudySpace.
- [x] Project report.
- [x] Responsive/full regression report.
- [x] Daily Harvest Day 6.
- [x] Daily Harvest Day 7.
- [ ] Demo script — không commit/push theo yêu cầu chủ dự án.

## Review thủ công

- [x] Kiểm tra breakpoint CSS và hành vi menu/modal bằng automated DOM tests.
- [ ] Pixel-level review trên current build nếu cần ảnh mới.
- [ ] Kiểm tra nội dung project report bởi các thành viên được ghi owner.
- [ ] Cập nhật Trello/evidence bởi người có quyền board.

## Merge và nộp bài

- [ ] Review và merge PR #14.
- [ ] Review và merge PR #15 theo đúng stack.
- [ ] Review và merge PR tài liệu.
- [ ] Đồng bộ `main` mới nhất.
- [ ] Chạy lại test, typecheck và build trên `main` sau merge.
- [ ] Xác nhận repository không còn file nhầm dự án hoặc secret.
- [ ] Gắn link repository/commit cuối vào nơi nộp bài.

## Điều kiện được xem là hoàn tất

Repository sẵn sàng nộp khi tất cả quality gate vẫn pass trên `main`, ba PR đã được xử lý đúng thứ tự, Trello được cập nhật và các mục review thủ công bắt buộc của giảng viên/nhóm đã được xác nhận.
