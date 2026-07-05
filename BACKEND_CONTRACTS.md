# AIN Backend Contracts

This document defines the API concepts needed to connect the current frontend to a real backend.

## Users, Roles, Permissions, Tenant Mapping

`users`

- `id`
- `name`
- `email`
- `password_hash`
- `role`: `super-admin | tenant-admin | end-user`
- `tenant_id`: nullable for super admin
- `status`: `active | pending | disabled | blocked`
- `permissions`: string array or normalized relation table
- `last_login_at`

Roles:

- `super-admin`: platform management, tenants, billing, pricing, reports.
- `tenant-admin`: company workspace, rooms, members, files, security, analytics.
- `end-user`: assigned rooms and protected file viewer only.

## Invite Acceptance & First Password

1. Tenant admin creates invite with `email`, `roomIds`, `expiresAt`.
2. Backend creates `invite_token`.
3. User opens `/accept-invite?token=...`.
4. User sets password.
5. Backend activates user and maps tenant/rooms.

Required states:

- `pending`
- `accepted`
- `expired`
- `revoked`

## Secure File Viewer API

Frontend needs:

- Signed stream URL.
- File metadata.
- Watermark payload: user name, email, phone/id, timestamp.
- Blocked actions policy: download, print, copy, screen recording hints.
- Audit event endpoint for every open/view attempt.

Suggested endpoints:

- `POST /files/:id/view-session`
- `POST /files/:id/audit`
- `GET /rooms/:id/files`

## Notification / Action Inbox API

Notifications should be actionable items, not plain text only.

Fields:

- `id`
- `type`: `security | billing | content | system`
- `priority`: `low | medium | high | critical`
- `title`
- `body`
- `targetType`: `tenant | room | file | member | subscription`
- `targetId`
- `status`: `unread | needs_action | resolved`
- `createdAt`
- `owner`

Suggested endpoints:

- `GET /notifications`
- `POST /notifications/:id/resolve`
- `POST /notifications/mark-all-read`

## Audit Logs

Every sensitive action should create an audit event:

- file viewed
- download blocked
- new device login
- permission changed
- member invited
- subscription changed

Suggested endpoint:

- `GET /audit-logs?tenantId=...`
