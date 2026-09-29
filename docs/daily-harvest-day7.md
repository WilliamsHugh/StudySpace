# Daily Harvest — Day 7

**Chủ đề:** Full regression, critical cleanup và submission readiness

## Mục tiêu

- Khôi phục baseline build/test được sau merge.
- Chạy full-system regression cho các luồng chính.
- Xử lý lỗi GPA duplicate-course và các regression có thể tái hiện.
- Hoàn thiện tài liệu kỹ thuật và checklist nộp bài.

## Kết quả

- Chuẩn hóa toàn bộ feature về `StudySpaceContext` và shared domain types.
- Khôi phục lockfile và test environment có jsdom/DOM matchers.
- Xác minh GPA chỉ giữ một điểm hiệu lực cho mỗi môn.
- Xác minh dữ liệu GPA trùng trong local storage được chuẩn hóa.
- Full workflow Course → Schedule → Assignment → GPA → Dashboard pass.
- Schedule CRUD và cascade cleanup khi xóa môn pass.
- 13 test files với 26 tests pass; typecheck và production build pass.
- README sai dự án được thay bằng tài liệu StudySpace.

## Bằng chứng

- PR #14: core stability.
- PR #15: responsive và final regression.
- `docs/final-regression-report.md`.
- `docs/project-report.md`.

## Rủi ro còn lại

- PR đang theo mô hình stacked nên phải merge đúng thứ tự.
- Trạng thái Trello cần được owner cập nhật theo quyền truy cập board.
- Pixel-level visual sign-off trên trình duyệt thật chưa được chạy lại trong phiên workspace-only.
- Kịch bản demo không nằm trong nhánh nộp theo yêu cầu của chủ dự án.

## Bài học trong ngày

- Full regression cần kiểm tra persistence và quan hệ dữ liệu, không chỉ render từng trang.
- Không nên đánh dấu Done nếu evidence phụ thuộc môi trường chưa được chạy.
- README và tài liệu nộp bài là một phần của chất lượng sản phẩm.

## Trạng thái readiness

Code, test, typecheck và build đã sẵn sàng. Hồ sơ nộp bài hoàn tất sau khi checklist cuối được xác nhận, các stacked PR được merge đúng thứ tự và Trello được cập nhật bởi người có quyền.
