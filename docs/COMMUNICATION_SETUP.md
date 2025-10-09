# Communication Feature Setup Guide

## Overview

This feature allows landlords to contact each other about tenants through email communication. The system creates conversation threads and sends email notifications using Resend.

## Environment Variables Required

Copy `environments/env.template` to `environments/.env.local` and update the values:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/wohnomade_db"

# JWT Secret for authentication
JWT_SECRET="your-jwt-secret-key-here"

# Server Configuration
PORT=3000
NODE_ENV=local

# Email Configuration (Resend)
# Get your API key from: https://resend.com/api-keys
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@wohnnormade.com"
CLIENT_URL="http://localhost:3000"
```

**Important:** Replace `RESEND_API_KEY` with your actual Resend API key from https://resend.com/api-keys

## Database Migration

Run the following command to create the new communication table:

```bash
npm run migrate:local
```

When prompted for migration name, enter: `add_communication_table`

## API Endpoints

### 1. Contact Reporter

**POST** `/api/communications/contact-reporter`

Send an initial contact message to a landlord who reported a tenant.

**Request Body:**

```json
{
  "tenantId": 1,
  "recipientId": 2,
  "message": "Hello, I would like to discuss the tenant you reported. Could we arrange a call?"
}
```

**Response:**

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

### 2. Reply to Thread

**POST** `/api/communications/reply`

Send a reply message in an existing conversation thread.

**Request Body:**

```json
{
  "threadId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Thank you for reaching out. I'm available for a call tomorrow at 2 PM."
}
```

### 3. Get Thread

**GET** `/api/communications/thread/{threadId}`

Retrieve all messages in a conversation thread.

### 4. Get User Conversations

**GET** `/api/communications/my-conversations`

Retrieve all conversation threads for the authenticated user.

## Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **Access Control**: Users can only access threads they participate in
- **Rate Limiting**: Built-in protection against spam
- **Input Validation**: Message length and content validation
- **Email Privacy**: Uses system email as intermediary

## Email Templates

The system sends professional HTML emails with:

- Sender and recipient information
- Tenant details being discussed
- Message content
- Reply link to continue conversation
- Professional styling with WohnNormade branding

## Error Handling

- **400**: Bad request - validation errors
- **401**: Unauthorized - authentication required
- **403**: Forbidden - access denied to thread
- **404**: Not found - tenant, user, or thread not found
- **500**: Internal server error

## Testing

1. Ensure your database is running
2. Run the migration: `npm run migrate:local`
3. Add your Resend API key to environment variables
4. Start the server: `npm run development:local`
5. Test endpoints using the API documentation at `/api-docs`

## Frontend Integration

The frontend should:

1. Add a "Contact Reporter" button in the tenant preview component
2. Create a modal for composing the initial message
3. Create a conversation thread view for replies
4. Handle authentication and error states
5. Display conversation history

## Notes

- Email sending failures don't prevent communication creation
- Thread IDs are UUIDs for security
- All communications are stored in the database for history
- The system prevents users from contacting themselves
