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
  rewards,
  userRewards,
  type User,
  type UpsertUser,
  type Challenge,
  type InsertChallenge,
  type Submission,
  type InsertSubmission,
  type ChallengeParticipant,
  type Achievement,
  type Chapter,
  type Mission,
  type ForumPost,
  type InsertForumPost,
  type UserProgressWithDetails,
  type Reward,
  type InsertReward,
  type UserReward,
  type InsertUserReward,
} from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import crypto from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT - mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createUser(userData: { email: string; password: string; name: string; role: string }): Promise<User>;
  verifyPassword(userId: string, password: string): Promise<boolean>;
  verifyPasswordByEmail(email: string, password: string): Promise<boolean>;

  // Challenge operations
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  getChallengesByTeacher(teacherId: string): Promise<Challenge[]>;
  getActiveChallenges(): Promise<Challenge[]>;
  updateChallenge(id: string, challenge: Partial<Challenge>): Promise<Challenge | undefined>;

  // Challenge participation
  joinChallenge(challengeId: string, studentId: string): Promise<void>;
  getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]>;
  getStudentChallenges(studentId: string): Promise<(ChallengeParticipant & { challenge: Challenge })[]>;

  // Submission operations
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissionsByChallenge(challengeId: string): Promise<(Submission & { student: User })[]>;
  getSubmissionsByStudent(studentId: string): Promise<(Submission & { challenge: Challenge })[]>;
  updateSubmission(id: string, submission: Partial<Submission>): Promise<Submission | undefined>;

  // Achievement operations
  getAllAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: string): Promise<Achievement[]>;
  awardAchievement(userId: string, achievementId: string): Promise<void>;

  // Adventure mode operations
  getAllChapters(): Promise<Chapter[]>;
  getUserProgress(userId: string): Promise<UserProgressWithDetails[]>;
  updateUserProgress(userId: string, chapterId?: string, missionId?: string, progress?: number): Promise<void>;

  // Community operations
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  getForumPosts(limit?: number): Promise<(ForumPost & { user: User; replyCount: number })[]>;

  // Rewards operations
  createReward(reward: InsertReward): Promise<Reward>;
  getRewardsByTeacher(teacherId: string): Promise<Reward[]>;
  getActiveRewards(): Promise<Reward[]>;
  updateReward(id: string, updates: Partial<InsertReward>): Promise<Reward>;
  deleteReward(id: string): Promise<void>;
  
  // User rewards operations
  redeemReward(userId: string, rewardId: string): Promise<UserReward>;
  getUserRewards(userId: string): Promise<(UserReward & { reward: Reward })[]>;
  getUserPoints(userId: string): Promise<number>;

  // Analytics operations
  getTeacherStats(teacherId: string): Promise<any>;
  getStudentLeaderboard(limit?: number): Promise<User[]>;
}

