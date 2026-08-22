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
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage.js";
if (!process.env.REPLIT_DOMAINS && process.env.USE_REPLIT_AUTH === "true") {
    throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, client.discovery(new URL((_a = process.env.ISSUER_URL) !== null && _a !== void 0 ? _a : "https://replit.com/oidc"), process.env.REPL_ID)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    });
}); }, { maxAge: 3600 * 1000 });
export function getSession() {
    var sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
    var pgStore = connectPg(session);
    var sessionStore = new pgStore({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: false,
        ttl: sessionTtl,
        tableName: "sessions",
    });
    return session({
        secret: process.env.SESSION_SECRET || "eco-ed-session-secret",
        store: sessionStore,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: sessionTtl,
        },
    });
}
function updateUserSession(user, tokens) {
    var _a;
    user.claims = tokens.claims();
    user.access_token = tokens.access_token;
    user.refresh_token = tokens.refresh_token;
    user.expires_at = (_a = user.claims) === null || _a === void 0 ? void 0 : _a.exp;
}
function upsertUser(claims) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storage.upsertUser({
                        id: claims["sub"],
                        email: claims["email"],
                        firstName: claims["first_name"],
                        lastName: claims["last_name"],
                        profileImageUrl: claims["profile_image_url"],
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function setupAuth(app) {
    return __awaiter(this, void 0, void 0, function () {
        var config, verify, _i, _a, domain, strategy;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (process.env.USE_REPLIT_AUTH !== "true") {
                        return [2 /*return*/];
                    }
                    app.set("trust proxy", 1);
                    app.use(getSession());
                    app.use(passport.initialize());
                    app.use(passport.session());
                    return [4 /*yield*/, getOidcConfig()];
                case 1:
                    config = _b.sent();
                    verify = function (tokens, verified) { return __awaiter(_this, void 0, void 0, function () {
                        var user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    user = {};
                                    updateUserSession(user, tokens);
                                    return [4 /*yield*/, upsertUser(tokens.claims())];
                                case 1:
                                    _a.sent();
                                    verified(null, user);
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    for (_i = 0, _a = process.env
                        .REPLIT_DOMAINS.split(","); _i < _a.length; _i++) {
                        domain = _a[_i];
                        strategy = new Strategy({
                            name: "replitauth:".concat(domain),
                            config: config,
                            scope: "openid email profile offline_access",
                            callbackURL: "https://".concat(domain, "/api/callback"),
                        }, verify);
                        passport.use(strategy);
                    }
                    passport.serializeUser(function (user, cb) { return cb(null, user); });
                    passport.deserializeUser(function (user, cb) { return cb(null, user); });
                    app.get("/api/login", function (req, res, next) {
                        passport.authenticate("replitauth:".concat(req.hostname), {
                            prompt: "login consent",
                            scope: ["openid", "email", "profile", "offline_access"],
                        })(req, res, next);
                    });
                    app.get("/api/callback", function (req, res, next) {
                        passport.authenticate("replitauth:".concat(req.hostname), {
                            successReturnToOrRedirect: "/",
                            failureRedirect: "/api/login",
                        })(req, res, next);
                    });
                    app.get("/api/logout", function (req, res) {
                        req.logout(function () {
                            res.redirect(client.buildEndSessionUrl(config, {
                                client_id: process.env.REPL_ID,
                                post_logout_redirect_uri: "".concat(req.protocol, "://").concat(req.hostname),
                            }).href);
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
export var isAuthenticated = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, now, refreshToken, config, tokenResponse, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                if (!req.isAuthenticated() || !user.expires_at) {
                    return [2 /*return*/, res.status(401).json({ message: "Unauthorized" })];
                }
                now = Math.floor(Date.now() / 1000);
                if (now <= user.expires_at) {
                    return [2 /*return*/, next()];
                }
                refreshToken = user.refresh_token;
                if (!refreshToken) {
                    res.status(401).json({ message: "Unauthorized" });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, getOidcConfig()];
            case 2:
                config = _a.sent();
                return [4 /*yield*/, client.refreshTokenGrant(config, refreshToken)];
            case 3:
                tokenResponse = _a.sent();
                updateUserSession(user, tokenResponse);
                return [2 /*return*/, next()];
            case 4:
                error_1 = _a.sent();
                res.status(401).json({ message: "Unauthorized" });
                return [2 /*return*/];
            case 5: return [2 /*return*/];
        }
    });
}); };
