import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface UserDataFile {
  userId: string;
  createdAt: string;
  profile: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

async function migrateUsers() {
  try {
    const userDataDir = path.join(process.cwd(), 'server', 'user_data');
    const storageFile = path.join(process.cwd(), 'server', 'user_storage.json');
    
    // Check if migration is needed
    try {
      await fs.access(storageFile);
      console.log('User storage already exists, skipping migration');
      return;
    } catch {
      // File doesn't exist, proceed with migration
    }
    
    const files = await fs.readdir(userDataDir);
    const users: any[] = [];
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(userDataDir, file);
          const content = await fs.readFile(filePath, 'utf8');
          const userData: UserDataFile = JSON.parse(content);
          
          if (userData.profile?.email) {
            // Create a user with a default password that users can reset
            const defaultPassword = 'password123'; // Users should change this
            const bcrypt = await import('bcrypt');
            const hashedPassword = await bcrypt.hash(defaultPassword, 10);
            
            const user = {
              id: userData.userId,
              email: userData.profile.email,
              firstName: userData.profile.firstName || '',
              lastName: userData.profile.lastName || '',
              role: userData.profile.role || 'student',
              profileImageUrl: null,
              points: 0,
              level: 1,
              experience: 0,
              createdAt: new Date(userData.createdAt),
              updatedAt: new Date(),
              password: hashedPassword,
            };
            
            users.push(user);
            console.log(`Migrated user: ${userData.profile.email}`);
          }
        } catch (err) {
          console.warn(`Failed to migrate user from ${file}:`, err);
        }
      }
    }
    
    if (users.length > 0) {
      const data = {
        users,
        lastUpdated: new Date().toISOString(),
        migrationNote: 'Migrated from user_data files. Default password is "password123" - users should change this.'
      };
      
      await fs.writeFile(storageFile, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Migration complete! Migrated ${users.length} users.`);
      console.log('IMPORTANT: All migrated users have the default password "password123"');
      console.log('Users should change their passwords after logging in.');
    } else {
      console.log('No users found to migrate');
    }
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateUsers();
}

export { migrateUsers };
