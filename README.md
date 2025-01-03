# node-typescript-cas-api

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
   git clone https://github.com/Krishna7852/node-typescript-cas-api.git
   cd node-typescript-cas-api
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

### Authentication Routes

#### POST /api/auth/login
- **Description**: Logs in a user and returns a token.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```

#### POST /api/auth/register
- **Description**: Registers a new user.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```

#### GET /api/auth/validate-token
- **Description**: Validate access token

### User Routes

#### GET /api/auth/user
- **Description**: Get user details

#### GET /api/users
- **Description**: Retrieves a list of users.

#### GET /api/users/:id
- **Description**: Retrieves a specific user by ID.

#### PUT /api/users/:id
- **Description**: Updates a user by ID.
- **Request Body**:
  ```json
  {
    "username": "string",
    "email": "string"
  }
  ```

#### DELETE /api/users/:id
- **Description**: Deletes a user by ID.

### File Routes

#### POST /api/files/upload
- **Description**: Uploads a file.

#### GET /api/files/:id
- **Description**: Retrieves a file by ID.

#### DELETE /api/files/:id
- **Description**: Deletes a file by ID.

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

![screencapture-localhost-3000-api-docs-2025-01-03-12_58_40](https://github.com/user-attachments/assets/56d7ee4c-a2c5-4e3d-907f-ffe88d703209)

## Contributing

1. Fork the repository

2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
