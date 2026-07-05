# AIOFRONT React

React implementation for the AIOFRONT prototype, prepared for backend integration.

## Run locally

```bash
npm install
npm run dev
```

## Production

```bash
npm install
npm run build
npm start
```

The current data source is mocked in `src/data/mockData.js`. Replace the functions in `src/services/api.js` with backend endpoints when APIs are ready.

## Backend integration

Copy `.env.example` to `.env` and set:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_USE_MOCK_API=false
```

Main integration files:

- `src/services/httpClient.js`: base URL, token headers, and request errors.
- `src/services/authService.js`: `/auth/login` and local session handling.
- `src/services/api.js`: rooms, files, members, tenants, analytics, and subscription endpoints.

### Auth routing contract

The login screen no longer lets users choose their role manually. The backend should identify the user by email and return the correct role.

`POST /auth/login`

```json
{
  "email": "admin@techcorp.test",
  "password": "********"
}
```

Expected response:

```json
{
  "token": "jwt_or_session_token",
  "user": {
    "id": "user_123",
    "name": "Ahmed Mostafa",
    "email": "admin@techcorp.test",
    "role": "tenant-admin",
    "roleLabel": "Tenant Admin",
    "tenantId": "tenant_techcorp",
    "company": "TechCorp Egypt",
    "permissions": ["manage_rooms", "manage_members", "upload_files"]
  }
}
```

Frontend redirects by `user.role`:

- `super-admin` -> `/super-admin/dashboard`
- `tenant-admin` -> `/tenant-admin/dashboard`
- `end-user` -> `/end-user/home`

Mock accounts while backend auth is not connected:

- `super@ain.test`
- `admin@techcorp.test`
- `employee@techcorp.test`
- password: `12345678`

Production routes:

- `/login`
- `/end-user/home`
- `/end-user/files`
- `/tenant-admin/dashboard`
- `/tenant-admin/rooms`
- `/tenant-admin/files`
- `/tenant-admin/members`
- `/super-admin/dashboard`
- `/super-admin/tenants`
- `/super-admin/subscriptions`
