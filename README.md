# Authentication Service with JWT

A TypeScript-based Authentication Service using JWT tokens with access and refresh token support.

## Features

- User registration and login
- JWT-based authentication with access and refresh tokens
- Token validation and refresh mechanisms
- User profile management
- Swagger API documentation
- MongoDB integration
- Error handling and logging
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- TypeScript

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/auths.git
   cd auths
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/cas_service
   JWT_ACCESS_SECRET=your_access_secret_key_here
   JWT_REFRESH_SECRET=your_refresh_secret_key_here
   ACCESS_TOKEN_EXPIRES_IN=15m
   REFRESH_TOKEN_EXPIRES_IN=7d
   NODE_ENV=development
   ```

## Development

Run the development server:
```bash
npm run dev
```

## Build

Build the project:
```bash
npm run build
```

## Production

Start the production server:
```bash
npm start
```

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/validate-token` - Validate access token

### User
- GET `/api/auth/user` - Get user details

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/cas_service |
| JWT_ACCESS_SECRET | JWT access token secret | - |
| JWT_REFRESH_SECRET | JWT refresh token secret | - |
| ACCESS_TOKEN_EXPIRES_IN | Access token expiry | 15m |
| REFRESH_TOKEN_EXPIRES_IN | Refresh token expiry | 7d |
| NODE_ENV | Environment | development |

## Security

- Passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Access and refresh token mechanism
- Protected routes using authentication middleware

## Error Handling

The API uses a centralized error handling mechanism with appropriate HTTP status codes and error messages.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
