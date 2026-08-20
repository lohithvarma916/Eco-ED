import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated as replitIsAuthenticated } from "./replitAuth"; // Renamed to avoid conflict
import { insertChallengeSchema, insertSubmissionSchema, insertForumPostSchema } from "@shared/schema";
import { ensureUserFile, recordChallengeJoin, recordSubmission, recordForumPost, readUserData } from "./userData";
import { z } from "zod";
import type { RequestHandler } from 'express'; // Import RequestHandler type

// Custom authentication middleware
const customIsAuthenticated: RequestHandler = async (req: any, res, next) => {
  const userId = req.session?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(userId);
  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = { claims: { sub: userId } };
  next();
};

// Custom login and signup routes
async function setupCustomAuth(app: Express) {
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { email, password, firstName, lastName, role } = req.body;
      console.log('Signup request body:', req.body); // Debug log
      
      if (!email || !password || !firstName || !lastName || !role) {
        console.log('Missing fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName, role: !!role });
        return res.status(400).json({ message: 'All fields are required' });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const name = `${firstName} ${lastName}`.trim();
      const newUser = await storage.createUser({ email, password, name, role });
      await ensureUserFile({
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      });
      
      // Set up session
      req.session.userId = newUser.id;
      
      res.status(201).json({ 
        message: 'User created successfully', 
        user: { 
          id: newUser.id, 
          name: `${newUser.firstName} ${newUser.lastName}`.trim(), 
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role 
        } 
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Verify password using email-based method
      const passwordMatch = await storage.verifyPasswordByEmail(email, password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      res.json({ 
        message: 'Login successful', 
        user: { 
          id: user.id, 
          name: `${user.firstName} ${user.lastName}`.trim(), 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  // Endpoint to check if the user is currently logged in
  app.get('/api/auth/check', async (req: any, res) => {
    try {
      const userId = req.session?.userId;
      console.log('Auth check - Session userId:', userId);
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      console.log('Auth check - User found:', user ? 'Yes' : 'No');
      
      if (!user) {
        return res.status(404).json({ message: "User not found after authentication" });
      }
      
      res.json({ 
        isLoggedIn: true, 
        user: { 
          id: user.id, 
          name: `${user.firstName} ${user.lastName}`.trim(), 
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role 
        } 
      });
    } catch (error) {
      console.error("Error checking auth status:", error);
      res.status(500).json({ message: "Failed to check authentication status" });
    }
  });
}


export async function registerRoutes(app: Express): Promise<Server> {
  // Setup custom auth routes first
  await setupCustomAuth(app);

  // Auth routes (keeping original for potential future use or if needed for other parts)
  // The original /api/auth/user route now uses customIsAuthenticated
  app.get('/api/auth/user', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Challenge routes
  app.post('/api/challenges', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create challenges" });
      }

      const validatedData = insertChallengeSchema.parse({
        ...req.body,
        teacherId: userId,
      });

      const challenge = await storage.createChallenge(validatedData);
      res.json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(400).json({ message: "Failed to create challenge" });
    }
  });

  app.get('/api/challenges/teacher', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const challenges = await storage.getChallengesByTeacher(userId);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching teacher challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/challenges/active', customIsAuthenticated, async (req: any, res) => {
    try {
      const challenges = await storage.getActiveChallenges();
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching active challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/challenges/student', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const challenges = await storage.getStudentChallenges(userId);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching student challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.post('/api/challenges/:id/join', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const challengeId = req.params.id;

      await storage.joinChallenge(challengeId, userId);
      await recordChallengeJoin(userId, challengeId);
      res.json({ message: "Successfully joined challenge" });
    } catch (error) {
      console.error("Error joining challenge:", error);
      res.status(400).json({ message: "Failed to join challenge" });
    }
  });

  // Submission routes
  app.post('/api/submissions', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const validatedData = insertSubmissionSchema.parse({
        ...req.body,
        studentId: userId,
      });

      const submission = await storage.createSubmission(validatedData);
      await recordSubmission(userId, { id: submission.id, challengeId: submission.challengeId, submittedAt: String(submission.submittedAt || '') });
      res.json(submission);
    } catch (error) {
      console.error("Error creating submission:", error);
      res.status(400).json({ message: "Failed to create submission" });
    }
  });

  app.get('/api/submissions/challenge/:challengeId', customIsAuthenticated, async (req: any, res) => {
    try {
      const challengeId = req.params.challengeId;
      const submissions = await storage.getSubmissionsByChallenge(challengeId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  app.get('/api/submissions/student', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const submissions = await storage.getSubmissionsByStudent(userId);
      res.json(submissions);
    } catch (error) {
      console.error("Error fetching student submissions:", error);
      res.status(500).json({ message: "Failed to fetch submissions" });
    }
  });

  // Achievement routes
  app.get('/api/achievements', customIsAuthenticated, async (req: any, res) => {
    try {
      const achievements = await storage.getAllAchievements();
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get('/api/achievements/user', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching user achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Adventure mode routes
  app.get('/api/chapters', customIsAuthenticated, async (req: any, res) => {
    try {
      const chapters = await storage.getAllChapters();
      res.json(chapters);
    } catch (error) {
      console.error("Error fetching chapters:", error);
      res.status(500).json({ message: "Failed to fetch chapters" });
    }
  });

  app.get('/api/progress', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  // Community routes
  app.post('/api/forum/posts', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;

      const validatedData = insertForumPostSchema.parse({
        ...req.body,
        userId,
      });

      const post = await storage.createForumPost(validatedData);
      await recordForumPost(userId, { id: post.id, title: post.title, createdAt: String(post.createdAt || '') });
      res.json(post);
    } catch (error) {
      console.error("Error creating forum post:", error);
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.get('/api/forum/posts', customIsAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const posts = await storage.getForumPosts(limit);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/teacher', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);

      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can view analytics" });
      }

      const stats = await storage.getTeacherStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching teacher analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  app.get('/api/leaderboard', customIsAuthenticated, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getStudentLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // Per-user data view endpoint
  app.get('/api/user/data', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = await readUserData(userId);
      res.json(data);
    } catch (error) {
      console.error("Error reading user data file:", error);
      res.status(500).json({ message: "Failed to read user data" });
    }
  });

  // User overview with challenge buckets
  app.get('/api/user/overview', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const userData = await readUserData(userId);

      // For students, compute challenge buckets relative to active challenges
      const activeChallenges = await storage.getActiveChallenges();
      const studentJoins = await storage.getStudentChallenges(userId);

      const joinedIds = new Set(studentJoins.map(j => j.challengeId));
      const notAccessed = activeChallenges.filter(c => !joinedIds.has(c.id));
      const accepted = studentJoins
        .filter(j => (j.status === 'active' || (j.progress ?? 0) < 100) && j.challenge)
        .map(j => ({ ...j }));
      const completed = studentJoins
        .filter(j => j.status === 'completed' || (j.progress ?? 0) >= 100)
        .map(j => ({ ...j }));

      // For teachers, include their created challenges
      const teacherCreated = user.role === 'teacher'
        ? await storage.getChallengesByTeacher(userId)
        : [];

      res.json({
        user: { id: user.id, role: user.role, name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() },
        userData,
        challenges: {
          notAccessed,
          accepted,
          completed,
          teacherCreated,
        },
      });
    } catch (error) {
      console.error('Error building user overview:', error);
      res.status(500).json({ message: 'Failed to build user overview' });
    }
  });

  // Rewards routes
  app.post('/api/rewards', customIsAuthenticated, async (req: any, res) => {
    try {
      const { title, description, rewardLink, pointsRequired } = req.body;
      
      if (!title || !description || !rewardLink || !pointsRequired) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const teacherId = req.user.claims.sub;
      if (!teacherId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const reward = await storage.createReward({
        title,
        description,
        rewardLink,
        pointsRequired: parseInt(pointsRequired),
        teacherId,
      });

      res.status(201).json(reward);
    } catch (error) {
      console.error("Error creating reward:", error);
      res.status(500).json({ error: "Failed to create reward" });
    }
  });

  app.get('/api/rewards/teacher', customIsAuthenticated, async (req: any, res) => {
    try {
      const teacherId = req.user.claims.sub;
      if (!teacherId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const rewards = await storage.getRewardsByTeacher(teacherId);
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching teacher rewards:", error);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  app.get('/api/rewards/active', customIsAuthenticated, async (req: any, res) => {
    try {
      const rewards = await storage.getActiveRewards();
      res.json(rewards);
    } catch (error) {
      console.error("Error fetching active rewards:", error);
      res.status(500).json({ error: "Failed to fetch rewards" });
    }
  });

  app.put('/api/rewards/:id', customIsAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const teacherId = req.user.claims.sub;
      if (!teacherId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const reward = await storage.updateReward(id, updates);
      res.json(reward);
    } catch (error) {
      console.error("Error updating reward:", error);
      res.status(500).json({ error: "Failed to update reward" });
    }
  });

  app.delete('/api/rewards/:id', customIsAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      const teacherId = req.user.claims.sub;
      if (!teacherId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await storage.deleteReward(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting reward:", error);
      res.status(500).json({ error: "Failed to delete reward" });
    }
  });

  // User rewards routes
  app.post('/api/rewards/:id/redeem', customIsAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userReward = await storage.redeemReward(userId, id);
      res.status(201).json(userReward);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      if (error.message === "Insufficient points") {
        return res.status(400).json({ error: "Insufficient points" });
      }
      res.status(500).json({ error: "Failed to redeem reward" });
    }
  });

  app.get('/api/rewards/user', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userRewards = await storage.getUserRewards(userId);
      res.json(userRewards);
    } catch (error) {
      console.error("Error fetching user rewards:", error);
      res.status(500).json({ error: "Failed to fetch user rewards" });
    }
  });

  app.get('/api/user/points', customIsAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const points = await storage.getUserPoints(userId);
      res.json({ points });
    } catch (error) {
      console.error("Error fetching user points:", error);
      res.status(500).json({ error: "Failed to fetch user points" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}