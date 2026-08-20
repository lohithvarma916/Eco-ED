import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ForumPost, User } from "@shared/schema";

export default function CommunityHub() {
  const { data: forumPosts = [] } = useQuery<(ForumPost & { user: User; replyCount: number })[]>({
    queryKey: ["/api/forum/posts"],
  });

  const { data: leaderboard = [] } = useQuery<User[]>({
    queryKey: ["/api/leaderboard"],
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
        <p className="text-gray-600">Connect with fellow eco-warriors and share your journey</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Forum Posts */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Discussions</h2>
              <Button 
                className="bg-student-primary hover:bg-student-dark text-white"
                data-testid="button-new-post"
                onClick={() => { window.location.href = '/discussions'; }}
              >
                <i className="fas fa-plus mr-2"></i>New Post
              </Button>
            </div>
            
            {forumPosts.length === 0 ? (
              <div className="text-center py-12">
                <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
                <p className="text-gray-500 mb-4">Be the first to start a conversation!</p>
                <Button 
                  className="bg-student-primary hover:bg-student-dark text-white"
                  data-testid="button-start-discussion"
                  onClick={() => { window.location.href = '/discussions'; }}
                >
                  Start Discussion
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {forumPosts.map((post) => (
                  <div key={post.id} className="border-b pb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {post.user?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold" data-testid={`text-post-author-${post.id}`}>
                            {post.user.firstName ? `${post.user.firstName} ${post.user.lastName || ''}`.trim() : 'Anonymous'}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        <h3 className="font-semibold mb-2" data-testid={`text-post-title-${post.id}`}>
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{post.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <button className="hover:text-student-primary" data-testid={`button-like-post-${post.id}`}>
                            <i className="fas fa-thumbs-up mr-1"></i>{post.likes} likes
                          </button>
                          <button className="hover:text-student-primary" data-testid={`button-reply-post-${post.id}`}>
                            <i className="fas fa-comment mr-1"></i>{post.replyCount || 0} replies
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        
        {/* Leaderboard Sidebar */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">This Week's Leaders</h3>
            {leaderboard.length === 0 ? (
              <div className="text-center py-6">
                <i className="fas fa-trophy text-gray-300 text-4xl mb-2"></i>
                <p className="text-gray-500 text-sm">No rankings yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                    }`}>
                      <span className="text-white text-sm font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm" data-testid={`text-leader-name-${index}`}>
                        {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Student'}
                      </p>
                      <p className="text-xs text-gray-600">{user.points || 0} points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
          
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Trending Challenges</h3>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm">Zero Waste Week</h4>
                <p className="text-xs text-gray-600">Popular challenge</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm">Plant a Tree</h4>
                <p className="text-xs text-gray-600">Community favorite</p>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm">Energy Saver</h4>
                <p className="text-xs text-gray-600">Active this week</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
