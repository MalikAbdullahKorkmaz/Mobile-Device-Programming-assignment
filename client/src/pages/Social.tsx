import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Heart, Share2, Users, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function Social() {
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState<"general_update" | "study_milestone" | "assignment_completed" | "quiz_passed" | "streak_achievement">("general_update");

  const feedQuery = trpc.feed.getFeed.useQuery({ limit: 20 });
  const friendsQuery = trpc.friends.list.useQuery();
  const createPostMutation = trpc.feed.create.useMutation();
  const likeMutation = trpc.feed.like.useMutation();

  const handleCreatePost = async () => {
    if (!postContent.trim()) {
      toast.error("Please write something!");
      return;
    }

    try {
      await createPostMutation.mutateAsync({
        postType,
        title: postContent.substring(0, 100),
        content: postContent,
        visibility: "friends_only",
      });

      toast.success("Post shared!");
      setPostContent("");
      feedQuery.refetch();
    } catch (error) {
      toast.error("Failed to create post");
      console.error(error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      await likeMutation.mutateAsync({ postId });
      feedQuery.refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const posts = feedQuery.data || [];
  const friends = friendsQuery.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Connect with friends and share your achievements</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("feed")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "feed"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <Zap className="w-4 h-4 inline mr-2" />
          Feed
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "friends"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Friends ({friends.length})
        </button>
      </div>

      {/* Feed Tab */}
      {activeTab === "feed" && (
        <div className="space-y-6">
          {/* Create Post */}
          <Card className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Share Your Progress</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  What's on your mind?
                </label>
                <Textarea
                  placeholder="Share your study achievements, challenges, or motivation..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Post Type
                </label>
                <select
                  value={postType}
                  onChange={(e) => setPostType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="general_update">General Update</option>
                  <option value="study_milestone">Study Milestone</option>
                  <option value="assignment_completed">Assignment Completed</option>
                  <option value="quiz_passed">Quiz Passed</option>
                  <option value="streak_achievement">Streak Achievement</option>
                </select>
              </div>

              <Button
                onClick={handleCreatePost}
                className="w-full bg-blue-500 hover:bg-blue-600"
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Share Post
              </Button>
            </div>
          </Card>

          {/* Posts */}
          {feedQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : posts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">No posts yet. Be the first to share!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{post.userName}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {format(new Date(post.createdAt), "MMM d, HH:mm")}
                        </p>
                      </div>
                      <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                        {post.postType.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{post.title}</h4>
                      {post.content && (
                        <p className="text-gray-700 dark:text-gray-300 mt-2">{post.content}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm">Share</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Friends Tab */}
      {activeTab === "friends" && (
        <div className="space-y-4">
          {friendsQuery.isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : friends.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No friends yet. Add friends to see their activity!</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {friends.map((friend) => (
                <Card key={friend.id} className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{friend.friendName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{friend.friendEmail}</p>
                  </div>
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    {friend.status.toUpperCase()}
                  </span>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
