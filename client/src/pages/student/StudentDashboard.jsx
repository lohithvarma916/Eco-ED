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
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import StudentSidebar from "@/components/student/StudentSidebar";
import AdventureMode from "@/components/student/AdventureMode";
import CommunityHub from "@/components/community/CommunityHub";
import ChallengeDetail from "@/components/student/ChallengeDetail";
import StudentRewards from "@/components/student/StudentRewards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
export default function StudentDashboard() {
    var _this = this;
    var _a, _b, _c;
    var _d = useAuth(), user = _d.user, isAuthenticated = _d.isAuthenticated, isLoading = _d.isLoading;
    var toast = useToast().toast;
    var _e = useState("dashboard"), activeSection = _e[0], setActiveSection = _e[1];
    var _f = useState(null), selectedChallenge = _f[0], setSelectedChallenge = _f[1];
    var _g = useState(null), selectedParticipation = _g[0], setSelectedParticipation = _g[1];
    var queryClient = useQueryClient();
    useEffect(function () {
        if (!isLoading && !isAuthenticated) {
            toast({
                title: "Unauthorized",
                description: "Please log in to continue",
                variant: "destructive",
            });
            setTimeout(function () {
                window.location.href = "/login";
            }, 500);
            return;
        }
    }, [isAuthenticated, isLoading, toast]);
    var _h = useQuery({
        queryKey: ["/api/challenges/student"],
        enabled: isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "student",
    }).data, challenges = _h === void 0 ? [] : _h;
    var _j = useQuery({
        queryKey: ["/api/challenges/active"],
        enabled: isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "student",
    }).data, activeChallenges = _j === void 0 ? [] : _j;
    var _k = useQuery({
        queryKey: ["/api/achievements/user"],
        enabled: isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "student",
    }).data, achievements = _k === void 0 ? [] : _k;
    var _l = useMutation({
        mutationFn: function (challengeId) { return __awaiter(_this, void 0, void 0, function () {
            var res, msg;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch("/api/challenges/".concat(challengeId, "/join"), {
                            method: "POST",
                            credentials: "include",
                        })];
                    case 1:
                        res = _b.sent();
                        if (!!res.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, res.json().catch(function () { return ({}); })];
                    case 2:
                        msg = ((_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a.message) || res.statusText;
                        throw new Error(msg);
                    case 3: return [2 /*return*/, res.json()];
                }
            });
        }); },
        onSuccess: function () {
            toast({ title: "Joined challenge", description: "Challenge added to your active list." });
            queryClient.invalidateQueries({ queryKey: ["/api/challenges/student"] });
            queryClient.invalidateQueries({ queryKey: ["/api/challenges/active"] });
        },
        onError: function (err) {
            toast({ title: "Join failed", description: String((err === null || err === void 0 ? void 0 : err.message) || err), variant: "destructive" });
        },
    }), joinChallenge = _l.mutate, isJoining = _l.isPending;
    if (isLoading || !isAuthenticated) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-student-primary"></div>
      </div>);
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "student") {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This area is for students only.</p>
        </div>
      </div>);
    }
    var renderDashboard = function () { return (<div className="student-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome-student">
            Welcome back, {user.firstName || 'Student'}!
          </h1>
          <p className="text-gray-600 mt-2">Ready to continue your environmental journey?</p>
        </div>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-coins text-yellow-600"></i>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Points</p>
              <p className="text-xl font-bold" data-testid="text-total-points">
                {user.points || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.length === 0 && activeChallenges.length === 0 ? (<div className="col-span-full text-center py-12">
              <i className="fas fa-tasks text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges available</h3>
              <p className="text-gray-500">Check back later for new environmental challenges!</p>
            </div>) : (<>
              {challenges.map(function (participation) { return (<Card key={participation.id} className="challenge-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-recycle text-green-600"></i>
                      </div>
                      <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                        In Progress
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{participation.challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{participation.challenge.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>Progress</span>
                        <span>{participation.progress}/100%</span>
                      </div>
                      <Progress value={participation.progress} className="h-2"/>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span><i className="fas fa-star mr-1"></i> {participation.challenge.points} points</span>
                      <span>Duration: {participation.challenge.duration} days</span>
                    </div>
                    <Button className="w-full bg-student-primary hover:bg-student-dark text-white" data-testid={"button-continue-challenge-".concat(participation.id)} onClick={function () {
                    setSelectedChallenge(participation.challenge);
                    setSelectedParticipation(participation);
                    setActiveSection("challenge-detail");
                }}>
                      Continue Challenge
                    </Button>
                  </CardContent>
                </Card>); })}
              
              {activeChallenges.slice(0, 2).map(function (challenge) { return (<Card key={challenge.id} className="challenge-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-water text-blue-600"></i>
                      </div>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Available
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <span><i className="fas fa-star mr-1"></i> {challenge.points} points</span>
                      <span>Duration: {challenge.duration} days</span>
                    </div>
                    <Button className="w-full bg-student-primary hover:bg-student-dark text-white" data-testid={"button-start-challenge-".concat(challenge.id)} disabled={isJoining} onClick={function () { return joinChallenge(challenge.id); }}>
                      {isJoining ? "Joining..." : "Start Challenge"}
                    </Button>
                  </CardContent>
                </Card>); })}
            </>)}
        </div>
      </div>

      {/* Adventure Mode Preview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Continue Your Adventure</h2>
        <Card className="story-card p-6">
          <div className="flex items-center space-x-4">
            <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=150" alt="Forest adventure path" className="w-32 h-24 rounded-lg object-cover"/>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Chapter 3: Forest Guardians</h3>
              <p className="text-gray-600 mb-3">
                Discover the secrets of forest ecosystems and learn how to protect biodiversity in your local area.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Progress: 2/5 missions completed</span>
                <Button className="bg-student-primary hover:bg-student-dark text-white" onClick={function () { return setActiveSection("adventure"); }} data-testid="button-continue-adventure">
                  Continue Adventure
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.length === 0 ? (<div className="col-span-full text-center py-8">
              <p className="text-gray-500">Complete challenges to earn achievements!</p>
            </div>) : (achievements.slice(0, 4).map(function (achievement) { return (<Card key={achievement.id} className="p-4 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3 badge-shimmer">
                  <i className={"".concat(achievement.icon, " text-white text-xl")}></i>
                </div>
                <h4 className="font-semibold text-sm" data-testid={"text-achievement-".concat(achievement.id)}>
                  {achievement.name}
                </h4>
                <p className="text-xs text-gray-600">{achievement.description}</p>
              </Card>); }))}
        </div>
      </div>
    </div>); };
    return (<div className="min-h-screen student-theme">
      <div className="flex">
        <StudentSidebar user={user} activeSection={activeSection} onSectionChange={setActiveSection}/>
        
        <main className="ml-64 flex-1 bg-background">
          <div className="p-8">
            {activeSection === "dashboard" && renderDashboard()}
            {activeSection === "challenges" && (<div className="student-theme">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">All Challenges</h1>
                    <p className="text-gray-600">Discover and join environmental challenges</p>
                  </div>
                </div>

                {/* Active Challenges */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Your Active Challenges</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {challenges.length === 0 ? (<div className="col-span-full text-center py-8">
                        <i className="fas fa-tasks text-gray-300 text-6xl mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No active challenges</h3>
                        <p className="text-gray-500">Join a challenge below to get started!</p>
                      </div>) : (challenges.map(function (participation) { return (<Card key={participation.id} className="challenge-card hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-recycle text-green-600"></i>
                              </div>
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                                In Progress
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{participation.challenge.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{participation.challenge.description}</p>
                            <div className="mb-4">
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span>Progress</span>
                                <span>{participation.progress}/100%</span>
                              </div>
                              <Progress value={participation.progress} className="h-2"/>
                            </div>
                            <Button className="w-full bg-student-primary hover:bg-student-dark text-white" onClick={function () {
                    setSelectedChallenge(participation.challenge);
                    setSelectedParticipation(participation);
                    setActiveSection("challenge-detail");
                }}>
                              Continue Challenge
                            </Button>
                          </CardContent>
                        </Card>); }))}
                  </div>
                </div>

                {/* Available Challenges */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Available Challenges</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeChallenges.length === 0 ? (<div className="col-span-full text-center py-8">
                        <i className="fas fa-plus-circle text-gray-300 text-6xl mb-4"></i>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges available</h3>
                        <p className="text-gray-500">Check back later for new environmental challenges!</p>
                      </div>) : (activeChallenges.map(function (challenge) { return (<Card key={challenge.id} className="challenge-card hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <i className="fas fa-leaf text-blue-600"></i>
                              </div>
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                Available
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{challenge.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                              <span><i className="fas fa-star mr-1"></i> {challenge.points} points</span>
                              <span>Duration: {challenge.duration} days</span>
                            </div>
                            <Button className="w-full bg-student-primary hover:bg-student-dark text-white" onClick={function () {
                    setSelectedChallenge(challenge);
                    setSelectedParticipation(null);
                    setActiveSection("challenge-detail");
                }}>
                              View Challenge
                            </Button>
                          </CardContent>
                        </Card>); }))}
                  </div>
                </div>
              </div>)}
            {activeSection === "adventure" && <AdventureMode />}
            {activeSection === "challenge-detail" && selectedChallenge && (<ChallengeDetail challenge={selectedChallenge} participation={selectedParticipation || undefined} onBack={function () { return setActiveSection("challenges"); }}/>)}
            {activeSection === "leaderboard" && (<div className="student-theme">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
                    <p className="text-gray-600">See how you rank among environmental champions</p>
                  </div>
                </div>

                {/* Your Rank Card */}
                <Card className="p-6 mb-8 bg-gradient-to-r from-student-light to-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-student-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">
                          {((_a = user === null || user === void 0 ? void 0 : user.firstName) === null || _a === void 0 ? void 0 : _a.charAt(0)) || 'S'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Your Rank</h3>
                        <p className="text-gray-600">
                          {(user === null || user === void 0 ? void 0 : user.firstName) ? "".concat(user.firstName, " ").concat(user.lastName || '').trim() : 'Student'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-student-primary">#--</div>
                      <div className="text-sm text-gray-600">{user.points || 0} points</div>
                    </div>
                  </div>
                </Card>

                {/* Top Students */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <i className="fas fa-trophy text-yellow-500"></i>
                      <span>Top Environmental Champions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Placeholder leaderboard data */}
                      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border">
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Eco Warrior #1</p>
                          <p className="text-sm text-gray-600">1,250 points • Level 8</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-crown text-yellow-500"></i>
                          <span className="font-semibold text-yellow-600">Champion</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Green Guardian</p>
                          <p className="text-sm text-gray-600">980 points • Level 7</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-4 bg-orange-50 rounded-lg">
                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">Nature Protector</p>
                          <p className="text-sm text-gray-600">875 points • Level 6</p>
                        </div>
                      </div>

                      <div className="text-center py-4 text-gray-500">
                        Complete more challenges to climb the leaderboard!
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>)}
            {activeSection === "community" && <CommunityHub />}
            {activeSection === "rewards" && <StudentRewards />}
            {activeSection === "profile" && (<div className="student-theme">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
                  <p className="text-gray-600">Manage your environmental journey</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Profile Info */}
                  <div className="lg:col-span-1">
                    <Card className="p-6">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-student-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-white text-3xl font-bold">
                            {((_b = user === null || user === void 0 ? void 0 : user.firstName) === null || _b === void 0 ? void 0 : _b.charAt(0)) || ((_c = user === null || user === void 0 ? void 0 : user.email) === null || _c === void 0 ? void 0 : _c.charAt(0)) || 'S'}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">
                          {(user === null || user === void 0 ? void 0 : user.firstName) ? "".concat(user.firstName, " ").concat(user.lastName || '').trim() : 'Student'}
                        </h3>
                        <p className="text-gray-600 mb-4">{user === null || user === void 0 ? void 0 : user.email}</p>
                        <div className="bg-student-light rounded-lg p-3">
                          <p className="text-sm text-gray-600">Level</p>
                          <p className="text-2xl font-bold text-student-primary">{(user === null || user === void 0 ? void 0 : user.level) || 1}</p>
                          <p className="text-xs text-gray-500">Eco Warrior</p>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="p-6 mt-6">
                      <h4 className="font-semibold mb-4">Quick Stats</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Points</span>
                          <span className="font-semibold">{(user === null || user === void 0 ? void 0 : user.points) || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience</span>
                          <span className="font-semibold">{(user === null || user === void 0 ? void 0 : user.experience) || 0} XP</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Challenges</span>
                          <span className="font-semibold">{challenges.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Achievements</span>
                          <span className="font-semibold">{achievements.length}</span>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Profile Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Progress Overview */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Progress Overview</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <i className="fas fa-check text-green-600"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Completed</p>
                              <p className="text-xl font-bold text-green-600">
                                {challenges.filter(function (c) { return c.progress === 100; }).length}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <i className="fas fa-clock text-blue-600"></i>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">In Progress</p>
                              <p className="text-xl font-bold text-blue-600">
                                {challenges.filter(function (c) { return c.progress > 0 && c.progress < 100; }).length}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>

                    {/* Recent Achievements */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Recent Achievements</h4>
                      {achievements.length === 0 ? (<div className="text-center py-8">
                          <i className="fas fa-medal text-gray-300 text-4xl mb-3"></i>
                          <p className="text-gray-500">Complete challenges to earn achievements!</p>
                        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {achievements.slice(0, 4).map(function (achievement) { return (<div key={achievement.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <i className={"".concat(achievement.icon, " text-yellow-600")}></i>
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{achievement.name}</p>
                                <p className="text-xs text-gray-600">{achievement.description}</p>
                              </div>
                            </div>); })}
                        </div>)}
                    </Card>

                    {/* Account Settings */}
                    <Card className="p-6">
                      <h4 className="text-lg font-semibold mb-4">Account Settings</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Name
                          </label>
                          <div className="text-gray-600">
                            {(user === null || user === void 0 ? void 0 : user.firstName) ? "".concat(user.firstName, " ").concat(user.lastName || '').trim() : (user === null || user === void 0 ? void 0 : user.email) || 'Student'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <div className="text-gray-600">{user === null || user === void 0 ? void 0 : user.email}</div>
                        </div>
                        <div className="pt-4 border-t">
                          <Button variant="outline" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
                var response, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, fetch('/api/auth/logout', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })];
                        case 1:
                            response = _a.sent();
                            if (response.ok) {
                                window.location.href = '/';
                            }
                            else {
                                console.error('Logout failed');
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            error_1 = _a.sent();
                            console.error('Logout error:', error_1);
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }} className="text-red-600 border-red-200 hover:bg-red-50">
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            Logout
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>)}
          </div>
        </main>
      </div>
    </div>);
}
