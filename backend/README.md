# Time Tracker Backend

## Prerequisites
- Node.js >= 18.x
- MongoDB
- TypeScript
- Yarn or npm

## Setup
1. Clone the repository
2. Install dependencies: `yarn install` or `npm install`
3. Copy `.env.example` to `.env` and fill in the values
4. Build the project: `yarn build` or `npm run build`
5. Start the server: `yarn start` or `npm start`

## Development
Run in development mode with hot-reload:
```bash
yarn dev
# or
npm run dev


Run the Script with an Email Argument:
powershell

Copy
cd C:\Time Tracker\backend
npx ts-node scripts/makeUserAdmin.ts test@example.com
Expected Output (if the user exists):
text

Copy
Connecting to MongoDB...
Connected to MongoDB
User test@example.com has been updated to admin role
Updated user: { email: 'test@example.com', role: 'admin' }
Disconnected from MongoDB