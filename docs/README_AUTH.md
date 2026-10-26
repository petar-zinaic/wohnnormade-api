# Authentication Routes

This API provides authentication functionality with the following endpoints:

## Setup

1. **Environment Variables**: Create an environment file with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="<long random string>"
   CLIENT_URL="http://localhost:3000"
   ```

   `JWT_SECRET` is required: the app refuses to start without it. Generate one with
   `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
   `CLIENT_URL` is used for the links in emails (reset password, message threads).

2. **Database Migration**: Run Prisma migrations to create the User table:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

## API Endpoints

All authentication routes are prefixed with `/api/auth`

### 1. Register

**POST** `/api/auth/register`

Register a new user account.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

**POST** `/api/auth/login`

Login with existing credentials.

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Change Password (Protected)

**PUT** `/api/auth/change-password`

Change the current user's password. Requires authentication.

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**

```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

**Response:**

```json
{
  "message": "Password changed successfully"
}
```

### 4. Forgot Password

**POST** `/api/auth/forgot-password`

Start the password reset process. If the email belongs to an account, the API:

- deletes any earlier unused reset tokens for that user
- creates a random token, valid for **60 minutes** and usable **once**; only its SHA-256 hash is stored
- emails a link to `<CLIENT_URL>/reset-password?token=<token>`

The response is the same whether or not the email exists, so it can't be used to discover accounts.

**Request Body:**

```json
{
  "email": "user@example.com"
}
```

**Response:**

```json
{
  "message": "If an account with this email exists, a password reset link has been sent"
}
```

### 5. Reset Password

**POST** `/api/auth/reset-password`

Set a new password using the token from the reset email. The client's `/reset-password` page reads `token` from the URL and sends it here.

**Request Body:**

```json
{
  "token": "<64-character token from the email link>",
  "newPassword": "newPassword123"
}
```

Returns `400` (`invalid_reset_token`) if the token is unknown, expired or already used.

**Response:**

```json
{
  "message": "Password reset successfully"
}
```

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "result": {},
  "status": false,
  "error": {
    "status": 401,
    "message": "Invalid email or password.",
    "internal_code": "invalid_credentials"
  }
}
```

Error codes used by the auth and user endpoints:

| HTTP | `internal_code` | When |
| ---- | --------------- | ---- |
| 400 | `request_body_validation` | Invalid input data or unknown fields |
| 400 | `invalid_reset_token` | Reset token unknown, expired or already used |
| 401 | `missing_token` | Missing or invalid JWT |
| 401 | `invalid_credentials` | Wrong email/password, or wrong current password |
| 403 | `forbidden` | Changing another user's account |
| 404 | `not_found` | User doesn't exist |
| 409 | `email_already_exists` | Email already registered |
| 500 | `internal_error` | Unexpected error (details are only logged on the server) |

## Authentication Middleware

The `authenticateToken` middleware is available for protecting routes:

```typescript
import { authenticateToken } from "@middlewares";

router.get("/protected-route", authenticateToken, controller.method);
```

This middleware:

- Extracts JWT token from `Authorization: Bearer <token>` header
- Verifies the token using the JWT_SECRET
- Adds `userId` to the request object
- Throws `MissingTokenException` for missing/invalid tokens

## Password Security

- Passwords are hashed using bcryptjs with a salt rounds of 10
- Minimum password length: 6 characters
- Maximum password length: 50 characters

## JWT Token

- Tokens expire after 24 hours
- Contains `userId` in the payload
- Uses the `JWT_SECRET` environment variable for signing
