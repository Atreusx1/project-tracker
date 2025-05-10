# Time Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A comprehensive web application for tracking work time across multiple projects. Time Tracker enables users to manage projects, record work sessions, and visualize their productivity with detailed reports. Administrators can access organization-wide insights through an intuitive dashboard.

## Features

- **User Authentication** - Secure registration and login with JWT
- **Project Management** - Create, view, and delete projects
- **Work Session Tracking** - Start/stop timers with descriptions
- **Detailed History** - View personal work sessions and daily summaries
- **Admin Dashboard** - Monitor all users' work time and active sessions
- **Data Visualization** - Charts showing project and time distribution
- **Responsive Design** - Works on desktop and mobile devices
- **API Documentation** - Complete OpenAPI 3.0 docs with Swagger UI

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- TypeScript
- JWT authentication
- Swagger UI for API documentation

### Frontend
- React with TypeScript
- Chart.js for data visualization
- CSS Modules for styling
- Axios for API communication

## Prerequisites

Before installation, ensure you have:

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **npm** (v8+, included with Node.js)
- **MongoDB** (v4.4+) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

## Installation

### Clone the Repository

```bash
git clone https://github.com/atreusx1/time-tracker.git
cd time-tracker
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```
   MONGODB_URI=
   JWT_SECRET=your_jwt_secret
   FRONTEND_URL=http://localhost:5173
   PORT=3000
   NODE_ENV=development

   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER= 
   EMAIL_PASS=
   ```
   *Replace `your_jwt_secret_here` with a secure random string*

4. Install Swagger dependencies:
   ```bash
   npm install swagger-ui-express js-yaml
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### MongoDB Setup

1. Start MongoDB if not running as a service:
   ```bash
   mongod
   ```

2. Verify MongoDB is running:
   ```bash
   mongo --eval "db.adminCommand('ping')"
   ```

## Running the Application

### Start the Backend

```bash
cd backend
npm run dev
```
Backend will run at http://localhost:3000

### Start the Frontend

```bash
cd frontend
npm run dev
```
Frontend will run at http://localhost:5173

### Access the Application

1. Open http://localhost:5173 in your browser
2. Register a new user at http://localhost:5173/register
3. Log in at http://localhost:5173/login

## API Documentation

Access the API documentation at http://localhost:3000/api-docs

### Example: Creating a Project

1. Authenticate via the "Authorize" button using your JWT token
2. Navigate to the `/projects` POST endpoint
3. Click "Try it out" and submit a request:

```json
{
  "name": "New Project",
  "description": "A sample project"
}
```

## Usage Guide

### User Actions

#### Account Management
- Register at `/register`
- Log in at `/login`

#### Project Management
- Navigate to `/projects`
- Create projects with name and optional description
- View project details and time statistics

#### Time Tracking
- Visit `/tracker`
- Select a project and add session description
- Start/stop work sessions
- View work history and daily summaries

### Admin Actions

#### Elevate User Privileges
```bash
cd backend
npx ts-node scripts/makeUserAdmin.ts user@example.com
```

#### Admin Dashboard
- Log in as admin user
- Go to `/admin-work-time`
- View active sessions with live timers
- Access charts of all users' work time
- Review complete session history
- Filter work time by user

## Project Structure

```
time-tracker/
├── backend/
│   ├── src/
│   │   ├── controllers/        # API endpoint logic
│   │   ├── middlewares/        # Authentication middleware
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Error handling
│   │   ├── docs/               # OpenAPI YAML
│   │   ├── scripts/            # Utility scripts
│   │   └── index.ts            # Entry point
│   ├── .env                    # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # React page components
│   │   ├── services/           # API service hooks
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Global styles
│   └── package.json
└── README.md
```

## Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register a new user |
| `/api/auth/login` | POST | Log in and receive JWT |
| `/api/projects` | GET | List all projects |
| `/api/projects` | POST | Create a project |
| `/api/work/start` | POST | Start a work session |
| `/api/work/stop` | POST | Stop active session |
| `/api/work/me` | GET | Get user's sessions |
| `/api/work/time-by-day` | GET | Get user's daily hours |
| `/api/work/all-time-by-day` | GET | Get all users' hours (admin) |

*Full API documentation available at `/api-docs`*

## Troubleshooting

- **MongoDB Connection Issues**: Verify MongoDB is running with `mongo --eval "db.adminCommand('ping')"`
- **JWT Authentication Errors**: Check that your JWT token is valid and not expired
- **Backend Startup Failures**: Ensure environment variables are correctly set in `.env`

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with ❤️ by [Anish]