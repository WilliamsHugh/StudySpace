# StudySpace — Các task chưa hoàn thành

**Cập nhật:** 20/09/2026 (ICT)  
**Repo:** `main`  
**Phạm vi:** các thẻ công việc/harvest còn mở cùng bug mới phát hiện. Task kiểm thử và review được quản lý trực tiếp trên các cột Testing/Review của Trello.

## Task đang mở

| Hạn (ICT) | Task / Owner | Cột | Nhánh gợi ý | Ghi chú |
|---|---|---|---|---|
| 21/09 16:00 | [Day 6 — Filter and sorting features](https://trello.com/c/wo1EcOtp/22-day-6-1330-1600-filter-and-sorting-features) — Thế | To Do | `test/assignment-filter-verification` | Code đã có lọc môn/trạng thái và sort deadline; cần xác minh acceptance, chạy test tương tác rồi cập nhật Trello. Task test chi tiết nằm ở Testing. |
| 21/09 18:00 | [Day 6 — UI polish and responsive check](https://trello.com/c/BzNy41GY/23-day-6-1600-1800-ui-polish-and-responsive-check) — Thuận + Trường | To Do | `review/responsive-ui` | Kiểm tra desktop/tablet/mobile; ghi nhận kết quả và bug. Review chi tiết nằm ở Review. |
| 22/09 11:30 | [Day 7 — Full system testing](https://trello.com/c/Vydz0QWz/25-day-7-0800-1130-full-system-testing) — Trường | Testing | `test/full-system-regression` | Đã chuyển từ To Do sang Testing và bổ sung tiêu chí; vẫn chưa hoàn thành. |
| 22/09 15:30 | [Day 7 — Fix critical bugs and final cleanup](https://trello.com/c/qkwMh1wS/26-day-7-1330-1530-fix-critical-bugs-and-final-cleanup) — Thuận + Thế | To Do | `fix/critical-bugs` | Ưu tiên bug tái hiện được, gồm lỗi GPA bên dưới. |
| 22/09 17:30 | [Day 7 — Demo script and project report](https://trello.com/c/CG1Pt9KA/27-day-7-1530-1730-prepare-demo-script-and-project-report) — Thuận + Trường | To Do | `docs/demo-report` | Kịch bản demo 3–5 phút, ảnh Trello, phân công, timeline và bài học daily harvest. |
| 21/09 22:00 | [Daily Harvest — Day 6](https://trello.com/c/hBI5lF6g/24-daily-harvest-day-6-dashboard-and-polish-review) | Daily Harvest | `docs/daily-harvest-day6` | Chưa hoàn tất harvest cuối ngày. |
| 22/09 22:00 | [Daily Harvest — Day 7](https://trello.com/c/ZVU51FLr/28-daily-harvest-day-7-final-review-and-submission-readiness) | Daily Harvest | `docs/final-submission-readiness` | Chưa hoàn tất review cuối và sẵn sàng nộp. |

## Bug đang mở

### GPA có thể tính trùng tín chỉ cho cùng một môn

- **Trello:** [Bug — GPA double-counts repeated entries](https://trello.com/c/IvfLNl6v/35-bug-gpa-double-counts-repeated-entries-for-one-course)
- **Owner gợi ý:** Thế
- **Nhánh:** `fix/gpa-duplicate-course`
- **Tái hiện:** thêm điểm dự kiến cho một môn, rồi thêm lần nữa cùng môn với điểm khác. Cả hai entry cùng cộng tín chỉ vào GPA.
- **Kỳ vọng:** mỗi môn chỉ có một entry hiệu lực; lần nhập sau cập nhật entry cũ hoặc báo lỗi rõ ràng.
- **Hoàn tất khi:** không thể đếm trùng tín chỉ; sửa điểm vẫn hoạt động; regression test ở nhánh `test/gpa-duplicate-course` pass.

## Ghi chú kiểm tra

Day 3 cards đều đang Done; test task follow-up và review evidence đã được tạo trên Trello. `npm test`: 22 pass; production build: pass. Chưa sửa code trong lần rà soát này.
