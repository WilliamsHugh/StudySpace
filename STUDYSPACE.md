# StudySpace — Day 1 & Day 2

Core foundation cho MVP quản lý học tập cá nhân, xây dựng bằng React, Vite và TypeScript.

## Chức năng đã hoàn thiện

- Model dữ liệu cho môn học, lịch học, bài tập/deadline, điểm dự kiến và cài đặt.
- State tập trung qua React Context + reducer, tự động lưu vào `localStorage`.
- Layout responsive gồm sidebar, header và Dashboard tổng quan.
- CRUD môn học với validation tên, tín chỉ và màu nhận diện.
- Logic nền tính GPA có trọng số, không cộng trùng tín chỉ cho cùng một môn.
- Test cơ bản cho validation, local storage và GPA.

## Chạy dự án

```bash
npm install
npm run dev
npm test
npm run build
```
