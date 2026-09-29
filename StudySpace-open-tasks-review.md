# StudySpace — Trạng thái task sau final regression

**Cập nhật:** 30/09/2026 (ICT)
**Mô hình PR:** stacked

## Trạng thái thực hiện

| Task | Trạng thái code/tài liệu | Bằng chứng | Việc còn lại ngoài repo |
|---|---|---|---|
| Day 6 — Filter and sorting features | Hoàn thành | `test(assignments): verify filters and deadline ordering`, PR #14 | Cập nhật thẻ Trello |
| Day 6 — UI polish and responsive check | Hoàn thành phần code/automated behavior | `fix(ui)`, `test(ui)`, PR #15 | Pixel-level browser sign-off nếu cần ảnh mới; cập nhật Trello |
| Day 7 — Full system testing | Hoàn thành | 13 test files, 26 tests pass; PR #15 | Cập nhật Trello |
| Day 7 — Fix critical bugs and final cleanup | Hoàn thành trong phạm vi lỗi tái hiện | Baseline integration, GPA regression, UI regression, README cleanup | Cập nhật Trello |
| Day 7 — Project report | Hoàn thành | `docs/project-report.md` | Review nội dung nhóm |
| Day 7 — Demo script | Không đưa vào nhánh theo yêu cầu chủ dự án | Không có file/commit | Chuẩn bị riêng nếu vẫn cần nộp |
| Daily Harvest — Day 6 | Hoàn thành | `docs/daily-harvest-day6.md` | Cập nhật Trello |
| Daily Harvest — Day 7 | Hoàn thành | `docs/daily-harvest-day7.md` | Cập nhật Trello |

## Bug GPA duplicate-course

Đã xác minh ở ba lớp:

- Domain upsert chỉ giữ một entry hiệu lực cho mỗi `courseId`.
- UI cập nhật điểm cùng môn mà không tăng số entry.
- Storage chuẩn hóa dữ liệu cũ có nhiều entry cùng môn.

## Quality gate gần nhất

- `npm test`: 13 file, 26 test pass.
- `npm run typecheck`: pass.
- `npm run build`: pass.

## Thứ tự PR

1. PR #14 — `fix/core-stability` → `main`.
2. PR #15 — `test/final-regression` → `fix/core-stability`; sau PR #14 cần retarget/merge theo workflow của repository.
3. `docs/final-submission` → `test/final-regression`.

## Task còn mở thực sự

- Kịch bản demo, nếu vẫn là artifact bắt buộc; file này không được commit/push theo yêu cầu hiện tại.
- Pixel-level visual sign-off trên current build nếu cần ảnh responsive mới.
- Cập nhật trạng thái/card/evidence trên Trello bởi người có quyền board.
- Merge stacked PR đúng thứ tự và chạy lại quality gate trên `main` sau merge.
