# Communication API Documentation

## Overview

The Communication API allows landlords to contact each other about specific tenants through a secure messaging system with email notifications.

## Base URL

```
/api/communications
```

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Contact Reporter

Send an initial contact message to a landlord who reported a tenant.

**Endpoint:** `POST /api/communications/contact-reporter`

**Request Body:**

```json
{
  "tenantId": 1,
  "recipientId": 2,
  "message": "Hello, I would like to discuss the tenant you reported. Could we arrange a call?"
}
```

**Validation Rules:**

- `tenantId`: Required, positive integer
- `recipientId`: Required, positive integer, must be different from sender
- `message`: Required, 20-2000 characters

**Response (200 OK):**

```json
{
  "success": true,
  "result": {
    "threadId": "123e4567-e89b-12d3-a456-426614174000",
    "message": {
      "id": 1,
      "threadId": "123e4567-e89b-12d3-a456-426614174000",
      "senderId": 1,
      "recipientId": 2,
      "tenantId": 1,
      "subject": "Contact Request Regarding Tenant",
      "message": "Hello, I would like to discuss the tenant you reported...",
      "isInitialMessage": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "sender": {
        "id": 1,
        "name": "John",
        "surname": "Doe",
        "email": "john@example.com"
      },
      "recipient": {
        "id": 2,
        "name": "Jane",
        "surname": "Smith",
        "email": "jane@example.com"
      },
      "tenant": {
        "id": 1,
        "name": "Bob",
        "surname": "Johnson"
      }
    }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `404 Not Found`: Tenant or recipient not found
- `500 Internal Server Error`: Server error

---

### 2. Reply to Thread

Send a reply message in an existing conversation thread.

**Endpoint:** `POST /api/communications/reply`

**Request Body:**

```json
{
  "threadId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Thank you for reaching out. I'm available for a call tomorrow at 2 PM."
}
```

**Validation Rules:**

- `threadId`: Required, valid UUID string
- `message`: Required, 20-2000 characters

**Response (200 OK):**

```json
{
  "success": true,
  "result": {
    "id": 2,
    "threadId": "123e4567-e89b-12d3-a456-426614174000",
    "senderId": 2,
    "recipientId": 1,
    "tenantId": 1,
    "subject": "Re: Contact Request Regarding Tenant",
    "message": "Thank you for reaching out. I'm available for a call tomorrow at 2 PM.",
    "isInitialMessage": false,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z",
    "sender": {
      "id": 2,
      "name": "Jane",
      "surname": "Smith",
      "email": "jane@example.com"
    },
    "recipient": {
      "id": 1,
      "name": "John",
      "surname": "Doe",
      "email": "john@example.com"
    },
    "tenant": {
      "id": 1,
      "name": "Bob",
      "surname": "Johnson"
    }
  }
}
```

**Error Responses:**

- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied to thread
- `404 Not Found`: Thread not found
- `500 Internal Server Error`: Server error

---

### 3. Get Thread

Retrieve all messages in a conversation thread.

**Endpoint:** `GET /api/communications/thread/{threadId}`

**Parameters:**

- `threadId` (path): UUID of the conversation thread

**Response (200 OK):**

```json
{
  "success": true,
  "result": {
    "threadId": "123e4567-e89b-12d3-a456-426614174000",
    "tenant": {
      "id": 1,
      "name": "Bob",
      "surname": "Johnson"
    },
    "communications": [
      {
        "id": 1,
        "threadId": "123e4567-e89b-12d3-a456-426614174000",
        "senderId": 1,
        "recipientId": 2,
        "tenantId": 1,
        "subject": "Contact Request Regarding Tenant",
        "message": "Hello, I would like to discuss the tenant you reported...",
        "isInitialMessage": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "sender": {
          "id": 1,
          "name": "John",
          "surname": "Doe",
          "email": "john@example.com"
        },
        "recipient": {
          "id": 2,
          "name": "Jane",
          "surname": "Smith",
          "email": "jane@example.com"
        },
        "tenant": {
          "id": 1,
          "name": "Bob",
          "surname": "Johnson"
        }
      },
      {
        "id": 2,
        "threadId": "123e4567-e89b-12d3-a456-426614174000",
        "senderId": 2,
        "recipientId": 1,
        "tenantId": 1,
        "subject": "Re: Contact Request Regarding Tenant",
        "message": "Thank you for reaching out. I'm available for a call tomorrow at 2 PM.",
        "isInitialMessage": false,
        "createdAt": "2024-01-15T11:00:00Z",
        "updatedAt": "2024-01-15T11:00:00Z",
        "sender": {
          "id": 2,
          "name": "Jane",
          "surname": "Smith",
          "email": "jane@example.com"
        },
        "recipient": {
          "id": 1,
          "name": "John",
          "surname": "Doe",
          "email": "john@example.com"
        },
        "tenant": {
          "id": 1,
          "name": "Bob",
          "surname": "Johnson"
        }
      }
    ]
  }
}
```

**Error Responses:**

- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied to thread
- `404 Not Found`: Thread not found
- `500 Internal Server Error`: Server error

---

### 4. Get User Conversations

Retrieve all conversation threads for the authenticated user.

**Endpoint:** `GET /api/communications/my-conversations`

**Response (200 OK):**

```json
{
  "success": true,
  "result": [
    {
      "threadId": "123e4567-e89b-12d3-a456-426614174000",
      "tenant": {
        "id": 1,
        "name": "Bob",
        "surname": "Johnson"
      },
      "communications": [
        // Array of communication objects (same structure as above)
      ]
    }
  ]
}
```

**Error Responses:**

- `401 Unauthorized`: Authentication required
- `500 Internal Server Error`: Server error

## Data Models

### Communication Object

```typescript
interface Communication {
  id: number;
  threadId: string;
  senderId: number;
  recipientId: number;
  tenantId: number;
  subject?: string;
  message: string;
  isInitialMessage: boolean;
  createdAt: Date;
  updatedAt: Date;
  sender: UserInfo;
  recipient: UserInfo;
  tenant: TenantInfo;
}
```

### UserInfo Object

```typescript
interface UserInfo {
  id: number;
  name?: string;
  surname?: string;
  email: string;
}
```

### TenantInfo Object

```typescript
interface TenantInfo {
  id: number;
  name: string;
  surname: string;
}
```

## Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **Access Control**: Users can only access threads they participate in
- **Input Validation**: All inputs are validated and sanitized
- **Rate Limiting**: Built-in protection against spam
- **Email Privacy**: Uses system email as intermediary

## Email Notifications

When a new message is sent:

1. The message is stored in the database
2. An email notification is sent to the recipient
3. The email contains a link to continue the conversation
4. Email failures don't prevent message storage

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

Common error codes:

- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_REQUIRED`: JWT token missing or invalid
- `ACCESS_DENIED`: User doesn't have permission
- `NOT_FOUND`: Resource not found
- `INTERNAL_ERROR`: Server error
