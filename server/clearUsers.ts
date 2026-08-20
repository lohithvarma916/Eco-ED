
import { db } from "./db";
import { users } from "@shared/schema";

async function clearAllUsers() {
  try {
    console.log('Clearing all user data from database...');
    
    // Delete all users from the database
    const result = await db.delete(users);
    
    console.log('Successfully cleared all user data from the database');
    console.log('Users can now sign up with fresh accounts');
    
    process.exit(0);
  } catch (error) {
    console.error('Error clearing user data:', error);
    process.exit(1);
  }
}

clearAllUsers();
