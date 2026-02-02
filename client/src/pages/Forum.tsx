import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Eye, Plus, Pin } from "lucide-react";
import { motion } from "framer-motion";

const categories = [
  { value: "general", label: "General Discussion", color: "bg-blue-500" },
  { value: "jobs", label: "Jobs & Opportunities", color: "bg-green-500" },
  { value: "events", label: "Events & Meetups", color: "bg-purple-500" },
  { value: "help", label: "Help & Support", color: "bg-orange-500" },
  { value: "showcase", label: "Showcase", color: "bg-pink-500" },
  { value: "feedback", label: "Feedback", color: "bg-yellow-500" },
];

export default function Forum() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const { data: threads, isLoading } = trpc.forum.listThreads.useQuery({ category: selectedCategory });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent mb-2">
              Community Forum
            </h1>
            <p className="text-muted-foreground">Connect, discuss, and collaborate with the tech community</p>
          </div>
          <Link href="/forum/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              New Thread
            </Button>
          </Link>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            onClick={() => setSelectedCategory(undefined)}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Threads list */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : threads && threads.length > 0 ? (
          <div className="space-y-4">
            {threads.map((thread, index) => {
              const category = categories.find(c => c.value === thread.category);
              return (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/forum/${thread.slug}`}>
                    <Card className="hover:border-primary transition-all cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
                              <Badge className={category?.color}>{category?.label}</Badge>
                            </div>
                            <CardTitle className="text-xl hover:text-primary transition-colors">
                              {thread.title}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              by {thread.authorName} · {formatDate(thread.createdAt)}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{thread.replyCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4" />
                            <span>{thread.upvotes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{thread.viewCount}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No threads yet. Be the first to start a discussion!</p>
              <Link href="/forum/new">
                <Button>Create Thread</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
