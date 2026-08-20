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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import CreateChallengeModal from "@/components/teacher/CreateChallengeModal";
import RewardsManagement from "@/components/teacher/RewardsManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default function TeacherDashboard() {
    var _this = this;
    var _a = useAuth(), user = _a.user, isAuthenticated = _a.isAuthenticated, isLoading = _a.isLoading;
    var toast = useToast().toast;
    var queryClient = useQueryClient();
    var _b = useState("overview"), activeSection = _b[0], setActiveSection = _b[1];
    var _c = useState(false), showCreateModal = _c[0], setShowCreateModal = _c[1];
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
    var _d = useQuery({
        queryKey: ["/api/challenges/teacher"],
        enabled: isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "teacher",
    }).data, challenges = _d === void 0 ? [] : _d;
    var analytics = useQuery({
        queryKey: ["/api/analytics/teacher"],
        enabled: isAuthenticated && (user === null || user === void 0 ? void 0 : user.role) === "teacher",
    }).data;
    if (isLoading || !isAuthenticated) {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teacher-primary"></div>
      </div>);
    }
    if ((user === null || user === void 0 ? void 0 : user.role) !== "teacher") {
        return (<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This area is for teachers only.</p>
        </div>
      </div>);
    }
    var renderOverview = function () { return (<div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome">
            Welcome back, {user.firstName || 'Teacher'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening in your environmental education classroom</p>
        </div>
        <Button onClick={function () { return setShowCreateModal(true); }} className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-create-challenge">
          <i className="fas fa-plus mr-2"></i>
          Create Challenge
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Students</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-active-students">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.activeStudents) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Challenges</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-active-challenges">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.activeChallenges) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-tasks text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Submissions</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-submissions">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.totalSubmissions) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clipboard-list text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Engagement</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-engagement">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.avgEngagement) || '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-line text-orange-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {challenges.length === 0 ? (<div className="text-center py-8">
              <p className="text-gray-500">No recent activity. Create your first challenge to get started!</p>
            </div>) : (<div className="space-y-4">
              {challenges.slice(0, 5).map(function (challenge) { return (<div key={challenge.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-tasks text-green-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{challenge.title}</p>
                    <p className="text-sm text-gray-600">
                      Status: {challenge.status} • Created {challenge.createdAt ? new Date(challenge.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>); })}
            </div>)}
        </CardContent>
      </Card>
    </div>); };
    var renderStudents = function () { return (<div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-2">Monitor student progress and engagement</p>
        </div>
        <Button className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-add-student" onClick={function () {
            window.location.href = "/signup?role=student";
        }}>
          <i className="fas fa-plus mr-2"></i>
          Add Student
        </Button>
      </div>

      {/* Student Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-total-students">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.activeStudents) || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active This Week</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-active-weekly">
                  {Math.round(((analytics === null || analytics === void 0 ? void 0 : analytics.activeStudents) || 0) * 0.8)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-user-check text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Participation</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-avg-participation">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.avgEngagement) || '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-chart-pie text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <i className="fas fa-users text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No students enrolled yet</h3>
            <p className="text-gray-500 mb-4">Students will appear here when they join your challenges</p>
            <Button className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-invite-students" onClick={function () { return __awaiter(_this, void 0, void 0, function () {
            var url, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        url = "".concat(window.location.origin, "/signup?role=student");
                        return [4 /*yield*/, navigator.clipboard.writeText(url)];
                    case 1:
                        _a.sent();
                        toast({
                            title: "Invite link copied",
                            description: "Share the link with students to sign up.",
                        });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _a.sent();
                        toast({
                            title: "Unable to copy",
                            description: "Copy this link: /signup?role=student",
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); }}>
              <i className="fas fa-envelope mr-2"></i>
              Invite Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>); };
    var renderAnalytics = function () {
        var _a;
        return (<div className="teacher-theme">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Detailed insights into your classroom performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Challenge Completion</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-completion-rate">
                  {(analytics === null || analytics === void 0 ? void 0 : analytics.avgEngagement) || '0%'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg. Time per Challenge</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-avg-time">
                  2.5h
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-clock text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Most Popular Challenge</p>
                <p className="text-lg font-bold text-gray-900" data-testid="text-popular-challenge">
                  Eco Challenge
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-star text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Points Awarded</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-points-awarded">
                  {((analytics === null || analytics === void 0 ? void 0 : analytics.totalSubmissions) || 0) * 50}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-trophy text-orange-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Student Progress Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <i className="fas fa-chart-line text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-500">Progress chart will appear here</p>
                <p className="text-sm text-gray-400">When you have student data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Challenge Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <i className="fas fa-chart-bar text-gray-400 text-4xl mb-2"></i>
                <p className="text-gray-500">Performance metrics will appear here</p>
                <p className="text-sm text-gray-400">Based on challenge completion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {((_a = analytics === null || analytics === void 0 ? void 0 : analytics.totalSubmissions) !== null && _a !== void 0 ? _a : 0) > 0 ? (<div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-check text-green-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Challenge Completed</p>
                  <p className="text-sm text-gray-600">Student completed "Eco Challenge" • 2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-plus text-blue-600"></i>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">New Submission</p>
                  <p className="text-sm text-gray-600">Student submitted work for review • 3 hours ago</p>
                </div>
              </div>
            </div>) : (<div className="text-center py-8">
              <i className="fas fa-activity text-gray-300 text-4xl mb-2"></i>
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Activity will appear when students engage with challenges</p>
            </div>)}
        </CardContent>
      </Card>
    </div>);
    };
    var renderCommunity = function () { return (<div className="teacher-theme">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Management</h1>
        <p className="text-gray-600">Moderate discussions and foster collaboration</p>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Forum Posts</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-forum-posts">
                  0
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-comments text-blue-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Active Discussions</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-active-discussions">
                  0
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-users text-green-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Community Score</p>
                <p className="text-3xl font-bold text-gray-900" data-testid="text-community-score">
                  N/A
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-heart text-purple-600"></i>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Management Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Forum Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No forum posts yet</h3>
              <p className="text-gray-500 mb-4">Students haven't started any discussions</p>
              <Button className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-start-discussion" onClick={function () { window.location.href = '/discussions'; }}>
                <i className="fas fa-plus mr-2"></i>
                Start Discussion
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <i className="fas fa-shield-alt text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items to moderate</h3>
              <p className="text-gray-500">All community content is appropriate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Guidelines */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Community Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <i className="fas fa-check-circle text-green-600 mr-2"></i>
                Encouraged Behavior
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Share environmental tips and experiences</li>
                <li>• Support fellow students in their eco-journey</li>
                <li>• Ask questions about sustainability</li>
                <li>• Celebrate achievements and milestones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 flex items-center">
                <i className="fas fa-times-circle text-red-600 mr-2"></i>
                Community Rules
              </h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Be respectful and kind to all members</li>
                <li>• Stay on topic with environmental themes</li>
                <li>• No spam or inappropriate content</li>
                <li>• Report any concerning behavior</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>); };
    var renderChallenges = function () { return (<div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Challenges</h1>
          <p className="text-gray-600 mt-2">Create and monitor environmental challenges for your students</p>
        </div>
        <Button onClick={function () { return setShowCreateModal(true); }} className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-new-challenge">
          <i className="fas fa-plus mr-2"></i>
          New Challenge
        </Button>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length === 0 ? (<div className="col-span-full text-center py-12">
            <i className="fas fa-tasks text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges yet</h3>
            <p className="text-gray-500 mb-4">Create your first environmental challenge to engage students</p>
            <Button onClick={function () { return setShowCreateModal(true); }} className="bg-teacher-primary hover:bg-teacher-dark text-white" data-testid="button-create-first-challenge">
              Create Challenge
            </Button>
          </div>) : (challenges.map(function (challenge) { return (<Card key={challenge.id} className="challenge-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-recycle text-green-600"></i>
                  </div>
                  <span className={"px-3 py-1 rounded-full text-sm font-medium ".concat(challenge.status === 'active'
                ? 'bg-green-100 text-green-800'
                : challenge.status === 'draft'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-blue-100 text-blue-800')}>
                    {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid={"text-challenge-title-".concat(challenge.id)}>
                  {challenge.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span><i className="fas fa-users mr-1"></i> 0 participants</span>
                  <span><i className="fas fa-star mr-1"></i> {challenge.points} points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Duration: {challenge.duration} days
                  </span>
                  <button className="text-teacher-primary hover:text-teacher-dark" data-testid={"button-edit-challenge-".concat(challenge.id)}>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </CardContent>
            </Card>); }))}
      </div>
    </div>); };
    return (<div className="min-h-screen teacher-theme">
      <div className="flex">
        <TeacherSidebar user={user} activeSection={activeSection} onSectionChange={setActiveSection}/>
        
        <main className="ml-64 flex-1 bg-background">
          <div className="p-8">
            {activeSection === "overview" && renderOverview()}
            {activeSection === "challenges" && renderChallenges()}
            {activeSection === "students" && renderStudents()}
            {activeSection === "analytics" && renderAnalytics()}
            {activeSection === "community" && renderCommunity()}
            {activeSection === "rewards" && <RewardsManagement />}
          </div>
        </main>
      </div>

      <CreateChallengeModal open={showCreateModal} onOpenChange={setShowCreateModal}/>
    </div>);
}
