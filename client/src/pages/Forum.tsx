import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, ThumbsUp, Eye, Plus, Pin, Users, Search, Clock, User } from "lucide-react";
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
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch real forum threads from database
  const { data: threads, isLoading } = trpc.forum.listThreads.useQuery({
    category: selectedCategory
  });

  // Filter threads based on search
  const filteredThreads = threads?.filter(thread => {
    if (!searchQuery) return true;
    return thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           thread.authorName?.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", { 
      month: "short", 
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

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
              Community Forum
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect, discuss, and collaborate with Uganda's tech community
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Link href="/forum/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Thread
                </Link>
              </Button>
            ) : (
              <Button variant="outline" disabled>
                <Users className="h-4 w-4 mr-2" />
                Sign in to Post
              </Button>
            )}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={!selectedCategory ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(undefined)}
              >
                All Categories
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="gap-2"
                >
                  <div className={`w-2 h-2 rounded-full ${cat.color}`}></div>
                  {cat.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Threads List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading discussions...</p>
          </div>
        ) : filteredThreads && filteredThreads.length > 0 ? (
          <div className="space-y-4">
            {/* Pinned Threads */}
            {filteredThreads.filter(thread => thread.isPinned).map((thread, index) => {
              const category = categories.find(c => c.value === thread.category);
              return (
                <motion.div
                  key={`pinned-${thread.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-yellow-500/50 bg-gradient-to-r from-yellow-500/5 to-transparent hover:shadow-lg transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Pin className="h-4 w-4 text-yellow-500" />
                            <Badge className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                              Pinned
                            </Badge>
                            {category && (
                              <Badge className={`${category.color} text-white`}>
                                {category.label}
                              </Badge>
                            )}
                          </div>
                          
                          <Link href={`/forum/${thread.slug}`}>
                            <h3 className="text-xl font-semibold hover:text-blue-500 transition-colors cursor-pointer">
                              {thread.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{thread.authorName || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(thread.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Regular Threads */}
            {filteredThreads.filter(thread => !thread.isPinned).map((thread, index) => {
              const category = categories.find(c => c.value === thread.category);
              return (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg hover:border-blue-500/50 transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            {category && (
                              <Badge variant="outline" className="gap-1">
                                <div className={`w-2 h-2 rounded-full ${category.color}`}></div>
                                {category.label}
                              </Badge>
                            )}
                          </div>
                          
                          <Link href={`/forum/${thread.slug}`}>
                            <h3 className="text-lg font-semibold hover:text-blue-500 transition-colors cursor-pointer">
                              {thread.title}
                            </h3>
                          </Link>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{thread.authorName || "Anonymous"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(thread.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        
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
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory 
                  ? "No discussions found matching your criteria." 
                  : "No discussions yet. Be the first to start a conversation!"
                }
              </p>
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/forum/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Thread
                  </Link>
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sign in to start a discussion
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