// Database-backed storage (only initialized when DATABASE_URL is present)
export class DatabaseStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  // User operations (IMPORTANT - mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: { email: string; password: string; name: string; role: string }): Promise<User> {
    const [firstName, ...lastNameParts] = userData.name.split(" ");
    const lastName = lastNameParts.join(" ") || "";
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const [user] = await this.db
      .insert(users)
      .values({
        email: userData.email,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        role: userData.role as "student" | "teacher",
      })
      .returning();

    return user;
  }

  // Challenge operations
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await this.db
      .insert(challenges)
      .values(challenge)
      .returning();
    return newChallenge;
  }

  async getChallengesByTeacher(teacherId: string): Promise<Challenge[]> {
    return await this.db
      .select()
      .from(challenges)
      .where(eq(challenges.teacherId, teacherId))
      .orderBy(desc(challenges.createdAt));
  }

  async getActiveChallenges(): Promise<Challenge[]> {
    return await this.db
      .select()
      .from(challenges)
      .where(eq(challenges.status, "active"))
      .orderBy(desc(challenges.createdAt));
  }

  async updateChallenge(id: string, challenge: Partial<Challenge>): Promise<Challenge | undefined> {
    const [updated] = await this.db
      .update(challenges)
      .set({ ...challenge, updatedAt: new Date() })
      .where(eq(challenges.id, id))
      .returning();
    return updated;
  }

  // Challenge participation
  async joinChallenge(challengeId: string, studentId: string): Promise<void> {
    await this.db.insert(challengeParticipants).values({
      challengeId,
      studentId,
    });
  }

  async getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
    return await this.db
      .select()
      .from(challengeParticipants)
      .where(eq(challengeParticipants.challengeId, challengeId));
  }

  async getStudentChallenges(studentId: string): Promise<(ChallengeParticipant & { challenge: Challenge })[]> {
    return await this.db
      .select({
        id: challengeParticipants.id,
        challengeId: challengeParticipants.challengeId,
        studentId: challengeParticipants.studentId,
        status: challengeParticipants.status,
        progress: challengeParticipants.progress,
        joinedAt: challengeParticipants.joinedAt,
        completedAt: challengeParticipants.completedAt,
        challenge: challenges,
      })
      .from(challengeParticipants)
      .innerJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
      .where(eq(challengeParticipants.studentId, studentId));
  }

  // Submission operations
  async createSubmission(submission: InsertSubmission): Promise<Submission> {
    const [newSubmission] = await this.db
      .insert(submissions)
      .values(submission)
      .returning();
    return newSubmission;
  }

  async getSubmissionsByChallenge(challengeId: string): Promise<(Submission & { student: User })[]> {
    return await this.db
      .select({
        id: submissions.id,
        challengeId: submissions.challengeId,
        studentId: submissions.studentId,
        content: submissions.content,
        photoUrl: submissions.photoUrl,
        data: submissions.data,
        status: submissions.status,
        feedback: submissions.feedback,
        pointsAwarded: submissions.pointsAwarded,
        submittedAt: submissions.submittedAt,
        reviewedAt: submissions.reviewedAt,
        student: users,
      })
      .from(submissions)
      .innerJoin(users, eq(submissions.studentId, users.id))
      .where(eq(submissions.challengeId, challengeId));
  }

  async getSubmissionsByStudent(studentId: string): Promise<(Submission & { challenge: Challenge })[]> {
    return await this.db
      .select({
        id: submissions.id,
        challengeId: submissions.challengeId,
        studentId: submissions.studentId,
        content: submissions.content,
        photoUrl: submissions.photoUrl,
        data: submissions.data,
        status: submissions.status,
        feedback: submissions.feedback,
        pointsAwarded: submissions.pointsAwarded,
        submittedAt: submissions.submittedAt,
        reviewedAt: submissions.reviewedAt,
        challenge: challenges,
      })
      .from(submissions)
      .innerJoin(challenges, eq(submissions.challengeId, challenges.id))
      .where(eq(submissions.studentId, studentId));
  }

  async updateSubmission(id: string, submission: Partial<Submission>): Promise<Submission | undefined> {
    const [updated] = await this.db
      .update(submissions)
      .set(submission)
      .where(eq(submissions.id, id))
      .returning();
    return updated;
  }

  // Achievement operations
  async getAllAchievements(): Promise<Achievement[]> {
    return await this.db.select().from(achievements);
  }

  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const results = await this.db
      .select({
        id: achievements.id,
        name: achievements.name,
        description: achievements.description,
        icon: achievements.icon,
        category: achievements.category,
        pointsRequired: achievements.pointsRequired,
        actionRequired: achievements.actionRequired,
        createdAt: achievements.createdAt,
      })
      .from(userAchievements)
      .leftJoin(achievements, eq(userAchievements.achievementId, achievements.id))
      .where(eq(userAchievements.userId, userId));

    return results.filter((r: any) => r.id !== null && r.name !== null && r.description !== null && r.icon !== null && r.category !== null) as Achievement[];
  }

  async awardAchievement(userId: string, achievementId: string): Promise<void> {
    await this.db.insert(userAchievements).values({
      userId,
      achievementId,
    });
  }

  // Adventure mode operations
  async getAllChapters(): Promise<Chapter[]> {
    return await this.db
      .select()
      .from(chapters)
      .orderBy(chapters.orderIndex);
  }

  async getUserProgress(userId: string): Promise<UserProgressWithDetails[]> {
    return await this.db
      .select({
        id: userProgress.id,
        userId: userProgress.userId,
        chapterId: userProgress.chapterId,
        missionId: userProgress.missionId,
        status: userProgress.status,
        progress: userProgress.progress,
        completedAt: userProgress.completedAt,
        createdAt: userProgress.createdAt,
        chapter: chapters,
        mission: missions,
      })
      .from(userProgress)
      .leftJoin(chapters, eq(userProgress.chapterId, chapters.id))
      .leftJoin(missions, eq(userProgress.missionId, missions.id))
      .where(eq(userProgress.userId, userId));
  }

  async updateUserProgress(userId: string, chapterId?: string, missionId?: string, progress?: number): Promise<void> {
    await this.db.insert(userProgress).values({
      userId,
      chapterId,
      missionId,
      progress: progress || 0,
    });
  }

  // Community operations
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const [newPost] = await this.db
      .insert(forumPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getForumPosts(limit = 10): Promise<(ForumPost & { user: User; replyCount: number })[]> {
    return await this.db
      .select({
        id: forumPosts.id,
        userId: forumPosts.userId,
        title: forumPosts.title,
        content: forumPosts.content,
        category: forumPosts.category,
        likes: forumPosts.likes,
        createdAt: forumPosts.createdAt,
        updatedAt: forumPosts.updatedAt,
        user: users,
        replyCount: sql<number>`cast(count(${forumReplies.id}) as int)`,
      })
      .from(forumPosts)
      .innerJoin(users, eq(forumPosts.userId, users.id))
      .leftJoin(forumReplies, eq(forumPosts.id, forumReplies.postId))
      .groupBy(forumPosts.id, users.id)
      .orderBy(desc(forumPosts.createdAt))
      .limit(limit);
  }

  // Analytics operations
  async getTeacherStats(teacherId: string): Promise<any> {
    const challengeCount = await this.db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(challenges)
      .where(eq(challenges.teacherId, teacherId));

    const studentCount = await this.db
      .select({ count: sql<number>`cast(count(distinct ${challengeParticipants.studentId}) as int)` })
      .from(challengeParticipants)
      .leftJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
      .where(eq(challenges.teacherId, teacherId));

    const submissionCount = await this.db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(submissions)
      .leftJoin(challenges, eq(submissions.challengeId, challenges.id))
      .where(eq(challenges.teacherId, teacherId));

    return {
      activeChallenges: challengeCount[0]?.count || 0,
      activeStudents: studentCount[0]?.count || 0,
      totalSubmissions: submissionCount[0]?.count || 0,
    };
  }

  async getStudentLeaderboard(limit = 10): Promise<User[]> {
    return await this.db
      .select()
      .from(users)
      .where(eq(users.role, "student"))
      .orderBy(desc(users.points), desc(users.experience))
      .limit(limit);
  }

  // Rewards operations
  async createReward(reward: InsertReward): Promise<Reward> {
    const [newReward] = await this.db.insert(rewards).values({
      id: crypto.randomUUID(),
      ...reward,
    }).returning();
    return newReward;
  }

  async getRewardsByTeacher(teacherId: string): Promise<Reward[]> {
    return await this.db
      .select()
      .from(rewards)
      .where(eq(rewards.teacherId, teacherId))
      .orderBy(desc(rewards.createdAt));
  }

  async getActiveRewards(): Promise<Reward[]> {
    return await this.db
      .select()
      .from(rewards)
      .where(eq(rewards.isActive, true))
      .orderBy(desc(rewards.createdAt));
  }

  async updateReward(id: string, updates: Partial<InsertReward>): Promise<Reward> {
    const [updatedReward] = await this.db
      .update(rewards)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(rewards.id, id))
      .returning();
    return updatedReward;
  }

  async deleteReward(id: string): Promise<void> {
    await this.db.delete(rewards).where(eq(rewards.id, id));
  }

  // User rewards operations
  async redeemReward(userId: string, rewardId: string): Promise<UserReward> {
    // Get the reward to check points
    const reward = await this.db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
    if (!reward[0]) throw new Error("Reward not found");

    // Check if user has enough points
    const user = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0]) throw new Error("User not found");
    if (user[0].points < reward[0].pointsRequired) {
      throw new Error("Insufficient points");
    }

    // Deduct points and create user reward
    await this.db.update(users).set({ 
      points: user[0].points - reward[0].pointsRequired 
    }).where(eq(users.id, userId));

    const [newUserReward] = await this.db.insert(userRewards).values({
      id: crypto.randomUUID(),
      userId,
      rewardId,
    }).returning();

    return newUserReward;
  }

  async getUserRewards(userId: string): Promise<(UserReward & { reward: Reward })[]> {
    return await this.db
      .select()
      .from(userRewards)
      .leftJoin(rewards, eq(userRewards.rewardId, rewards.id))
      .where(eq(userRewards.userId, userId))
      .orderBy(desc(userRewards.redeemedAt));
  }

  async getUserPoints(userId: string): Promise<number> {
    const user = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user[0]?.points || 0;
  }

  async verifyPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user[0] || !user[0].passwordHash) {
      return false;
    }
    return await bcrypt.compare(password, user[0].passwordHash);
  }

  async verifyPasswordByEmail(email: string, password: string): Promise<boolean> {
    const user = await this.db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user[0] || !user[0].passwordHash) {
      return false;
    }
    return await bcrypt.compare(password, user[0].passwordHash);
  }
}

