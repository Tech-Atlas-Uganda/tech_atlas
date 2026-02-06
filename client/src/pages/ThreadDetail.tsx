import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Eye, Clock, User, Send, Pin } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

const categories = [
  { value: "general", label: "General Discussion", color: "bg-blue-500" },
  { value: "jobs", label: "Jobs & Opportunities", color: "bg-green-500" },
  { value: "events", label: "Events & Meetups", color: "bg-purple-500" },
  { value: "help", label: "Help & Support", color: "bg-orange-500" },
  { value: "showcase", label: "Showcase", color: "bg-pink-500" },
  { value: "feedback", label: "Feedback", color: "bg-yellow-500" },
];

export default function ThreadDetail() {
  const [, params] = useRoute("/forum/:slug");
  const { isAuthenticated, user } = useAuth();
  const [replyContent, setReplyContent] = useState("");

  // Fetch thread details
  const { data: thread, isLoading: threadLoading } = trpc.forum.getThread.useQuery(
    { slug: params?.slug || "" },
    { enabled: !!params?.slug }
  );

  // Fetch replies
  const { data: replies, isLoading: repliesLoading, refetch: refetchReplies } = trpc.forum.getReplies.useQuery(
    { threadId: thread?.id || 0 },
    { enabled: !!thread?.id }
  );

  // Create reply mutation
  const createReply = trpc.forum.createReply.useMutation({
    onSuccess: () => {
      setReplyContent("");
      refetchReplies();
    },
    onError: (error) => {
      console.error("Failed to create reply:", error);
      toast.error("Failed to post reply. Please try again.");
    }
  });

  // Vote mutation
  const vote = trpc.forum.vote.useMutation({
    onSuccess: () => {
      // Refetch thread data to update vote counts
      // You might want to implement optimistic updates here
    },
    onError: (error) => {
      console.error("Failed to vote:", error);
      toast.error("Failed to vote. Please try again.");
    }
  });

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread || !replyContent.trim()) return;

    try {
      await createReply.mutateAsync({
        threadId: thread.id,
        content: replyContent,
        authorName: user?.user_metadata?.name || user?.email?.split('@')[0] || "Anonymous"
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const handleVote = async (targetType: "thread" | "reply", targetId: number, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to vote");
      return;
    }

    try {
      await vote.mutateAsync({
        targetType,
        targetId,
        voteType
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(date);
  };

  if (threadLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading discussion...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Thread not found</p>
              <Button asChild>
                <Link href="/forum">Back to Forum</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.value === thread.category);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Button */}
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/forum">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Link>
        </Button>

        {/* Thread */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {thread.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                    {thread.isPinned && (
                      <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                        Pinned
                      </Badge>
                    )}
                    {category && (
                      <Badge className={`${category.color} text-white`}>
                        {category.label}
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-2xl md:text-3xl">
                    {thread.title}
                  </CardTitle>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{thread.authorName || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatDate(thread.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{thread.viewCount} views</span>
                    </div>
                  </div>
                </div>
                
                {/* Vote buttons */}
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("thread", thread.id, "up")}
                    disabled={!isAuthenticated || vote.isPending}
                    className="p-2"
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium">{thread.upvotes - thread.downvotes}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote("thread", thread.id, "down")}
                    disabled={!isAuthenticated || vote.isPending}
                    className="p-2"
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{thread.content}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Replies */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            Replies ({replies?.length || 0})
          </h2>

          {repliesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading replies...</p>
            </div>
          ) : replies && replies.length > 0 ? (
            <div className="space-y-4">
              {replies.map((reply, index) => (
                <motion.div
                  key={reply.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{reply.authorName || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(reply.createdAt)}</span>
                            </div>
                          </div>
                          
                          <div className="prose prose-slate dark:prose-invert max-w-none">
                            <div className="whitespace-pre-wrap">{reply.content}</div>
                          </div>
                        </div>
                        
                        {/* Reply vote buttons */}
                        <div className="flex flex-col items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote("reply", reply.id, "up")}
                            disabled={!isAuthenticated || vote.isPending}
                            className="p-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium">{reply.upvotes - reply.downvotes}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote("reply", reply.id, "down")}
                            disabled={!isAuthenticated || vote.isPending}
                            className="p-1"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No replies yet. Be the first to respond!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Reply Form */}
        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReplySubmit} className="space-y-4">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={6}
                  required
                  minLength={1}
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={createReply.isPending || !replyContent.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {createReply.isPending ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Sign in to join the discussion</p>
              <Button variant="outline">Sign In</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}