# Authentication Routes

This API provides authentication functionality with the following endpoints:

## Setup

1. **Environment Variables**: Create an environment file with the following variables:

   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   JWT_SECRET="your-super-secret-jwt-key-here"
   ```

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

Initiate password reset process.

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

Reset password using reset token (currently simplified implementation).

**Request Body:**

```json
{
  "email": "user@example.com",
  "newPassword": "newPassword123",
  "resetToken": "optional-reset-token"
}
```

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
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:

- `VALIDATION_ERROR`: Invalid input data
- `AUTHENTICATION_ERROR`: Invalid credentials
- `AUTHORIZATION_ERROR`: Missing or invalid token
- `USER_EXISTS`: Email already registered
- `USER_NOT_FOUND`: User doesn't exist

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
