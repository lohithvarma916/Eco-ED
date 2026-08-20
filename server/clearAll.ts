import { db, pool } from "./db";
import {
  users,
  challenges,
  submissions,
  challengeParticipants,
  achievements,
  userAchievements,
  chapters,
  missions,
  userProgress,
  forumPosts,
  forumReplies,
} from "@shared/schema";

async function main() {
  try {
    console.log("Starting database wipe (preserving sessions)...");

    // Delete in dependency-safe order (children -> parents)
    await db.delete(forumReplies);
    await db.delete(forumPosts);
    await db.delete(userAchievements);
    await db.delete(submissions);
    await db.delete(challengeParticipants);
    await db.delete(userProgress);
    await db.delete(missions);
    await db.delete(chapters);
    await db.delete(achievements);
    await db.delete(challenges);
    await db.delete(users);

    console.log("All application tables cleared. Sessions table preserved.");
    process.exit(0);
  } catch (err) {
    console.error("Failed to wipe database:", err);
    process.exit(1);
  } finally {
    try {
      await pool.end();
    } catch {}
  }
}

main();


