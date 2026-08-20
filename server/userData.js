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
import fs from "fs/promises";
import path from "path";
var DATA_DIR = path.join(process.cwd(), "server", "user_data");
function ensureDir() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.mkdir(DATA_DIR, { recursive: true })];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function userFilePath(userId) {
    return path.join(DATA_DIR, "".concat(userId, ".json"));
}
export function ensureUserFile(user) {
    return __awaiter(this, void 0, void 0, function () {
        var file, _a, now, initial;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0: return [4 /*yield*/, ensureDir()];
                case 1:
                    _g.sent();
                    file = userFilePath(user.id);
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.access(file)];
                case 3:
                    _g.sent();
                    return [2 /*return*/];
                case 4:
                    _a = _g.sent();
                    return [3 /*break*/, 5];
                case 5:
                    now = new Date().toISOString();
                    initial = {
                        userId: user.id,
                        createdAt: now,
                        profile: {
                            email: (_b = user.email) !== null && _b !== void 0 ? _b : null,
                            firstName: (_c = user.firstName) !== null && _c !== void 0 ? _c : null,
                            lastName: (_d = user.lastName) !== null && _d !== void 0 ? _d : null,
                            role: (_e = user.role) !== null && _e !== void 0 ? _e : null,
                        },
                        state: {
                            challengesJoined: [],
                            submissions: [],
                            posts: [],
                        },
                        events: [
                            { type: "user.created", timestamp: now, payload: { role: (_f = user.role) !== null && _f !== void 0 ? _f : null } },
                        ],
                    };
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(initial, null, 2), "utf8")];
                case 6:
                    _g.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function read(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var file, json, _a, now, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, ensureDir()];
                case 1:
                    _b.sent();
                    file = userFilePath(userId);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, fs.readFile(file, "utf8")];
                case 3:
                    json = _b.sent();
                    return [2 /*return*/, JSON.parse(json)];
                case 4:
                    _a = _b.sent();
                    now = new Date().toISOString();
                    data = {
                        userId: userId,
                        createdAt: now,
                        state: { challengesJoined: [], submissions: [], posts: [] },
                        events: [],
                    };
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(data, null, 2), "utf8")];
                case 5:
                    _b.sent();
                    return [2 /*return*/, data];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function write(userId, data) {
    return __awaiter(this, void 0, void 0, function () {
        var file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    file = userFilePath(userId);
                    return [4 /*yield*/, fs.writeFile(file, JSON.stringify(data, null, 2), "utf8")];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function appendEvent(userId, event) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    data.events.push(event);
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function recordChallengeJoin(userId, challengeId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    now = new Date().toISOString();
                    data.state.challengesJoined.push({ challengeId: challengeId, joinedAt: now });
                    data.events.push({ type: "challenge.joined", timestamp: now, payload: { challengeId: challengeId } });
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function recordSubmission(userId, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var data, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    now = new Date().toISOString();
                    data.state.submissions.push({ id: payload.id, challengeId: payload.challengeId, submittedAt: payload.submittedAt || now });
                    data.events.push({ type: "submission.created", timestamp: now, payload: payload });
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function recordForumPost(userId, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var data, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    now = new Date().toISOString();
                    data.state.posts.push({ id: payload.id, title: payload.title, createdAt: payload.createdAt || now });
                    data.events.push({ type: "forum.post.created", timestamp: now, payload: payload });
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function readUserData(userId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function removeSubmission(userId, submissionId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    now = new Date().toISOString();
                    data.state.submissions = data.state.submissions.filter(function (s) { return s.id !== submissionId; });
                    data.events.push({ type: "submission.deleted", timestamp: now, payload: { id: submissionId } });
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function removeForumPost(userId, postId) {
    return __awaiter(this, void 0, void 0, function () {
        var data, now;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, read(userId)];
                case 1:
                    data = _a.sent();
                    now = new Date().toISOString();
                    data.state.posts = data.state.posts.filter(function (p) { return p.id !== postId; });
                    data.events.push({ type: "forum.post.deleted", timestamp: now, payload: { id: postId } });
                    return [4 /*yield*/, write(userId, data)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
