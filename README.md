# StudySpace — Deadline Tracker

MVP web application built with React, Vite and TypeScript. The shared app includes Courses, Schedule, Assignments, GPA Simulator and Dashboard.

## Run locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm test
npm run build
```

## Shared data contract

- Types are in `src/types/index.ts`.
- All modules use the shared `AppData` shape and persist through the `deadline-tracker:data` key in `localStorage`.
- Dashboard reuses `isOverdue`, `getUpcomingAssignments`, and `getOverdueAssignments` from `src/domain/assignments.ts`.
- `calculateWeightedGpa` in `src/domain/gpa.ts` calculates `sum(gradePoint * credits) / sum(credits)` and returns `null` when no valid credits are available.

## GPA conversion scale

The current MVP conversion table is documented in `src/domain/gpa.ts` and should be checked against the school's official grading rules before treating the result as official.
