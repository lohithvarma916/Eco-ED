import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import CreateChallengeModal from "@/components/teacher/CreateChallengeModal";
import RewardsManagement from "@/components/teacher/RewardsManagement";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Challenge } from "@shared/schema";

export default function TeacherDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "Please log in to continue",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: challenges = [] } = useQuery<Challenge[]>({
    queryKey: ["/api/challenges/teacher"],
    enabled: isAuthenticated && user?.role === "teacher",
  });

  const { data: analytics } = useQuery<{activeStudents: number; activeChallenges: number; totalSubmissions: number; avgEngagement: string}>({
    queryKey: ["/api/analytics/teacher"],
    enabled: isAuthenticated && user?.role === "teacher",
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teacher-primary"></div>
      </div>
    );
  }

  if (user?.role !== "teacher") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This area is for teachers only.</p>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" data-testid="text-welcome">
            Welcome back, {user.firstName || 'Teacher'}!
          </h1>
          <p className="text-gray-600 mt-2">Here's what's happening in your environmental education classroom</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-teacher-primary hover:bg-teacher-dark text-white"
          data-testid="button-create-challenge"
        >
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
                  {analytics?.activeStudents || 0}
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
                  {analytics?.activeChallenges || 0}
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
                  {analytics?.totalSubmissions || 0}
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
                  {analytics?.avgEngagement || '0%'}
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
          {challenges.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity. Create your first challenge to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.slice(0, 5).map((challenge) => (
                <div key={challenge.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-tasks text-green-600"></i>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{challenge.title}</p>
                    <p className="text-sm text-gray-600">
                      Status: {challenge.status} • Created {challenge.createdAt ? new Date(challenge.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStudents = () => (
    <div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-2">Monitor student progress and engagement</p>
        </div>
        <Button
          className="bg-teacher-primary hover:bg-teacher-dark text-white"
          data-testid="button-add-student"
          onClick={() => {
            window.location.href = "/signup?role=student";
          }}
        >
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
                  {analytics?.activeStudents || 0}
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
                  {Math.round((analytics?.activeStudents || 0) * 0.8)}
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
                  {analytics?.avgEngagement || '0%'}
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
            <Button
              className="bg-teacher-primary hover:bg-teacher-dark text-white"
              data-testid="button-invite-students"
              onClick={async () => {
                try {
                  const url = `${window.location.origin}/signup?role=student`;
                  await navigator.clipboard.writeText(url);
                  toast({
                    title: "Invite link copied",
                    description: "Share the link with students to sign up.",
                  });
                } catch (e) {
                  toast({
                    title: "Unable to copy",
                    description: "Copy this link: /signup?role=student",
                  });
                }
              }}
            >
              <i className="fas fa-envelope mr-2"></i>
              Invite Students
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="teacher-theme">
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
                  {analytics?.avgEngagement || '0%'}
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
                  {(analytics?.totalSubmissions || 0) * 50}
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
          {(analytics?.totalSubmissions ?? 0) > 0 ? (
            <div className="space-y-4">
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
            </div>
          ) : (
            <div className="text-center py-8">
              <i className="fas fa-activity text-gray-300 text-4xl mb-2"></i>
              <p className="text-gray-500">No recent activity</p>
              <p className="text-sm text-gray-400">Activity will appear when students engage with challenges</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderCommunity = () => (
    <div className="teacher-theme">
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
              <Button
                className="bg-teacher-primary hover:bg-teacher-dark text-white"
                data-testid="button-start-discussion"
                onClick={() => { window.location.href = '/discussions'; }}
              >
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
    </div>
  );

  const renderChallenges = () => (
    <div className="teacher-theme">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Challenges</h1>
          <p className="text-gray-600 mt-2">Create and monitor environmental challenges for your students</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-teacher-primary hover:bg-teacher-dark text-white"
          data-testid="button-new-challenge"
        >
          <i className="fas fa-plus mr-2"></i>
          New Challenge
        </Button>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <i className="fas fa-tasks text-gray-300 text-6xl mb-4"></i>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No challenges yet</h3>
            <p className="text-gray-500 mb-4">Create your first environmental challenge to engage students</p>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-teacher-primary hover:bg-teacher-dark text-white"
              data-testid="button-create-first-challenge"
            >
              Create Challenge
            </Button>
          </div>
        ) : (
          challenges.map((challenge) => (
            <Card key={challenge.id} className="challenge-card hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-recycle text-green-600"></i>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    challenge.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : challenge.status === 'draft'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2" data-testid={`text-challenge-title-${challenge.id}`}>
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
                  <button 
                    className="text-teacher-primary hover:text-teacher-dark"
                    data-testid={`button-edit-challenge-${challenge.id}`}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen teacher-theme">
      <div className="flex">
        <TeacherSidebar
          user={user}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
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

      <CreateChallengeModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
