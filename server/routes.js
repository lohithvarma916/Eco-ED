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
import { createServer } from "http";
import { storage } from "./storage.js";
import { insertChallengeSchema, insertSubmissionSchema, insertForumPostSchema } from "../shared/schema.js";
// Custom authentication middleware
var customIsAuthenticated = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                return [4 /*yield*/, storage.getUser(userId)];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                req.user = { claims: { sub: userId } };
                next();
                return [2 /*return*/];
        }
    });
}); };
// Custom login and signup routes
function setupCustomAuth(app) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            app.post('/api/auth/signup', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, email, password, firstName, lastName, role, existingUser, name_1, newUser, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            _a = req.body, email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, role = _a.role;
                            console.log('Signup request body:', req.body); // Debug log
                            if (!email || !password || !firstName || !lastName || !role) {
                                console.log('Missing fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName, role: !!role });
                                return [2 /*return*/, res.status(400).json({ message: 'All fields are required' })];
                            }
                            return [4 /*yield*/, storage.getUserByEmail(email)];
                        case 1:
                            existingUser = _b.sent();
                            if (existingUser) {
                                return [2 /*return*/, res.status(409).json({ message: 'User already exists' })];
                            }
                            name_1 = "".concat(firstName, " ").concat(lastName).trim();
                            return [4 /*yield*/, storage.createUser({ email: email, password: password, name: name_1, role: role })];
                        case 2:
                            newUser = _b.sent();
                            // Set up session
                            req.session.userId = newUser.id;
                            res.status(201).json({
                                message: 'User created successfully',
                                user: {
                                    id: newUser.id,
                                    name: "".concat(newUser.firstName, " ").concat(newUser.lastName).trim(),
                                    firstName: newUser.firstName,
                                    lastName: newUser.lastName,
                                    role: newUser.role
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _b.sent();
                            console.error('Signup error:', error_1);
                            res.status(500).json({ message: 'Signup failed' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/auth/login', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var _a, email, password, user, passwordMatch, error_2;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            _a = req.body, email = _a.email, password = _a.password;
                            if (!email || !password) {
                                return [2 /*return*/, res.status(400).json({ message: 'Email and password are required' })];
                            }
                            return [4 /*yield*/, storage.getUserByEmail(email)];
                        case 1:
                            user = _b.sent();
                            if (!user) {
                                return [2 /*return*/, res.status(401).json({ message: 'Invalid credentials' })];
                            }
                            return [4 /*yield*/, storage.verifyPasswordByEmail(email, password)];
                        case 2:
                            passwordMatch = _b.sent();
                            if (!passwordMatch) {
                                return [2 /*return*/, res.status(401).json({ message: 'Invalid credentials' })];
                            }
                            req.session.userId = user.id;
                            res.json({
                                message: 'Login successful',
                                user: {
                                    id: user.id,
                                    name: "".concat(user.firstName, " ").concat(user.lastName).trim(),
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role
                                }
                            });
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _b.sent();
                            console.error('Login error:', error_2);
                            res.status(500).json({ message: 'Login failed' });
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/auth/logout', function (req, res) {
                req.session.destroy(function (err) {
                    if (err) {
                        console.error('Logout error:', err);
                        return res.status(500).json({ message: 'Logout failed' });
                    }
                    res.json({ message: 'Logout successful' });
                });
            });
            // Endpoint to check if the user is currently logged in
            app.get('/api/auth/check', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var userId, user, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            userId = (_a = req.session) === null || _a === void 0 ? void 0 : _a.userId;
                            console.log('Auth check - Session userId:', userId);
                            if (!userId) {
                                return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                            }
                            return [4 /*yield*/, storage.getUser(userId)];
                        case 1:
                            user = _b.sent();
                            console.log('Auth check - User found:', user ? 'Yes' : 'No');
                            if (!user) {
                                return [2 /*return*/, res.status(404).json({ message: "User not found after authentication" })];
                            }
                            res.json({
                                isLoggedIn: true,
                                user: {
                                    id: user.id,
                                    name: "".concat(user.firstName, " ").concat(user.lastName).trim(),
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role
                                }
                            });
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _b.sent();
                            console.error("Error checking auth status:", error_3);
                            res.status(500).json({ message: "Failed to check authentication status" });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            return [2 /*return*/];
        });
    });
}
export function registerRoutes(app) {
    return __awaiter(this, void 0, void 0, function () {
        var httpServer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Setup custom auth routes first
                return [4 /*yield*/, setupCustomAuth(app)];
                case 1:
                    // Setup custom auth routes first
                    _a.sent();
                    // Auth routes (keeping original for potential future use or if needed for other parts)
                    // The original /api/auth/user route now uses customIsAuthenticated
                    app.get('/api/auth/user', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, user, error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUser(userId)];
                                case 1:
                                    user = _a.sent();
                                    res.json(user);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_4 = _a.sent();
                                    console.error("Error fetching user:", error_4);
                                    res.status(500).json({ message: "Failed to fetch user" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Challenge routes
                    app.post('/api/challenges', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, user, validatedData, challenge, error_5;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUser(userId)];
                                case 1:
                                    user = _a.sent();
                                    if (!user || user.role !== 'teacher') {
                                        return [2 /*return*/, res.status(403).json({ message: "Only teachers can create challenges" })];
                                    }
                                    validatedData = insertChallengeSchema.parse(__assign(__assign({}, req.body), { teacherId: userId }));
                                    return [4 /*yield*/, storage.createChallenge(validatedData)];
                                case 2:
                                    challenge = _a.sent();
                                    res.json(challenge);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_5 = _a.sent();
                                    console.error("Error creating challenge:", error_5);
                                    res.status(400).json({ message: "Failed to create challenge" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/challenges/teacher', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, challenges, error_6;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getChallengesByTeacher(userId)];
                                case 1:
                                    challenges = _a.sent();
                                    res.json(challenges);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_6 = _a.sent();
                                    console.error("Error fetching teacher challenges:", error_6);
                                    res.status(500).json({ message: "Failed to fetch challenges" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/challenges/active', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var challenges, error_7;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getActiveChallenges()];
                                case 1:
                                    challenges = _a.sent();
                                    res.json(challenges);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_7 = _a.sent();
                                    console.error("Error fetching active challenges:", error_7);
                                    res.status(500).json({ message: "Failed to fetch challenges" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/challenges/student', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, challenges, error_8;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getStudentChallenges(userId)];
                                case 1:
                                    challenges = _a.sent();
                                    res.json(challenges);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_8 = _a.sent();
                                    console.error("Error fetching student challenges:", error_8);
                                    res.status(500).json({ message: "Failed to fetch challenges" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/api/challenges/:id/join', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, challengeId, error_9;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    challengeId = req.params.id;
                                    return [4 /*yield*/, storage.joinChallenge(challengeId, userId)];
                                case 1:
                                    _a.sent();
                                    res.json({ message: "Successfully joined challenge" });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_9 = _a.sent();
                                    console.error("Error joining challenge:", error_9);
                                    res.status(400).json({ message: "Failed to join challenge" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Submission routes
                    app.post('/api/submissions', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, validatedData, submission, error_10;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    validatedData = insertSubmissionSchema.parse(__assign(__assign({}, req.body), { studentId: userId }));
                                    return [4 /*yield*/, storage.createSubmission(validatedData)];
                                case 1:
                                    submission = _a.sent();
                                    res.json(submission);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_10 = _a.sent();
                                    console.error("Error creating submission:", error_10);
                                    res.status(400).json({ message: "Failed to create submission" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/submissions/challenge/:challengeId', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var challengeId, submissions, error_11;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    challengeId = req.params.challengeId;
                                    return [4 /*yield*/, storage.getSubmissionsByChallenge(challengeId)];
                                case 1:
                                    submissions = _a.sent();
                                    res.json(submissions);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_11 = _a.sent();
                                    console.error("Error fetching submissions:", error_11);
                                    res.status(500).json({ message: "Failed to fetch submissions" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/submissions/student', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, submissions, error_12;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getSubmissionsByStudent(userId)];
                                case 1:
                                    submissions = _a.sent();
                                    res.json(submissions);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_12 = _a.sent();
                                    console.error("Error fetching student submissions:", error_12);
                                    res.status(500).json({ message: "Failed to fetch submissions" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Achievement routes
                    app.get('/api/achievements', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var achievements, error_13;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getAllAchievements()];
                                case 1:
                                    achievements = _a.sent();
                                    res.json(achievements);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_13 = _a.sent();
                                    console.error("Error fetching achievements:", error_13);
                                    res.status(500).json({ message: "Failed to fetch achievements" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/achievements/user', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, achievements, error_14;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUserAchievements(userId)];
                                case 1:
                                    achievements = _a.sent();
                                    res.json(achievements);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_14 = _a.sent();
                                    console.error("Error fetching user achievements:", error_14);
                                    res.status(500).json({ message: "Failed to fetch achievements" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Adventure mode routes
                    app.get('/api/chapters', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var chapters, error_15;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getAllChapters()];
                                case 1:
                                    chapters = _a.sent();
                                    res.json(chapters);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_15 = _a.sent();
                                    console.error("Error fetching chapters:", error_15);
                                    res.status(500).json({ message: "Failed to fetch chapters" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/progress', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, progress, error_16;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUserProgress(userId)];
                                case 1:
                                    progress = _a.sent();
                                    res.json(progress);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_16 = _a.sent();
                                    console.error("Error fetching user progress:", error_16);
                                    res.status(500).json({ message: "Failed to fetch progress" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Community routes
                    app.post('/api/forum/posts', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, validatedData, post, error_17;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    validatedData = insertForumPostSchema.parse(__assign(__assign({}, req.body), { userId: userId }));
                                    return [4 /*yield*/, storage.createForumPost(validatedData)];
                                case 1:
                                    post = _a.sent();
                                    res.json(post);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_17 = _a.sent();
                                    console.error("Error creating forum post:", error_17);
                                    res.status(400).json({ message: "Failed to create post" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/forum/posts', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, posts, error_18;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 10;
                                    return [4 /*yield*/, storage.getForumPosts(limit)];
                                case 1:
                                    posts = _a.sent();
                                    res.json(posts);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_18 = _a.sent();
                                    console.error("Error fetching forum posts:", error_18);
                                    res.status(500).json({ message: "Failed to fetch posts" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Analytics routes
                    app.get('/api/analytics/teacher', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, user, stats, error_19;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUser(userId)];
                                case 1:
                                    user = _a.sent();
                                    if (!user || user.role !== 'teacher') {
                                        return [2 /*return*/, res.status(403).json({ message: "Only teachers can view analytics" })];
                                    }
                                    return [4 /*yield*/, storage.getTeacherStats(userId)];
                                case 2:
                                    stats = _a.sent();
                                    res.json(stats);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_19 = _a.sent();
                                    console.error("Error fetching teacher analytics:", error_19);
                                    res.status(500).json({ message: "Failed to fetch analytics" });
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/leaderboard', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var limit, leaderboard, error_20;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    limit = parseInt(req.query.limit) || 10;
                                    return [4 /*yield*/, storage.getStudentLeaderboard(limit)];
                                case 1:
                                    leaderboard = _a.sent();
                                    res.json(leaderboard);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_20 = _a.sent();
                                    console.error("Error fetching leaderboard:", error_20);
                                    res.status(500).json({ message: "Failed to fetch leaderboard" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // User overview with challenge buckets
                    app.get('/api/user/overview', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, user, activeChallenges, studentJoins, joinedIds_1, notAccessed, accepted, completed, teacherCreated, _a, error_21;
                        var _b, _c;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 7, , 8]);
                                    userId = req.user.claims.sub;
                                    return [4 /*yield*/, storage.getUser(userId)];
                                case 1:
                                    user = _d.sent();
                                    if (!user) {
                                        return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                                    }
                                    return [4 /*yield*/, storage.getActiveChallenges()];
                                case 2:
                                    activeChallenges = _d.sent();
                                    return [4 /*yield*/, storage.getStudentChallenges(userId)];
                                case 3:
                                    studentJoins = _d.sent();
                                    joinedIds_1 = new Set(studentJoins.map(function (j) { return j.challengeId; }));
                                    notAccessed = activeChallenges.filter(function (c) { return !joinedIds_1.has(c.id); });
                                    accepted = studentJoins
                                        .filter(function (j) { var _a; return (j.status === 'active' || ((_a = j.progress) !== null && _a !== void 0 ? _a : 0) < 100) && j.challenge; })
                                        .map(function (j) { return (__assign({}, j)); });
                                    completed = studentJoins
                                        .filter(function (j) { var _a; return j.status === 'completed' || ((_a = j.progress) !== null && _a !== void 0 ? _a : 0) >= 100; })
                                        .map(function (j) { return (__assign({}, j)); });
                                    if (!(user.role === 'teacher')) return [3 /*break*/, 5];
                                    return [4 /*yield*/, storage.getChallengesByTeacher(userId)];
                                case 4:
                                    _a = _d.sent();
                                    return [3 /*break*/, 6];
                                case 5:
                                    _a = [];
                                    _d.label = 6;
                                case 6:
                                    teacherCreated = _a;
                                    res.json({
                                        user: { id: user.id, role: user.role, name: "".concat((_b = user.firstName) !== null && _b !== void 0 ? _b : '', " ").concat((_c = user.lastName) !== null && _c !== void 0 ? _c : '').trim() },
                                        challenges: {
                                            notAccessed: notAccessed,
                                            accepted: accepted,
                                            completed: completed,
                                            teacherCreated: teacherCreated,
                                        },
                                    });
                                    return [3 /*break*/, 8];
                                case 7:
                                    error_21 = _d.sent();
                                    console.error('Error building user overview:', error_21);
                                    res.status(500).json({ message: 'Failed to build user overview' });
                                    return [3 /*break*/, 8];
                                case 8: return [2 /*return*/];
                            }
                        });
                    }); });
                    // Rewards routes
                    app.post('/api/rewards', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, title, description, rewardLink, pointsRequired, teacherId, reward, error_22;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    _a = req.body, title = _a.title, description = _a.description, rewardLink = _a.rewardLink, pointsRequired = _a.pointsRequired;
                                    if (!title || !description || !rewardLink || !pointsRequired) {
                                        return [2 /*return*/, res.status(400).json({ error: "Missing required fields" })];
                                    }
                                    teacherId = req.user.claims.sub;
                                    if (!teacherId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.createReward({
                                            title: title,
                                            description: description,
                                            rewardLink: rewardLink,
                                            pointsRequired: parseInt(pointsRequired),
                                            teacherId: teacherId,
                                        })];
                                case 1:
                                    reward = _b.sent();
                                    res.status(201).json(reward);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_22 = _b.sent();
                                    console.error("Error creating reward:", error_22);
                                    res.status(500).json({ error: "Failed to create reward" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/rewards/teacher', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var teacherId, rewards, error_23;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    teacherId = req.user.claims.sub;
                                    if (!teacherId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.getRewardsByTeacher(teacherId)];
                                case 1:
                                    rewards = _a.sent();
                                    res.json(rewards);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_23 = _a.sent();
                                    console.error("Error fetching teacher rewards:", error_23);
                                    res.status(500).json({ error: "Failed to fetch rewards" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/rewards/active', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var rewards, error_24;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, storage.getActiveRewards()];
                                case 1:
                                    rewards = _a.sent();
                                    res.json(rewards);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_24 = _a.sent();
                                    console.error("Error fetching active rewards:", error_24);
                                    res.status(500).json({ error: "Failed to fetch rewards" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.put('/api/rewards/:id', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, updates, teacherId, reward, error_25;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    updates = req.body;
                                    teacherId = req.user.claims.sub;
                                    if (!teacherId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.updateReward(id, updates)];
                                case 1:
                                    reward = _a.sent();
                                    res.json(reward);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_25 = _a.sent();
                                    console.error("Error updating reward:", error_25);
                                    res.status(500).json({ error: "Failed to update reward" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.delete('/api/rewards/:id', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, teacherId, error_26;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    teacherId = req.user.claims.sub;
                                    if (!teacherId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.deleteReward(id)];
                                case 1:
                                    _a.sent();
                                    res.status(204).send();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_26 = _a.sent();
                                    console.error("Error deleting reward:", error_26);
                                    res.status(500).json({ error: "Failed to delete reward" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    // User rewards routes
                    app.post('/api/rewards/:id/redeem', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var id, userId, userReward, error_27, message;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    id = req.params.id;
                                    userId = req.user.claims.sub;
                                    if (!userId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.redeemReward(userId, id)];
                                case 1:
                                    userReward = _a.sent();
                                    res.status(201).json(userReward);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_27 = _a.sent();
                                    console.error("Error redeeming reward:", error_27);
                                    message = error_27 instanceof Error ? error_27.message : String(error_27);
                                    if (message === "Insufficient points") {
                                        return [2 /*return*/, res.status(400).json({ error: "Insufficient points" })];
                                    }
                                    res.status(500).json({ error: "Failed to redeem reward" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/rewards/user', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, userRewards, error_28;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    if (!userId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.getUserRewards(userId)];
                                case 1:
                                    userRewards = _a.sent();
                                    res.json(userRewards);
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_28 = _a.sent();
                                    console.error("Error fetching user rewards:", error_28);
                                    res.status(500).json({ error: "Failed to fetch user rewards" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    app.get('/api/user/points', customIsAuthenticated, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var userId, points, error_29;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    userId = req.user.claims.sub;
                                    if (!userId) {
                                        return [2 /*return*/, res.status(401).json({ error: "Unauthorized" })];
                                    }
                                    return [4 /*yield*/, storage.getUserPoints(userId)];
                                case 1:
                                    points = _a.sent();
                                    res.json({ points: points });
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_29 = _a.sent();
                                    console.error("Error fetching user points:", error_29);
                                    res.status(500).json({ error: "Failed to fetch user points" });
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                    httpServer = createServer(app);
                    return [2 /*return*/, httpServer];
            }
        });
    });
}
