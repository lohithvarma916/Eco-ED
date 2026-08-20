import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ForumPost, User } from "@shared/schema";

export default function Discussions() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: forumPosts = [], isLoading } = useQuery<(ForumPost & { user: User; replyCount: number })[]>({
    queryKey: ["/api/forum/posts"],
  });

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/forum/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content }),
      });
      if (!res.ok) {
        const msg = (await res.json().catch(() => ({})))?.message || res.statusText;
        throw new Error(msg);
      }
      return res.json();
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum/posts"] });
      toast({ title: "Discussion posted", description: "Your discussion is now live." });
    },
    onError: (err: any) => {
      toast({ title: "Failed to post", description: String(err?.message || err), variant: "destructive" });
    },
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Discussions</h1>
        <p className="text-gray-600">Start a conversation or join one below</p>
      </div>

      {/* Composer */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Start a new discussion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          <div className="flex justify-end">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!title || !content || isPending}
              onClick={() => createPost()}
              data-testid="button-submit-discussion"
            >
              {isPending ? "Posting..." : "Post Discussion"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent discussions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : forumPosts.length === 0 ? (
            <div className="text-center py-12">
              <i className="fas fa-comments text-gray-300 text-6xl mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-500">Be the first to start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {forumPosts.map((post) => (
                <div key={post.id} className="border-b pb-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {post.user?.firstName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">
                          {post.user.firstName ? `${post.user.firstName} ${post.user.lastName || ""}`.trim() : "Anonymous"}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Unknown"}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2">{post.title}</h3>
                      <p className="text-gray-600 mb-3">{post.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="hover:text-green-600">
                          <i className="fas fa-thumbs-up mr-1"></i>{post.likes} likes
                        </button>
                        <button className="hover:text-green-600">
                          <i className="fas fa-comment mr-1"></i>{post.replyCount || 0} replies
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