// In-memory fallback storage for preview/development without a database
class MemoryStorage implements IStorage {
  private memory = {
    users: [] as (User & { password?: string })[],
    challenges: [] as Challenge[],
    challengeParticipants: [] as ChallengeParticipant[],
    submissions: [] as Submission[],
    achievements: [] as Achievement[],
    forumPosts: [] as ForumPost[],
    forumReplies: [] as any[],
    userProgress: [] as any[],
    rewards: [] as Reward[],
    userRewards: [] as UserReward[],
  };

  constructor() {
    this.loadUsersFromStorage();
  }

  private async loadUsersFromStorage() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const storageFile = path.join(process.cwd(), 'server', 'user_storage.json');
      
      try {
        const content = await fs.readFile(storageFile, 'utf8');
        const data = JSON.parse(content);
        this.memory.users = data.users || [];
        console.log(`Loaded ${this.memory.users.length} users from storage`);
      } catch (err) {
        console.log('No existing user storage found, starting fresh');
      }
    } catch (err) {
      console.warn('Failed to load users from storage:', err);
    }
  }

  private async saveUsersToStorage() {
    try {
      const fs = await import('fs/promises');
      const path = await import('path');
      const storageFile = path.join(process.cwd(), 'server', 'user_storage.json');
      
      const data = {
        users: this.memory.users,
        lastUpdated: new Date().toISOString()
      };
      
      await fs.writeFile(storageFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
      console.warn('Failed to save users to storage:', err);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.memory.users.find(u => u.id === id);
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    const existing = this.memory.users.find(u => u.id === user.id);
    if (existing) {
      Object.assign(existing, user);
      return existing as User;
    }
    const newUser: User = {
      id: user.id || crypto.randomUUID(),
      email: user.email || "",
      firstName: (user as any).firstName || "",
      lastName: (user as any).lastName || "",
      profileImageUrl: (user as any).profileImageUrl || null,
      role: (user as any).role || "student",
      points: 0,
      level: 1,
      experience: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    this.memory.users.push(newUser as any);
    return newUser;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.memory.users.find(u => u.email === email);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const newChallenge: Challenge = { id: crypto.randomUUID(), status: "active", createdAt: new Date(), updatedAt: new Date(), ...challenge } as any;
    this.memory.challenges.push(newChallenge);
    return newChallenge;
  }
  async getChallengesByTeacher(teacherId: string): Promise<Challenge[]> {
    return this.memory.challenges
      .filter(c => c.teacherId === teacherId)
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
  }
  async getActiveChallenges(): Promise<Challenge[]> {
    return this.memory.challenges
      .filter(c => c.status === "active")
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
  }
  async updateChallenge(id: string, challenge: Partial<Challenge>): Promise<Challenge | undefined> {
    const index = this.memory.challenges.findIndex(c => c.id === id);
    if (index === -1) return undefined;
    const updated: Challenge = { ...this.memory.challenges[index], ...challenge, updatedAt: new Date() } as any;
    this.memory.challenges[index] = updated;
    return updated;
  }
  async joinChallenge(challengeId: string, studentId: string): Promise<void> {
    const exists = this.memory.challengeParticipants.find(
      p => p.challengeId === challengeId && p.studentId === studentId,
    );
    if (exists) return;
    this.memory.challengeParticipants.push({
      id: crypto.randomUUID(),
      challengeId,
      studentId,
      status: "active",
      progress: 0,
      joinedAt: new Date(),
      completedAt: null as any,
    } as any);
  }
  async getChallengeParticipants(challengeId: string): Promise<ChallengeParticipant[]> {
    return this.memory.challengeParticipants.filter(p => p.challengeId === challengeId);
  }
  async getStudentChallenges(studentId: string): Promise<(ChallengeParticipant & { challenge: Challenge })[]> {
    return this.memory.challengeParticipants
      .filter(p => p.studentId === studentId)
      .map(p => ({
        ...p,
        challenge: this.memory.challenges.find(c => c.id === p.challengeId) as Challenge,
      }))
      .filter(item => !!item.challenge);
  }
  async createSubmission(_submission: InsertSubmission): Promise<Submission> { throw new Error("Not implemented in memory mode"); }
  async getSubmissionsByChallenge(_challengeId: string): Promise<(Submission & { student: User; })[]> { return []; }
  async getSubmissionsByStudent(_studentId: string): Promise<(Submission & { challenge: Challenge; })[]> { return []; }
  async updateSubmission(_id: string, _submission: Partial<Submission>): Promise<Submission | undefined> { return undefined; }
  async getAllAchievements(): Promise<Achievement[]> { return []; }
  async getUserAchievements(_userId: string): Promise<Achievement[]> { return []; }
  async awardAchievement(_userId: string, _achievementId: string): Promise<void> { return; }
  async getAllChapters(): Promise<Chapter[]> { return []; }
  async getUserProgress(_userId: string): Promise<UserProgressWithDetails[]> { return []; }
  async updateUserProgress(_userId: string, _chapterId?: string, _missionId?: string, _progress?: number): Promise<void> { return; }
  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const newPost: ForumPost = {
      id: crypto.randomUUID(),
      userId: post.userId,
      title: post.title,
      content: post.content,
      category: (post as any).category ?? "general",
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
    this.memory.forumPosts.push(newPost);
    return newPost;
  }
  async getForumPosts(limit = 10): Promise<(ForumPost & { user: User; replyCount: number; })[]> {
    const posts = [...this.memory.forumPosts]
      .sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0))
      .slice(0, limit);
    return posts.map(p => ({
      ...p,
      user: (this.memory.users.find(u => u.id === p.userId) as User) || ({ id: p.userId, firstName: "", lastName: "", email: "", role: "student", points: 0, level: 1, experience: 0, createdAt: new Date(), updatedAt: new Date(), profileImageUrl: null } as any),
      replyCount: this.memory.forumReplies.filter(r => r.postId === p.id).length,
    })) as any;
  }
  async getTeacherStats(_teacherId: string): Promise<any> { return { activeChallenges: 0, activeStudents: 0, totalSubmissions: 0 }; }
  async getStudentLeaderboard(_limit = 10): Promise<User[]> { return []; }

  async createUser(userData: { email: string; password: string; name: string; role: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [firstName, ...lastNameParts] = userData.name.split(' ');
    const lastName = lastNameParts.join(' ') || '';
    const newUser: User & { password?: string } = {
      id: crypto.randomUUID(),
      email: userData.email,
      firstName,
      lastName,
      role: userData.role as any,
      profileImageUrl: null,
      points: 0,
      level: 1,
      experience: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      password: hashedPassword,
    } as any;
    this.memory.users.push(newUser);
    await this.saveUsersToStorage();
    return newUser as User;
  }

  // Rewards operations
  async createReward(reward: InsertReward): Promise<Reward> {
    const newReward: Reward = {
      id: crypto.randomUUID(),
      title: reward.title,
      description: reward.description,
      rewardLink: reward.rewardLink,
      pointsRequired: reward.pointsRequired,
      teacherId: reward.teacherId,
      isActive: reward.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.memory.rewards.push(newReward);
    return newReward;
  }

  async getRewardsByTeacher(teacherId: string): Promise<Reward[]> {
    return this.memory.rewards
      .filter((r: Reward) => r.teacherId === teacherId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getActiveRewards(): Promise<Reward[]> {
    return this.memory.rewards
      .filter(r => r.isActive)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async updateReward(id: string, updates: Partial<InsertReward>): Promise<Reward> {
    const index = this.memory.rewards.findIndex(r => r.id === id);
    if (index === -1) throw new Error("Reward not found");
    
    this.memory.rewards[index] = {
      ...this.memory.rewards[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.memory.rewards[index];
  }

  async deleteReward(id: string): Promise<void> {
    const index = this.memory.rewards.findIndex(r => r.id === id);
    if (index !== -1) {
      this.memory.rewards.splice(index, 1);
    }
  }

  // User rewards operations
  async redeemReward(userId: string, rewardId: string): Promise<UserReward> {
    const reward = this.memory.rewards.find(r => r.id === rewardId);
    if (!reward) throw new Error("Reward not found");

    const user = this.memory.users.find(u => u.id === userId);
    if (!user) throw new Error("User not found");
    if (user.points < reward.pointsRequired) {
      throw new Error("Insufficient points");
    }

    // Deduct points
    user.points -= reward.pointsRequired;

    const newUserReward: UserReward = {
      id: crypto.randomUUID(),
      userId,
      rewardId,
      redeemedAt: new Date(),
    };
    this.memory.userRewards.push(newUserReward);
    return newUserReward;
  }

  async getUserRewards(userId: string): Promise<(UserReward & { reward: Reward })[]> {
    return this.memory.userRewards
      .filter(ur => ur.userId === userId)
      .map(ur => ({
        ...ur,
        reward: this.memory.rewards.find(r => r.id === ur.rewardId)!
      }))
      .sort((a, b) => (b.redeemedAt?.getTime() || 0) - (a.redeemedAt?.getTime() || 0));
  }

  async getUserPoints(userId: string): Promise<number> {
    const user = this.memory.users.find(u => u.id === userId);
    return user?.points || 0;
  }

  async verifyPassword(_userId: string, _password: string): Promise<boolean> { return false; }
  async verifyPasswordByEmail(email: string, password: string): Promise<boolean> {
    const user = this.memory.users.find(u => u.email === email) as (User & { password?: string });
    if (!user || !user.password) return false;
    return await bcrypt.compare(password, user.password);
  }
}

// Choose storage implementation
let storageImpl: IStorage;

async function initializeStorage() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required. Configure Supabase/PostgreSQL before starting the app.");
  }

  const { db } = await import("./db");
  storageImpl = new DatabaseStorage(db);
}

// Initialize storage
initializeStorage().catch((error) => {
  console.error("Storage initialization failed:", error);
  process.exit(1);
});

export const storage = new Proxy({} as IStorage, {
  get(target, prop) {
    if (storageImpl) {
      return (storageImpl as any)[prop];
    }
    throw new Error("Storage not initialized yet");
  }
});