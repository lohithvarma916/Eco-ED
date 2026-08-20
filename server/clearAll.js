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
import { db, pool } from "./db";
import { users, challenges, submissions, challengeParticipants, achievements, userAchievements, chapters, missions, userProgress, forumPosts, forumReplies, } from "@shared/schema";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 12, 13, 17]);
                    console.log("Starting database wipe (preserving sessions)...");
                    // Delete in dependency-safe order (children -> parents)
                    return [4 /*yield*/, db.delete(forumReplies)];
                case 1:
                    // Delete in dependency-safe order (children -> parents)
                    _b.sent();
                    return [4 /*yield*/, db.delete(forumPosts)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, db.delete(userAchievements)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, db.delete(submissions)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, db.delete(challengeParticipants)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, db.delete(userProgress)];
                case 6:
                    _b.sent();
                    return [4 /*yield*/, db.delete(missions)];
                case 7:
                    _b.sent();
                    return [4 /*yield*/, db.delete(chapters)];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, db.delete(achievements)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, db.delete(challenges)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, db.delete(users)];
                case 11:
                    _b.sent();
                    console.log("All application tables cleared. Sessions table preserved.");
                    process.exit(0);
                    return [3 /*break*/, 17];
                case 12:
                    err_1 = _b.sent();
                    console.error("Failed to wipe database:", err_1);
                    process.exit(1);
                    return [3 /*break*/, 17];
                case 13:
                    _b.trys.push([13, 15, , 16]);
                    return [4 /*yield*/, pool.end()];
                case 14:
                    _b.sent();
                    return [3 /*break*/, 16];
                case 15:
                    _a = _b.sent();
                    return [3 /*break*/, 16];
                case 16: return [7 /*endfinally*/];
                case 17: return [2 /*return*/];
            }
        });
    });
}
main();
