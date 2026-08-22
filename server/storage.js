var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { users, challenges, submissions, challengeParticipants, achievements, userAchievements, chapters, missions, userProgress, forumPosts, forumReplies, rewards, userRewards, } from "../shared/schema.js";
import { eq, desc, sql } from "drizzle-orm";
import * as bcrypt from "bcrypt";
import crypto from "crypto";
// Database-backed storage (only initialized when DATABASE_URL is present)
var DatabaseStorage = /** @class */ (function () {
    function DatabaseStorage(db) {
        this.db = db;
    }
    // User operations (IMPORTANT - mandatory for Replit Auth)
    DatabaseStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.id, id))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.upsertUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .insert(users)
                            .values(userData)
                            .onConflictDoUpdate({
                            target: users.id,
                            set: __assign(__assign({}, userData), { updatedAt: new Date() }),
                        })
                            .returning()];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.email, email))];
                    case 1:
                        user = (_a.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    DatabaseStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firstName, lastNameParts, lastName, hashedPassword, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = userData.name.split(" "), firstName = _a[0], lastNameParts = _a.slice(1);
                        lastName = lastNameParts.join(" ") || "";
                        return [4 /*yield*/, bcrypt.hash(userData.password, 10)];
                    case 1:
                        hashedPassword = _b.sent();
                        return [4 /*yield*/, this.db
                                .insert(users)
                                .values({
                                email: userData.email,
                                passwordHash: hashedPassword,
                                firstName: firstName,
                                lastName: lastName,
                                role: userData.role,
                            })
                                .returning()];
                    case 2:
                        user = (_b.sent())[0];
                        return [2 /*return*/, user];
                }
            });
        });
    };
    // Challenge operations
    DatabaseStorage.prototype.createChallenge = function (challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var newChallenge;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .insert(challenges)
                            .values(challenge)
                            .returning()];
                    case 1:
                        newChallenge = (_a.sent())[0];
                        return [2 /*return*/, newChallenge];
                }
            });
        });
    };
    DatabaseStorage.prototype.getChallengesByTeacher = function (teacherId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(challenges)
                            .where(eq(challenges.teacherId, teacherId))
                            .orderBy(desc(challenges.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getActiveChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(challenges)
                            .where(eq(challenges.status, "active"))
                            .orderBy(desc(challenges.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateChallenge = function (id, challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .update(challenges)
                            .set(__assign(__assign({}, challenge), { updatedAt: new Date() }))
                            .where(eq(challenges.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Challenge participation
    DatabaseStorage.prototype.joinChallenge = function (challengeId, studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(challengeParticipants).values({
                            challengeId: challengeId,
                            studentId: studentId,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DatabaseStorage.prototype.getChallengeParticipants = function (challengeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(challengeParticipants)
                            .where(eq(challengeParticipants.challengeId, challengeId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getStudentChallenges = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            .where(eq(challengeParticipants.studentId, studentId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Submission operations
    DatabaseStorage.prototype.createSubmission = function (submission) {
        return __awaiter(this, void 0, void 0, function () {
            var newSubmission;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .insert(submissions)
                            .values(submission)
                            .returning()];
                    case 1:
                        newSubmission = (_a.sent())[0];
                        return [2 /*return*/, newSubmission];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSubmissionsByChallenge = function (challengeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            .where(eq(submissions.challengeId, challengeId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getSubmissionsByStudent = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            .where(eq(submissions.studentId, studentId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateSubmission = function (id, submission) {
        return __awaiter(this, void 0, void 0, function () {
            var updated;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .update(submissions)
                            .set(submission)
                            .where(eq(submissions.id, id))
                            .returning()];
                    case 1:
                        updated = (_a.sent())[0];
                        return [2 /*return*/, updated];
                }
            });
        });
    };
    // Achievement operations
    DatabaseStorage.prototype.getAllAchievements = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(achievements)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserAchievements = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            .where(eq(userAchievements.userId, userId))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, results.filter(function (r) { return r.id !== null && r.name !== null && r.description !== null && r.icon !== null && r.category !== null; })];
                }
            });
        });
    };
    DatabaseStorage.prototype.awardAchievement = function (userId, achievementId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(userAchievements).values({
                            userId: userId,
                            achievementId: achievementId,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Adventure mode operations
    DatabaseStorage.prototype.getAllChapters = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(chapters)
                            .orderBy(chapters.orderIndex)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserProgress = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            .where(eq(userProgress.userId, userId))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateUserProgress = function (userId, chapterId, missionId, progress) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(userProgress).values({
                            userId: userId,
                            chapterId: chapterId,
                            missionId: missionId,
                            progress: progress || 0,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Community operations
    DatabaseStorage.prototype.createForumPost = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var newPost;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .insert(forumPosts)
                            .values(post)
                            .returning()];
                    case 1:
                        newPost = (_a.sent())[0];
                        return [2 /*return*/, newPost];
                }
            });
        });
    };
    DatabaseStorage.prototype.getForumPosts = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
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
                            replyCount: sql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["cast(count(", ") as int)"], ["cast(count(", ") as int)"])), forumReplies.id),
                        })
                            .from(forumPosts)
                            .innerJoin(users, eq(forumPosts.userId, users.id))
                            .leftJoin(forumReplies, eq(forumPosts.id, forumReplies.postId))
                            .groupBy(forumPosts.id, users.id)
                            .orderBy(desc(forumPosts.createdAt))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Analytics operations
    DatabaseStorage.prototype.getTeacherStats = function (teacherId) {
        return __awaiter(this, void 0, void 0, function () {
            var challengeCount, studentCount, submissionCount;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select({ count: sql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) })
                            .from(challenges)
                            .where(eq(challenges.teacherId, teacherId))];
                    case 1:
                        challengeCount = _d.sent();
                        return [4 /*yield*/, this.db
                                .select({ count: sql(templateObject_3 || (templateObject_3 = __makeTemplateObject(["cast(count(distinct ", ") as int)"], ["cast(count(distinct ", ") as int)"])), challengeParticipants.studentId) })
                                .from(challengeParticipants)
                                .leftJoin(challenges, eq(challengeParticipants.challengeId, challenges.id))
                                .where(eq(challenges.teacherId, teacherId))];
                    case 2:
                        studentCount = _d.sent();
                        return [4 /*yield*/, this.db
                                .select({ count: sql(templateObject_4 || (templateObject_4 = __makeTemplateObject(["cast(count(*) as int)"], ["cast(count(*) as int)"]))) })
                                .from(submissions)
                                .leftJoin(challenges, eq(submissions.challengeId, challenges.id))
                                .where(eq(challenges.teacherId, teacherId))];
                    case 3:
                        submissionCount = _d.sent();
                        return [2 /*return*/, {
                                activeChallenges: ((_a = challengeCount[0]) === null || _a === void 0 ? void 0 : _a.count) || 0,
                                activeStudents: ((_b = studentCount[0]) === null || _b === void 0 ? void 0 : _b.count) || 0,
                                totalSubmissions: ((_c = submissionCount[0]) === null || _c === void 0 ? void 0 : _c.count) || 0,
                            }];
                }
            });
        });
    };
    DatabaseStorage.prototype.getStudentLeaderboard = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(users)
                            .where(eq(users.role, "student"))
                            .orderBy(desc(users.points), desc(users.experience))
                            .limit(limit)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    // Rewards operations
    DatabaseStorage.prototype.createReward = function (reward) {
        return __awaiter(this, void 0, void 0, function () {
            var newReward;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.insert(rewards).values(__assign({ id: crypto.randomUUID() }, reward)).returning()];
                    case 1:
                        newReward = (_a.sent())[0];
                        return [2 /*return*/, newReward];
                }
            });
        });
    };
    DatabaseStorage.prototype.getRewardsByTeacher = function (teacherId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(rewards)
                            .where(eq(rewards.teacherId, teacherId))
                            .orderBy(desc(rewards.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getActiveRewards = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(rewards)
                            .where(eq(rewards.isActive, true))
                            .orderBy(desc(rewards.createdAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.updateReward = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var updatedReward;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .update(rewards)
                            .set(__assign(__assign({}, updates), { updatedAt: new Date() }))
                            .where(eq(rewards.id, id))
                            .returning()];
                    case 1:
                        updatedReward = (_a.sent())[0];
                        return [2 /*return*/, updatedReward];
                }
            });
        });
    };
    DatabaseStorage.prototype.deleteReward = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.delete(rewards).where(eq(rewards.id, id))];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // User rewards operations
    DatabaseStorage.prototype.redeemReward = function (userId, rewardId) {
        return __awaiter(this, void 0, void 0, function () {
            var reward, user, newUserReward;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1)];
                    case 1:
                        reward = _a.sent();
                        if (!reward[0])
                            throw new Error("Reward not found");
                        return [4 /*yield*/, this.db.select().from(users).where(eq(users.id, userId)).limit(1)];
                    case 2:
                        user = _a.sent();
                        if (!user[0])
                            throw new Error("User not found");
                        if (user[0].points < reward[0].pointsRequired) {
                            throw new Error("Insufficient points");
                        }
                        // Deduct points and create user reward
                        return [4 /*yield*/, this.db.update(users).set({
                                points: user[0].points - reward[0].pointsRequired
                            }).where(eq(users.id, userId))];
                    case 3:
                        // Deduct points and create user reward
                        _a.sent();
                        return [4 /*yield*/, this.db.insert(userRewards).values({
                                id: crypto.randomUUID(),
                                userId: userId,
                                rewardId: rewardId,
                            }).returning()];
                    case 4:
                        newUserReward = (_a.sent())[0];
                        return [2 /*return*/, newUserReward];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserRewards = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db
                            .select()
                            .from(userRewards)
                            .leftJoin(rewards, eq(userRewards.rewardId, rewards.id))
                            .where(eq(userRewards.userId, userId))
                            .orderBy(desc(userRewards.redeemedAt))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.getUserPoints = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.id, userId)).limit(1)];
                    case 1:
                        user = _b.sent();
                        return [2 /*return*/, ((_a = user[0]) === null || _a === void 0 ? void 0 : _a.points) || 0];
                }
            });
        });
    };
    DatabaseStorage.prototype.verifyPassword = function (userId, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.id, userId)).limit(1)];
                    case 1:
                        user = _a.sent();
                        if (!user[0] || !user[0].passwordHash) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user[0].passwordHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    DatabaseStorage.prototype.verifyPasswordByEmail = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.db.select().from(users).where(eq(users.email, email)).limit(1)];
                    case 1:
                        user = _a.sent();
                        if (!user[0] || !user[0].passwordHash) {
                            return [2 /*return*/, false];
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user[0].passwordHash)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return DatabaseStorage;
}());
export { DatabaseStorage };
// In-memory fallback storage for preview/development without a database
var MemoryStorage = /** @class */ (function () {
    function MemoryStorage() {
        this.memory = {
            users: [],
            challenges: [],
            challengeParticipants: [],
            submissions: [],
            achievements: [],
            forumPosts: [],
            forumReplies: [],
            userProgress: [],
            rewards: [],
            userRewards: [],
        };
        this.loadUsersFromStorage();
    }
    MemoryStorage.prototype.loadUsersFromStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fs, path, storageFile, content, data, err_1, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 7, , 8]);
                        return [4 /*yield*/, import('fs/promises')];
                    case 1:
                        fs = _a.sent();
                        return [4 /*yield*/, import('path')];
                    case 2:
                        path = _a.sent();
                        storageFile = path.join(process.cwd(), 'server', 'user_storage.json');
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, fs.readFile(storageFile, 'utf8')];
                    case 4:
                        content = _a.sent();
                        data = JSON.parse(content);
                        this.memory.users = data.users || [];
                        console.log("Loaded ".concat(this.memory.users.length, " users from storage"));
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log('No existing user storage found, starting fresh');
                        return [3 /*break*/, 6];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        console.warn('Failed to load users from storage:', err_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    MemoryStorage.prototype.saveUsersToStorage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fs, path, storageFile, data, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, import('fs/promises')];
                    case 1:
                        fs = _a.sent();
                        return [4 /*yield*/, import('path')];
                    case 2:
                        path = _a.sent();
                        storageFile = path.join(process.cwd(), 'server', 'user_storage.json');
                        data = {
                            users: this.memory.users,
                            lastUpdated: new Date().toISOString()
                        };
                        return [4 /*yield*/, fs.writeFile(storageFile, JSON.stringify(data, null, 2), 'utf8')];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        err_3 = _a.sent();
                        console.warn('Failed to save users to storage:', err_3);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    MemoryStorage.prototype.getUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.users.find(function (u) { return u.id === id; })];
            });
        });
    };
    MemoryStorage.prototype.upsertUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var existing, newUser;
            return __generator(this, function (_a) {
                existing = this.memory.users.find(function (u) { return u.id === user.id; });
                if (existing) {
                    Object.assign(existing, user);
                    return [2 /*return*/, existing];
                }
                newUser = {
                    id: user.id || crypto.randomUUID(),
                    email: user.email || "",
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    profileImageUrl: user.profileImageUrl || null,
                    role: user.role || "student",
                    points: 0,
                    level: 1,
                    experience: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                this.memory.users.push(newUser);
                return [2 /*return*/, newUser];
            });
        });
    };
    MemoryStorage.prototype.getUserByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.users.find(function (u) { return u.email === email; })];
            });
        });
    };
    MemoryStorage.prototype.createChallenge = function (challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var newChallenge;
            return __generator(this, function (_a) {
                newChallenge = __assign({ id: crypto.randomUUID(), status: "active", createdAt: new Date(), updatedAt: new Date() }, challenge);
                this.memory.challenges.push(newChallenge);
                return [2 /*return*/, newChallenge];
            });
        });
    };
    MemoryStorage.prototype.getChallengesByTeacher = function (teacherId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.challenges
                        .filter(function (c) { return c.teacherId === teacherId; })
                        .sort(function (a, b) { var _a, _b, _c, _d; return (((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime) === null || _b === void 0 ? void 0 : _b.call(_a)) || 0) - (((_d = (_c = a.createdAt) === null || _c === void 0 ? void 0 : _c.getTime) === null || _d === void 0 ? void 0 : _d.call(_c)) || 0); })];
            });
        });
    };
    MemoryStorage.prototype.getActiveChallenges = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.challenges
                        .filter(function (c) { return c.status === "active"; })
                        .sort(function (a, b) { var _a, _b, _c, _d; return (((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime) === null || _b === void 0 ? void 0 : _b.call(_a)) || 0) - (((_d = (_c = a.createdAt) === null || _c === void 0 ? void 0 : _c.getTime) === null || _d === void 0 ? void 0 : _d.call(_c)) || 0); })];
            });
        });
    };
    MemoryStorage.prototype.updateChallenge = function (id, challenge) {
        return __awaiter(this, void 0, void 0, function () {
            var index, updated;
            return __generator(this, function (_a) {
                index = this.memory.challenges.findIndex(function (c) { return c.id === id; });
                if (index === -1)
                    return [2 /*return*/, undefined];
                updated = __assign(__assign(__assign({}, this.memory.challenges[index]), challenge), { updatedAt: new Date() });
                this.memory.challenges[index] = updated;
                return [2 /*return*/, updated];
            });
        });
    };
    MemoryStorage.prototype.joinChallenge = function (challengeId, studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var exists;
            return __generator(this, function (_a) {
                exists = this.memory.challengeParticipants.find(function (p) { return p.challengeId === challengeId && p.studentId === studentId; });
                if (exists)
                    return [2 /*return*/];
                this.memory.challengeParticipants.push({
                    id: crypto.randomUUID(),
                    challengeId: challengeId,
                    studentId: studentId,
                    status: "active",
                    progress: 0,
                    joinedAt: new Date(),
                    completedAt: null,
                });
                return [2 /*return*/];
            });
        });
    };
    MemoryStorage.prototype.getChallengeParticipants = function (challengeId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.challengeParticipants.filter(function (p) { return p.challengeId === challengeId; })];
            });
        });
    };
    MemoryStorage.prototype.getStudentChallenges = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.challengeParticipants
                        .filter(function (p) { return p.studentId === studentId; })
                        .map(function (p) { return (__assign(__assign({}, p), { challenge: _this.memory.challenges.find(function (c) { return c.id === p.challengeId; }) })); })
                        .filter(function (item) { return !!item.challenge; })];
            });
        });
    };
    MemoryStorage.prototype.createSubmission = function (_submission) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            throw new Error("Not implemented in memory mode");
        }); });
    };
    MemoryStorage.prototype.getSubmissionsByChallenge = function (_challengeId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.getSubmissionsByStudent = function (_studentId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.updateSubmission = function (_id, _submission) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
        }); });
    };
    MemoryStorage.prototype.getAllAchievements = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.getUserAchievements = function (_userId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.awardAchievement = function (_userId, _achievementId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    MemoryStorage.prototype.getAllChapters = function () {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.getUserProgress = function (_userId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, []];
        }); });
    };
    MemoryStorage.prototype.updateUserProgress = function (_userId, _chapterId, _missionId, _progress) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    MemoryStorage.prototype.createForumPost = function (post) {
        return __awaiter(this, void 0, void 0, function () {
            var newPost;
            var _a;
            return __generator(this, function (_b) {
                newPost = {
                    id: crypto.randomUUID(),
                    userId: post.userId,
                    title: post.title,
                    content: post.content,
                    category: (_a = post.category) !== null && _a !== void 0 ? _a : "general",
                    likes: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                this.memory.forumPosts.push(newPost);
                return [2 /*return*/, newPost];
            });
        });
    };
    MemoryStorage.prototype.getForumPosts = function () {
        return __awaiter(this, arguments, void 0, function (limit) {
            var posts;
            var _this = this;
            if (limit === void 0) { limit = 10; }
            return __generator(this, function (_a) {
                posts = __spreadArray([], this.memory.forumPosts, true).sort(function (a, b) { var _a, _b, _c, _d; return (((_b = (_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime) === null || _b === void 0 ? void 0 : _b.call(_a)) || 0) - (((_d = (_c = a.createdAt) === null || _c === void 0 ? void 0 : _c.getTime) === null || _d === void 0 ? void 0 : _d.call(_c)) || 0); })
                    .slice(0, limit);
                return [2 /*return*/, posts.map(function (p) { return (__assign(__assign({}, p), { user: _this.memory.users.find(function (u) { return u.id === p.userId; }) || { id: p.userId, firstName: "", lastName: "", email: "", role: "student", points: 0, level: 1, experience: 0, createdAt: new Date(), updatedAt: new Date(), profileImageUrl: null }, replyCount: _this.memory.forumReplies.filter(function (r) { return r.postId === p.id; }).length })); })];
            });
        });
    };
    MemoryStorage.prototype.getTeacherStats = function (_teacherId) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, { activeChallenges: 0, activeStudents: 0, totalSubmissions: 0 }];
        }); });
    };
    MemoryStorage.prototype.getStudentLeaderboard = function () {
        return __awaiter(this, arguments, void 0, function (_limit) {
            if (_limit === void 0) { _limit = 10; }
            return __generator(this, function (_a) {
                return [2 /*return*/, []];
            });
        });
    };
    MemoryStorage.prototype.createUser = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            var hashedPassword, _a, firstName, lastNameParts, lastName, newUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, bcrypt.hash(userData.password, 10)];
                    case 1:
                        hashedPassword = _b.sent();
                        _a = userData.name.split(' '), firstName = _a[0], lastNameParts = _a.slice(1);
                        lastName = lastNameParts.join(' ') || '';
                        newUser = {
                            id: crypto.randomUUID(),
                            email: userData.email,
                            firstName: firstName,
                            lastName: lastName,
                            role: userData.role,
                            profileImageUrl: null,
                            points: 0,
                            level: 1,
                            experience: 0,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            password: hashedPassword,
                        };
                        this.memory.users.push(newUser);
                        return [4 /*yield*/, this.saveUsersToStorage()];
                    case 2:
                        _b.sent();
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    // Rewards operations
    MemoryStorage.prototype.createReward = function (reward) {
        return __awaiter(this, void 0, void 0, function () {
            var newReward;
            var _a;
            return __generator(this, function (_b) {
                newReward = {
                    id: crypto.randomUUID(),
                    title: reward.title,
                    description: reward.description,
                    rewardLink: reward.rewardLink,
                    pointsRequired: reward.pointsRequired,
                    teacherId: reward.teacherId,
                    isActive: (_a = reward.isActive) !== null && _a !== void 0 ? _a : true,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                this.memory.rewards.push(newReward);
                return [2 /*return*/, newReward];
            });
        });
    };
    MemoryStorage.prototype.getRewardsByTeacher = function (teacherId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.rewards
                        .filter(function (r) { return r.teacherId === teacherId; })
                        .sort(function (a, b) { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); })];
            });
        });
    };
    MemoryStorage.prototype.getActiveRewards = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.rewards
                        .filter(function (r) { return r.isActive; })
                        .sort(function (a, b) { var _a, _b; return (((_a = b.createdAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.createdAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); })];
            });
        });
    };
    MemoryStorage.prototype.updateReward = function (id, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                index = this.memory.rewards.findIndex(function (r) { return r.id === id; });
                if (index === -1)
                    throw new Error("Reward not found");
                this.memory.rewards[index] = __assign(__assign(__assign({}, this.memory.rewards[index]), updates), { updatedAt: new Date() });
                return [2 /*return*/, this.memory.rewards[index]];
            });
        });
    };
    MemoryStorage.prototype.deleteReward = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                index = this.memory.rewards.findIndex(function (r) { return r.id === id; });
                if (index !== -1) {
                    this.memory.rewards.splice(index, 1);
                }
                return [2 /*return*/];
            });
        });
    };
    // User rewards operations
    MemoryStorage.prototype.redeemReward = function (userId, rewardId) {
        return __awaiter(this, void 0, void 0, function () {
            var reward, user, newUserReward;
            return __generator(this, function (_a) {
                reward = this.memory.rewards.find(function (r) { return r.id === rewardId; });
                if (!reward)
                    throw new Error("Reward not found");
                user = this.memory.users.find(function (u) { return u.id === userId; });
                if (!user)
                    throw new Error("User not found");
                if (user.points < reward.pointsRequired) {
                    throw new Error("Insufficient points");
                }
                // Deduct points
                user.points -= reward.pointsRequired;
                newUserReward = {
                    id: crypto.randomUUID(),
                    userId: userId,
                    rewardId: rewardId,
                    redeemedAt: new Date(),
                };
                this.memory.userRewards.push(newUserReward);
                return [2 /*return*/, newUserReward];
            });
        });
    };
    MemoryStorage.prototype.getUserRewards = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, this.memory.userRewards
                        .filter(function (ur) { return ur.userId === userId; })
                        .map(function (ur) { return (__assign(__assign({}, ur), { reward: _this.memory.rewards.find(function (r) { return r.id === ur.rewardId; }) })); })
                        .sort(function (a, b) { var _a, _b; return (((_a = b.redeemedAt) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) - (((_b = a.redeemedAt) === null || _b === void 0 ? void 0 : _b.getTime()) || 0); })];
            });
        });
    };
    MemoryStorage.prototype.getUserPoints = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = this.memory.users.find(function (u) { return u.id === userId; });
                return [2 /*return*/, (user === null || user === void 0 ? void 0 : user.points) || 0];
            });
        });
    };
    MemoryStorage.prototype.verifyPassword = function (_userId, _password) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, false];
        }); });
    };
    MemoryStorage.prototype.verifyPasswordByEmail = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = this.memory.users.find(function (u) { return u.email === email; });
                        if (!user || !user.password)
                            return [2 /*return*/, false];
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return MemoryStorage;
}());
// Choose storage implementation
var storageImpl;
function initializeStorage() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.DATABASE_URL) {
                        throw new Error("DATABASE_URL is required. Configure Supabase/PostgreSQL before starting the app.");
                    }
                    return [4 /*yield*/, import("./db")];
                case 1:
                    db = (_a.sent()).db;
                    storageImpl = new DatabaseStorage(db);
                    return [2 /*return*/];
            }
        });
    });
}
// Initialize storage
initializeStorage().catch(function (error) {
    console.error("Storage initialization failed:", error);
    process.exit(1);
});
export var storage = new Proxy({}, {
    get: function (target, prop) {
        if (storageImpl) {
            return storageImpl[prop];
        }
        throw new Error("Storage not initialized yet");
    }
});
var templateObject_1, templateObject_2, templateObject_3, templateObject_4;
