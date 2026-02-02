import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Send, Pin, Lock } from "lucide-react";

export default function ThreadDetail() {
  const [, params] = useRoute("/forum/:slug");
  const slug = params?.slug || "";
  const { user } = useAuth();
  const utils = trpc.useUtils();

  const { data: thread, isLoading } = trpc.forum.getThread.useQuery({ slug });
  const { data: replies } = trpc.forum.getReplies.useQuery(
    { threadId: thread?.id || 0 },
    { enabled: !!thread?.id }
  );

  const [replyContent, setReplyContent] = useState("");
  const [authorName, setAuthorName] = useState("");

  const createReply = trpc.forum.createReply.useMutation({
    onSuccess: () => {
      toast.success("Reply posted!");
      setReplyContent("");
      setAuthorName("");
      if (thread?.id) {
        utils.forum.getReplies.invalidate({ threadId: thread.id });
      }
    },
  });

  const vote = trpc.forum.vote.useMutation({
    onSuccess: () => {
      utils.forum.getThread.invalidate({ slug });
    },
  });

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!thread) return;

    if (!user && !authorName.trim()) {
      toast.error("Please provide your name");
      return;
    }

    createReply.mutate({
      threadId: thread.id,
      content: replyContent,
      authorName: !user ? authorName : undefined,
    });
  };

  const handleVote = (voteType: "up" | "down") => {
    if (!user) {
      toast.error("Please sign in to vote");
      return;
    }
    if (!thread) return;
    vote.mutate({ targetType: "thread", targetId: thread.id, voteType });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen p-6">
        <div className="container max-w-4xl text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Thread not found</h2>
          <Link href="/forum">
            <Button>Back to Forum</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="container max-w-4xl">
        <Link href="/forum">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Button>
        </Link>

        {/* Thread */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
              {thread.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <Badge>{thread.category}</Badge>
            </div>
            <CardTitle className="text-3xl">{thread.title}</CardTitle>
            <CardDescription>
              Posted by {thread.authorName} · {formatDate(thread.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{thread.content}</p>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("up")}
                disabled={!user || vote.isPending}
                className="gap-2"
              >
                <ThumbsUp className="h-4 w-4" />
                {thread.upvotes}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleVote("down")}
                disabled={!user || vote.isPending}
                className="gap-2"
              >
                <ThumbsDown className="h-4 w-4" />
                {thread.downvotes}
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto">
                <MessageSquare className="h-4 w-4" />
                <span>{thread.replyCount} replies</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply form */}
        {!thread.isLocked && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Post a Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReply} className="space-y-4">
                {!user && (
                  <div className="space-y-2">
                    <Label htmlFor="replyAuthorName">Your Name *</Label>
                    <Input
                      id="replyAuthorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="replyContent">Your Reply *</Label>
                  <Textarea
                    id="replyContent"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                    rows={6}
                    className="resize-none"
                  />
                </div>

                <Button type="submit" disabled={createReply.isPending} className="gap-2">
                  <Send className="h-4 w-4" />
                  {createReply.isPending ? "Posting..." : "Post Reply"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {replies?.length || 0} {replies?.length === 1 ? "Reply" : "Replies"}
          </h3>

          {replies && replies.length > 0 ? (
            replies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {(reply.authorName || 'A').charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{reply.authorName}</span>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(reply.createdAt)}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-8 text-muted-foreground">
                No replies yet. Be the first to respond!
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
