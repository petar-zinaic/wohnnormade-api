# WohnNormade API Documentation

Welcome to the WohnNormade API documentation. This API provides endpoints for managing tenant reports and landlord communications.

## 📚 Documentation Index

### Core Features

- [Authentication Guide](README_AUTH.md) - User authentication and authorization
- [Communication System](COMMUNICATION_SETUP.md) - Landlord communication features
- [Communication API](API_COMMUNICATION.md) - Detailed API documentation for communication endpoints
- [Environment Setup](ENVIRONMENT_SETUP.md) - Complete environment configuration guide

### API Endpoints

- **Authentication**: `/api/auth/*` - Login, register, password management
- **Users**: `/api/users/*` - User management
- **Tenants**: `/api/tenant/*` - Tenant report management
- **Communications**: `/api/communications/*` - Landlord communication system

### Setup & Configuration

- [Environment Setup](ENVIRONMENT_SETUP.md) - Complete environment variables configuration guide
- [Database Migration](COMMUNICATION_SETUP.md#database-migration) - Database setup instructions

## 🚀 Quick Start

1. **Environment Setup**

   ```bash
   cp environments/env.template environments/.env.local
   # Edit .env.local with your configuration
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Database Setup**

   ```bash
   npm run migrate:local
   ```

4. **Start Development Server**
   ```bash
   npm run development:local
   ```

## 📖 API Documentation

Interactive API documentation is available at:

- **Swagger UI**: `http://localhost:3000/api-docs` (when server is running)

## 🔧 Development

### Available Scripts

- `npm run development:local` - Start development server with local environment
- `npm run development:dev` - Start development server with dev environment
- `npm run development:prod` - Start development server with production environment
- `npm run build` - Build the project for production
- `npm run migrate:local` - Run database migrations for local environment

### Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── repositories/    # Data access layer
├── router/          # Route definitions
├── middlewares/     # Express middlewares
├── types/           # TypeScript type definitions
├── utility/         # Helper functions and utilities
└── public/          # Static files and API documentation
```

## 🔐 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting protection
- Secure email communication
- Access control for sensitive operations

## 📧 Communication System

The communication system allows landlords to:

- Contact other landlords about specific tenants
- Maintain conversation threads
- Receive email notifications
- Access conversation history

See [Communication System Documentation](COMMUNICATION_SETUP.md) for detailed setup and usage instructions.

## 🤝 Contributing

1. Follow the existing code structure and patterns
2. Add proper TypeScript types for new features
3. Include validation schemas for new endpoints
4. Update documentation for new features
5. Test all endpoints before submitting

## 📝 License

This project is proprietary software for WohnNormade.
