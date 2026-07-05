# AIN UX & Product Quality Tasks

This file tracks the professional UX pass for All In One (AIN). Mark items as done only after implementation and build verification.

## Phase 1 - Authentication & Role Routing

- [x] Create a shared UX/product task list.
- [x] Remove manual role selection from the login screen.
- [x] Route users automatically by email/account role.
- [x] Add mock email accounts until the backend auth API is ready.
- [x] Document the backend `/auth/login` response contract.

## Phase 2 - Visual Polish & Cards

- [x] Standardize dashboard card spacing, hover states, headers, and actions.
- [x] Improve room/file/member/tenant cards with clear metadata and status.
- [x] Add consistent empty states for rooms, files, members, and notifications.
- [x] Improve action inbox cards with priority, owner, and direct actions.

## Phase 3 - Product UX Features

- [x] Add onboarding checklist for tenant admins.
- [x] Improve global search command results with grouped actions.
- [x] Improve detail drawers with activity, permissions, and primary actions.
- [x] Add audit log preview for security and file access.
- [x] Add invitation flow screens and states.

## Phase 4 - Backend Readiness

- [x] Define users, roles, permissions, and tenant mapping.
- [x] Define invite acceptance and first-password flow.
- [x] Define secure file viewer API needs.
- [x] Define notification/action inbox API needs.

## Phase 5 - QA

- [x] Build verification.
- [x] Smoke test login role routing.
- [x] Smoke test core dashboards.
- [x] Prepare clean upload ZIP.

## Phase 6 - Stitch Web UX Pass

- [x] Keep the existing landing page unchanged.
- [x] Skip mobile application screens and focus on responsive web only.
- [x] Replace the old app shell with a right-side RTL Stitch-style shell.
- [x] Rebuild Tenant Admin dashboard, rooms, content library, members, notifications, security, and subscription views from the Stitch screen structure.
- [x] Rebuild End User dashboard, protected file viewer, meetings, notifications, and settings flow from the Stitch screen structure.
- [x] Rebuild Super Admin screens from the Stitch shell/table/card structure.
- [x] Replace the remaining generic auth screens with clean Stitch-style auth screens.
- [x] Fix broken Arabic/English language copy.
- [x] Fix account placement in the top bar.
- [x] Make dark mode a true black interface.
- [x] Clean broken mock data text and make it backend-ready.
- [x] Build and smoke test production server routes.
