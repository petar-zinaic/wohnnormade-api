# Communication Feature - Complete Client Implementation Guide

## 🎯 Overview

This guide provides everything needed to implement the landlord communication feature. The backend API is already implemented and ready to use.

## 📋 What's Already Done (Backend)

✅ **Database Schema**: `LandlordCommunication` table created  
✅ **API Endpoints**: 4 communication endpoints implemented  
✅ **Email Service**: Resend integration for email notifications  
✅ **Authentication**: JWT-based security  
✅ **Validation**: Input validation and error handling

## 🚀 Quick Setup

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Database (already configured)
DATABASE_URL="postgresql://username:password@localhost:5432/wohnomade_db"

# JWT Secret (already configured)
JWT_SECRET="your-jwt-secret-key-here"

# Server (already configured)
PORT=3000
NODE_ENV=local

# Email Configuration (NEW - REQUIRED)
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
FROM_EMAIL="noreply@wohnnormade.com"
CLIENT_URL="http://localhost:3000"
```

### 2. Resend Email Setup

1. **Sign up** at [Resend.com](https://resend.com)
2. **Get API Key** from [API Keys](https://resend.com/api-keys)
3. **Verify Domain** in [Domains](https://resend.com/domains)
4. **Update** `RESEND_API_KEY` and `FROM_EMAIL` in your `.env.local`

### 3. Start Server

```bash
npm run development:local
```

## 📡 API Endpoints

**Base URL**: `/api/communications`  
**Authentication**: All endpoints require `Authorization: Bearer <jwt-token>`

### 1. Contact Reporter

Send initial message to a landlord who reported a tenant.

**POST** `/api/communications/contact-reporter`

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
      "message": "Hello, I would like to discuss...",
      "isInitialMessage": true,
      "createdAt": "2024-01-15T10:30:00Z",
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

Send reply in existing conversation.

**POST** `/api/communications/reply`

```json
{
  "threadId": "123e4567-e89b-12d3-a456-426614174000",
  "message": "Thank you for reaching out. I'm available for a call tomorrow at 2 PM."
}
```

### 3. Get Thread

Retrieve all messages in a conversation.

**GET** `/api/communications/thread/{threadId}`

**Response:**

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
      // Array of communication objects
    ]
  }
}
```

### 4. Get User Conversations

Get all conversations for authenticated user.

**GET** `/api/communications/my-conversations`

**Response:**

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
        // Array of communication objects
      ]
    }
  ]
}
```

## 🎨 Frontend Implementation

### 1. Contact Reporter Button

Add to tenant preview component:

```typescript
// In TennantPreview component
const [isContactModalOpen, setIsContactModalOpen] = useState(false);

// Add button in reporter section
{
  reporter && (
    <button
      onClick={() => setIsContactModalOpen(true)}
      className="px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
    >
      Contact Reporter
    </button>
  );
}

// Add modal
{
  isContactModalOpen && (
    <ContactReporterModal
      tenant={tenant}
      reporter={reporter}
      onClose={() => setIsContactModalOpen(false)}
    />
  );
}
```

### 2. Contact Modal Component

```typescript
// ContactReporterModal.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ContactReporterModalProps {
  tenant: any;
  reporter: any;
  onClose: () => void;
}

