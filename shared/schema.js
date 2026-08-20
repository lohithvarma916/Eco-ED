var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, timestamp, varchar, text, integer, boolean, pgEnum, } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export var sessions = pgTable("sessions", {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
}, function (table) { return [index("IDX_session_expire").on(table.expire)]; });
// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export var users = pgTable("users", {
    id: varchar("id").primaryKey().default(sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
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
export var challengeCategoryEnum = pgEnum("challenge_category", [
    "waste-reduction",
    "energy-conservation",
    "water-conservation",
    "biodiversity",
    "climate-action",
    "sustainable-transport"
]);
// Challenge status enum
export var challengeStatusEnum = pgEnum("challenge_status", [
    "draft",
    "active",
    "completed",
    "cancelled"
]);
// Challenges table
export var challenges = pgTable("challenges", {
    id: varchar("id").primaryKey().default(sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    category: challengeCategoryEnum("category").notNull(),
    duration: integer("duration").notNull(), // in days
    points: integer("points").notNull(),
    status: challengeStatusEnum("status").notNull().default("draft"),
    requiresPhoto: boolean("requires_photo").notNull().default(false),
    requiresReflection: boolean("requires_reflection").notNull().default(false),
    requiresData: boolean("requires_data").notNull().default(false),
    teacherId: varchar("teacher_id").notNull().references(function () { return users.id; }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Submissions table
export var submissions = pgTable("submissions", {
    id: varchar("id").primaryKey().default(sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    challengeId: varchar("challenge_id").notNull().references(function () { return challenges.id; }),
    studentId: varchar("student_id").notNull().references(function () { return users.id; }),
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
export var challengeParticipants = pgTable("challenge_participants", {
    id: varchar("id").primaryKey().default(sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    challengeId: varchar("challenge_id").notNull().references(function () { return challenges.id; }),
    studentId: varchar("student_id").notNull().references(function () { return users.id; }),
    status: varchar("status").notNull().default("active"), // 'active', 'completed', 'dropped'
    progress: integer("progress").notNull().default(0), // 0-100
    joinedAt: timestamp("joined_at").defaultNow(),
    completedAt: timestamp("completed_at"),
});
// Achievements/badges table
export var achievements = pgTable("achievements", {
    id: varchar("id").primaryKey().default(sql(templateObject_5 || (templateObject_5 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    name: varchar("name").notNull(),
    description: text("description").notNull(),
    icon: varchar("icon").notNull(), // Font Awesome icon class
    category: varchar("category").notNull(),
    pointsRequired: integer("points_required").default(0),
    actionRequired: varchar("action_required"), // e.g., 'complete_challenge', 'submit_data'
    createdAt: timestamp("created_at").defaultNow(),
});
// User achievements (many-to-many)
export var userAchievements = pgTable("user_achievements", {
    id: varchar("id").primaryKey().default(sql(templateObject_6 || (templateObject_6 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }),
    achievementId: varchar("achievement_id").notNull().references(function () { return achievements.id; }),
    earnedAt: timestamp("earned_at").defaultNow(),
});
// Adventure mode chapters
export var chapters = pgTable("chapters", {
    id: varchar("id").primaryKey().default(sql(templateObject_7 || (templateObject_7 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    orderIndex: integer("order_index").notNull(),
    imageUrl: varchar("image_url"),
    experienceRequired: integer("experience_required").notNull().default(0),
    pointsReward: integer("points_reward").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
});
// Missions within chapters
export var missions = pgTable("missions", {
    id: varchar("id").primaryKey().default(sql(templateObject_8 || (templateObject_8 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    chapterId: varchar("chapter_id").notNull().references(function () { return chapters.id; }),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    orderIndex: integer("order_index").notNull(),
    experienceReward: integer("experience_reward").notNull().default(0),
    requirements: jsonb("requirements"), // Mission requirements/objectives
    createdAt: timestamp("created_at").defaultNow(),
});
// User progress in chapters/missions
export var userProgress = pgTable("user_progress", {
    id: varchar("id").primaryKey().default(sql(templateObject_9 || (templateObject_9 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }),
    chapterId: varchar("chapter_id").references(function () { return chapters.id; }),
    missionId: varchar("mission_id").references(function () { return missions.id; }),
    status: varchar("status").notNull().default("active"), // 'active', 'completed'
    progress: integer("progress").notNull().default(0), // 0-100
    completedAt: timestamp("completed_at"),
    createdAt: timestamp("created_at").defaultNow(),
});
// Community forum posts
export var forumPosts = pgTable("forum_posts", {
    id: varchar("id").primaryKey().default(sql(templateObject_10 || (templateObject_10 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }),
    title: varchar("title").notNull(),
    content: text("content").notNull(),
    category: varchar("category").notNull().default("general"),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Forum post replies
export var forumReplies = pgTable("forum_replies", {
    id: varchar("id").primaryKey().default(sql(templateObject_11 || (templateObject_11 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    postId: varchar("post_id").notNull().references(function () { return forumPosts.id; }),
    userId: varchar("user_id").notNull().references(function () { return users.id; }),
    content: text("content").notNull(),
    likes: integer("likes").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// Rewards table
export var rewards = pgTable("rewards", {
    id: varchar("id").primaryKey().default(sql(templateObject_12 || (templateObject_12 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    title: varchar("title").notNull(),
    description: text("description").notNull(),
    rewardLink: varchar("reward_link").notNull(),
    pointsRequired: integer("points_required").notNull(),
    teacherId: varchar("teacher_id").notNull().references(function () { return users.id; }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});
// User rewards (redeemed rewards)
export var userRewards = pgTable("user_rewards", {
    id: varchar("id").primaryKey().default(sql(templateObject_13 || (templateObject_13 = __makeTemplateObject(["gen_random_uuid()"], ["gen_random_uuid()"])))),
    userId: varchar("user_id").notNull().references(function () { return users.id; }),
    rewardId: varchar("reward_id").notNull().references(function () { return rewards.id; }),
    redeemedAt: timestamp("redeemed_at").defaultNow(),
});
// Relations
export var usersRelations = relations(users, function (_a) {
    var many = _a.many;
    return ({
        challenges: many(challenges),
        submissions: many(submissions),
        challengeParticipants: many(challengeParticipants),
        userAchievements: many(userAchievements),
        userProgress: many(userProgress),
        forumPosts: many(forumPosts),
        forumReplies: many(forumReplies),
        rewards: many(rewards),
        userRewards: many(userRewards),
    });
});
export var challengesRelations = relations(challenges, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        teacher: one(users, {
            fields: [challenges.teacherId],
            references: [users.id],
        }),
        submissions: many(submissions),
        participants: many(challengeParticipants),
    });
});
export var submissionsRelations = relations(submissions, function (_a) {
    var one = _a.one;
    return ({
        challenge: one(challenges, {
            fields: [submissions.challengeId],
            references: [challenges.id],
        }),
        student: one(users, {
            fields: [submissions.studentId],
            references: [users.id],
        }),
    });
});
export var challengeParticipantsRelations = relations(challengeParticipants, function (_a) {
    var one = _a.one;
    return ({
        challenge: one(challenges, {
            fields: [challengeParticipants.challengeId],
            references: [challenges.id],
        }),
        student: one(users, {
            fields: [challengeParticipants.studentId],
            references: [users.id],
        }),
    });
});
export var userAchievementsRelations = relations(userAchievements, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [userAchievements.userId],
            references: [users.id],
        }),
        achievement: one(achievements, {
            fields: [userAchievements.achievementId],
            references: [achievements.id],
        }),
    });
});
export var chaptersRelations = relations(chapters, function (_a) {
    var many = _a.many;
    return ({
        missions: many(missions),
        userProgress: many(userProgress),
    });
});
export var missionsRelations = relations(missions, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        chapter: one(chapters, {
            fields: [missions.chapterId],
            references: [chapters.id],
        }),
        userProgress: many(userProgress),
    });
});
export var userProgressRelations = relations(userProgress, function (_a) {
    var one = _a.one;
    return ({
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
    });
});
export var forumPostsRelations = relations(forumPosts, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        user: one(users, {
            fields: [forumPosts.userId],
            references: [users.id],
        }),
        replies: many(forumReplies),
    });
});
export var forumRepliesRelations = relations(forumReplies, function (_a) {
    var one = _a.one;
    return ({
        post: one(forumPosts, {
            fields: [forumReplies.postId],
            references: [forumPosts.id],
        }),
        user: one(users, {
            fields: [forumReplies.userId],
            references: [users.id],
        }),
    });
});
export var rewardsRelations = relations(rewards, function (_a) {
    var one = _a.one, many = _a.many;
    return ({
        teacher: one(users, {
            fields: [rewards.teacherId],
            references: [users.id],
        }),
        userRewards: many(userRewards),
    });
});
export var userRewardsRelations = relations(userRewards, function (_a) {
    var one = _a.one;
    return ({
        user: one(users, {
            fields: [userRewards.userId],
            references: [users.id],
        }),
        reward: one(rewards, {
            fields: [userRewards.rewardId],
            references: [rewards.id],
        }),
    });
});
// Insert schemas
export var insertUserSchema = createInsertSchema(users).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertChallengeSchema = createInsertSchema(challenges).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertSubmissionSchema = createInsertSchema(submissions).omit({
    id: true,
    submittedAt: true,
    reviewedAt: true,
});
export var insertForumPostSchema = createInsertSchema(forumPosts).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    likes: true,
});
export var insertRewardSchema = createInsertSchema(rewards).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export var insertUserRewardSchema = createInsertSchema(userRewards).omit({
    id: true,
    redeemedAt: true,
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4, templateObject_5, templateObject_6, templateObject_7, templateObject_8, templateObject_9, templateObject_10, templateObject_11, templateObject_12, templateObject_13;
