import mongoose from 'mongoose';
import dotenv from 'dotenv';
import readline from 'readline';
import { UserModel } from '../src/models/userModel';

// Load environment variables
dotenv.config({ path: './.env' }); // Use './.env' if .env is in backend/

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/time-tracker';

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt for user input
const prompt = (question: string): Promise<string> => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Main function to make a user admin
async function makeUserAdmin() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get email from command-line argument or prompt
    let email = process.argv[2];
    if (!email) {
      email = await prompt('Enter the user email to make admin: ');
    }

    if (!email) {
      throw new Error('Email is required');
    }

    // Find and update the user
    const user = await UserModel.findOneAndUpdate(
      { email },
      { $set: { role: 'admin' } },
      { new: true }
    );

    if (!user) {
      throw new Error(`User with email ${email} not found`);
    }

    console.log(`User ${email} has been updated to admin role`);
    console.log('Updated user:', {
      email: user.email,
      role: user.role,
    });

  } catch (error: any) {
    console.error('Error:', error.message);
  } finally {
    // Close MongoDB connection and readline
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    rl.close();
  }
}

// Run the script
makeUserAdmin();