export default function ContactReporterModal({
  tenant,
  reporter,
  onClose,
}: ContactReporterModalProps) {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/communications/contact-reporter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          tenantId: tenant.id,
          recipientId: reporter.id,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      setSuccess(true);

      // Redirect to conversation after 2 seconds
      setTimeout(() => {
        window.location.href = `/communications/thread/${data.result.threadId}`;
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error sending message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold mb-4">Contact Landlord</h2>

        {success ? (
          <div className="text-center py-8">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <p className="text-lg font-medium">Message sent successfully!</p>
            <p className="text-sm text-gray-500 mt-2">
              Redirecting to conversation...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>To:</strong> {reporter.name} {reporter.surname}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                <strong>Regarding:</strong> {tenant.name} {tenant.surname}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
                placeholder="Introduce yourself and explain why you're reaching out..."
                required
                minLength={20}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                disabled={isSubmitting || message.length < 20}
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
```

### 3. Conversation Thread Page

```typescript
// app/communications/thread/[threadId]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  const { user } = useAuth();
  const [thread, setThread] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchThread();
  }, [params.threadId]);

  const fetchThread = async () => {
    try {
      const response = await fetch(
        `/api/communications/thread/${params.threadId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();
      setThread(data.result);
    } catch (error) {
      console.error("Failed to fetch thread:", error);
    }
  };

  const sendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/communications/reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          threadId: params.threadId,
          message: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage("");
        fetchThread(); // Refresh thread
      }
    } catch (error) {
      console.error("Failed to send reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!thread) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Conversation about {thread.tenant.name} {thread.tenant.surname}
      </h1>

      <div className="space-y-4 mb-6">
        {thread.communications.map((comm: any) => (
          <div
            key={comm.id}
            className={`p-4 rounded-lg ${
              comm.senderId === user?.id ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8"
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <strong>
                  {comm.sender.name} {comm.sender.surname}
                </strong>
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(comm.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-gray-800">{comm.message}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendReply} className="flex gap-3">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your reply..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange focus:border-transparent"
          rows={3}
          required
          minLength={20}
        />
        <button
          type="submit"
          disabled={isSubmitting || newMessage.length < 20}
          className="px-6 py-2 bg-orange text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
```

### 4. Conversations List Page

```typescript
// app/communications/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ConversationsPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch("/api/communications/my-conversations", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setConversations(data.result);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Conversations</h1>

      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <div className="space-y-4">
          {conversations.map((conv: any) => {
            const lastMessage =
              conv.communications[conv.communications.length - 1];
            return (
              <Link
                key={conv.threadId}
                href={`/communications/thread/${conv.threadId}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">
                      About {conv.tenant.name} {conv.tenant.surname}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {lastMessage.message.substring(0, 100)}...
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(lastMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

## 🔒 Security Features

- **Authentication Required**: All endpoints require valid JWT token
- **Access Control**: Users can only access threads they participate in
- **Input Validation**: Message length (20-2000 characters)
- **Rate Limiting**: Built-in protection against spam
- **Email Privacy**: Uses system email as intermediary

## 📧 Email Notifications

When a message is sent:

1. Message is stored in database
2. Email notification sent to recipient
3. Email contains link to continue conversation
4. Professional HTML email templates with WohnNormade branding

## ⚠️ Error Handling

**Common Error Responses:**

- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied to thread
- `404 Not Found`: Tenant, user, or thread not found
- `500 Internal Server Error`: Server error

**Error Response Format:**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE"
  }
}
```

## 🧪 Testing

### 1. Test API Endpoints

Use the interactive API documentation at `http://localhost:3000/api-docs` when server is running.

### 2. Test Email Flow

1. Create a contact message
2. Check recipient's email for notification
3. Click the reply link in email
4. Verify conversation thread loads correctly

### 3. Test Frontend Components

1. Add contact button to tenant preview
2. Test modal opening and form submission
3. Test conversation thread display
4. Test reply functionality

## 📝 Translation Keys

Add these to your translation files:

```json
{
  "tenantPreview": {
    "contactReporter": "Contact Reporter"
  },
  "contactReporter": {
    "title": "Contact Landlord",
    "to": "To",
    "regarding": "Regarding tenant",
    "message": "Your message",
    "messagePlaceholder": "Introduce yourself and explain why you're reaching out...",
    "success": "Message sent successfully!",
    "redirecting": "Redirecting to conversation..."
  }
}
```

## 🎯 Implementation Checklist

- [ ] Set up Resend API key and verify domain
- [ ] Update environment variables
- [ ] Add contact button to tenant preview component
- [ ] Create contact modal component
- [ ] Create conversation thread page
- [ ] Create conversations list page
- [ ] Add translation keys
- [ ] Test complete communication flow
- [ ] Test email notifications
- [ ] Verify security and access control

## 🚀 Ready to Go!

The backend is fully implemented and ready. Follow this guide to complete the frontend implementation and you'll have a fully functional landlord communication system!

## 🔧 Recent Fixes

**Database Schema Fix**: The `threadId` unique constraint has been removed to allow multiple messages in the same conversation thread. This was causing the "Unique constraint failed" error when trying to send replies.

**Status**: ✅ **FIXED** - All communication endpoints are now working correctly.
