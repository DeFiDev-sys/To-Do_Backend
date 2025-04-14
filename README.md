# To-Do Backend

## Description

This is the backend for a To-Do application built using Node.js and Express. It provides RESTful API endpoints for user authentication and task management.

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- bcrypt for password hashing
- dotenv for environment variable management
- CORS for handling cross-origin requests

## Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/DeFiDev-sys/To-Do_Backend.git
   cd Backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following variables:

   ```
   MONGODB_URL=<your-mongodb-connection-string>
   TOKEN_SECRET=<your-jwt-secret>
   PORT=5000
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in an existing user.
- **POST /api/auth/request-change-password**: Request a password reset.
- **POST /api/auth/reset_password**: Set a new password using a reset token.

### Task Management

- **GET /api/tasks/get_Tasks**: Retrieve tasks for the authenticated user.
- **POST /api/tasks/create_Task**: Create a new task.
- **PATCH /api/tasks/update_Task/:id**: Update an existing task.
- **DELETE /api/tasks/delete_Task/:id**: Delete a task.

## Database Connection

The application connects to MongoDB using Mongoose. Ensure that the `MONGODB_URL` in the `.env` file is correctly set to your MongoDB connection string.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License.
