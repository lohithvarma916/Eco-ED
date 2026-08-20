import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  passwordHash: varchar("password_hash"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default("student"), // 'student' or 'teacher'
  points: integer("points").notNull().default(0),
  level: integer("level").notNull().default(1),
  experience: integer("experience").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Challenge categories enum
export const challengeCategoryEnum = pgEnum("challenge_category", [
  "waste-reduction",
  "energy-conservation", 
  "water-conservation",
  "biodiversity",
  "climate-action",
  "sustainable-transport"
]);

// Challenge status enum
export const challengeStatusEnum = pgEnum("challenge_status", [
  "draft",
  "active", 
  "completed",
  "cancelled"
]);

// Challenges table
export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  category: challengeCategoryEnum("category").notNull(),
  duration: integer("duration").notNull(), // in days
  points: integer("points").notNull(),
  status: challengeStatusEnum("status").notNull().default("draft"),
  requiresPhoto: boolean("requires_photo").notNull().default(false),
  requiresReflection: boolean("requires_reflection").notNull().default(false),
  requiresData: boolean("requires_data").notNull().default(false),
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Submissions table
export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  content: text("content"), // Written reflection/description
  photoUrl: varchar("photo_url"), // URL to uploaded photo
  data: jsonb("data"), // Structured data (e.g., measurements)
  status: varchar("status").notNull().default("pending"), // 'pending', 'approved', 'rejected'
  feedback: text("feedback"), // Teacher feedback
  pointsAwarded: integer("points_awarded").default(0),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Student progress in challenges
export const challengeParticipants = pgTable("challenge_participants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  challengeId: varchar("challenge_id").notNull().references(() => challenges.id),
  studentId: varchar("student_id").notNull().references(() => users.id),
  status: varchar("status").notNull().default("active"), // 'active', 'completed', 'dropped'
  progress: integer("progress").notNull().default(0), // 0-100
  joinedAt: timestamp("joined_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Achievements/badges table
export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description").notNull(),
  icon: varchar("icon").notNull(), // Font Awesome icon class
  category: varchar("category").notNull(),
  pointsRequired: integer("points_required").default(0),
  actionRequired: varchar("action_required"), // e.g., 'complete_challenge', 'submit_data'
  createdAt: timestamp("created_at").defaultNow(),
});

// User achievements (many-to-many)
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  achievementId: varchar("achievement_id").notNull().references(() => achievements.id),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Adventure mode chapters
export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
  imageUrl: varchar("image_url"),
  experienceRequired: integer("experience_required").notNull().default(0),
  pointsReward: integer("points_reward").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Missions within chapters
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chapterId: varchar("chapter_id").notNull().references(() => chapters.id),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
  experienceReward: integer("experience_reward").notNull().default(0),
  requirements: jsonb("requirements"), // Mission requirements/objectives
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress in chapters/missions
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  chapterId: varchar("chapter_id").references(() => chapters.id),
  missionId: varchar("mission_id").references(() => missions.id),
  status: varchar("status").notNull().default("active"), // 'active', 'completed'
  progress: integer("progress").notNull().default(0), // 0-100
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Community forum posts
export const forumPosts = pgTable("forum_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category").notNull().default("general"),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Forum post replies
export const forumReplies = pgTable("forum_replies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => forumPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Rewards table
export const rewards = pgTable("rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description").notNull(),
  rewardLink: varchar("reward_link").notNull(),
  pointsRequired: integer("points_required").notNull(),
  teacherId: varchar("teacher_id").notNull().references(() => users.id),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User rewards (redeemed rewards)
export const userRewards = pgTable("user_rewards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  rewardId: varchar("reward_id").notNull().references(() => rewards.id),
  redeemedAt: timestamp("redeemed_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  challenges: many(challenges),
  submissions: many(submissions),
  challengeParticipants: many(challengeParticipants),
  userAchievements: many(userAchievements),
  userProgress: many(userProgress),
  forumPosts: many(forumPosts),
  forumReplies: many(forumReplies),
  rewards: many(rewards),
  userRewards: many(userRewards),
}));

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  teacher: one(users, {
    fields: [challenges.teacherId],
    references: [users.id],
  }),
  submissions: many(submissions),
  participants: many(challengeParticipants),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [submissions.challengeId],
    references: [challenges.id],
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
  }),
}));

export const challengeParticipantsRelations = relations(challengeParticipants, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeParticipants.challengeId],
    references: [challenges.id],
  }),
  student: one(users, {
    fields: [challengeParticipants.studentId],
    references: [users.id],
  }),
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const chaptersRelations = relations(chapters, ({ many }) => ({
  missions: many(missions),
  userProgress: many(userProgress),
}));

export const missionsRelations = relations(missions, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [missions.chapterId],
    references: [chapters.id],
  }),
  userProgress: many(userProgress),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [userProgress.chapterId],
    references: [chapters.id],
  }),
  mission: one(missions, {
    fields: [userProgress.missionId],
    references: [missions.id],
  }),
}));

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  replies: many(forumReplies),
}));

export const forumRepliesRelations = relations(forumReplies, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumReplies.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumReplies.userId],
    references: [users.id],
  }),
}));

export const rewardsRelations = relations(rewards, ({ one, many }) => ({
  teacher: one(users, {
    fields: [rewards.teacherId],
    references: [users.id],
  }),
  userRewards: many(userRewards),
}));

export const userRewardsRelations = relations(userRewards, ({ one }) => ({
  user: one(users, {
    fields: [userRewards.userId],
    references: [users.id],
  }),
  reward: one(rewards, {
    fields: [userRewards.rewardId],
    references: [rewards.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  submittedAt: true,
  reviewedAt: true,
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likes: true,
});

export const insertRewardSchema = createInsertSchema(rewards).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserRewardSchema = createInsertSchema(userRewards).omit({
  id: true,
  redeemedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Chapter = typeof chapters.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserProgressWithDetails = UserProgress & { 
  chapter?: Chapter | null; 
  mission?: Mission | null; 
};
export type ForumPost = typeof forumPosts.$inferSelect;
export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumReply = typeof forumReplies.$inferSelect;
export type Reward = typeof rewards.$inferSelect;
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type UserReward = typeof userRewards.$inferSelect;
export type InsertUserReward = z.infer<typeof insertUserRewardSchema>;
