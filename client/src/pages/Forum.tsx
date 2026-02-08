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
  { value: "general", label: "General", color: "bg-blue-500", textColor: "text-blue-600", bgLight: "bg-blue-50", borderColor: "border-blue-200" },
  { value: "jobs", label: "Jobs", color: "bg-emerald-500", textColor: "text-emerald-600", bgLight: "bg-emerald-50", borderColor: "border-emerald-200" },
  { value: "events", label: "Events", color: "bg-purple-500", textColor: "text-purple-600", bgLight: "bg-purple-50", borderColor: "border-purple-200" },
  { value: "help", label: "Help", color: "bg-orange-500", textColor: "text-orange-600", bgLight: "bg-orange-50", borderColor: "border-orange-200" },
  { value: "showcase", label: "Showcase", color: "bg-pink-500", textColor: "text-pink-600", bgLight: "bg-pink-50", borderColor: "border-pink-200" },
  { value: "feedback", label: "Feedback", color: "bg-amber-500", textColor: "text-amber-600", bgLight: "bg-amber-50", borderColor: "border-amber-200" },
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
    // Handle both ISO strings and Date objects
    let d: Date;
    if (typeof date === 'string') {
      // If the string doesn't have timezone info, treat it as UTC
      d = date.includes('Z') || date.includes('+') || date.includes('-') && date.lastIndexOf('-') > 10
        ? new Date(date)
        : new Date(date + 'Z'); // Append Z to treat as UTC
    } else {
      d = new Date(date);
    }
    
    // Ensure we're working with a valid date
    if (isNaN(d.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(d);
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    
    // Handle both ISO strings and Date objects
    let past: Date;
    if (typeof date === 'string') {
      // If the string doesn't have timezone info, treat it as UTC
      past = date.includes('Z') || date.includes('+') || date.includes('-') && date.lastIndexOf('-') > 10
        ? new Date(date)
        : new Date(date + 'Z'); // Append Z to treat as UTC
    } else {
      past = new Date(date);
    }
    
    // Ensure we're working with valid dates
    if (isNaN(past.getTime())) return 'Invalid date';
    
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    // Less than a minute
    if (diffInSeconds < 60) return "Just now";
    
    // Less than an hour
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    // Less than a day
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    // Less than a week
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    // Less than a month
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;
    
    // More than a month - show full date
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {/* Pinned Threads */}
            {filteredThreads.filter(thread => thread.isPinned).map((thread, index) => {
              const category = categories.find(c => c.value === thread.category);
              return (
                <motion.div
                  key={`pinned-${thread.id}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link href={`/forum/${thread.slug}`}>
                    <Card className="h-full border-amber-300 bg-gradient-to-br from-amber-50/50 to-transparent dark:from-amber-950/20 hover:shadow-lg hover:border-amber-400 hover:scale-105 transition-all cursor-pointer">
                      <CardContent className="p-3 h-full flex flex-col">
                        {/* Category Badge */}
                        {category && (
                          <div className={`w-full h-1 rounded-full ${category.color} mb-2`}></div>
                        )}
                        
                        {/* Pin Badge */}
                        <div className="flex items-center gap-1 mb-2">
                          <Pin className="h-3 w-3 text-amber-600 flex-shrink-0" />
                          {category && (
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 ${category.textColor} ${category.borderColor}`}>
                              {category.label}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xs font-semibold text-foreground line-clamp-2 hover:text-blue-600 transition-colors leading-tight mb-2 flex-1">
                          {thread.title}
                        </h3>
                        
                        {/* Author */}
                        <div className="text-[9px] text-muted-foreground mb-2 truncate">
                          <User className="h-2.5 w-2.5 inline mr-0.5" />
                          {thread.authorName || "Anonymous"}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-0.5">
                            <MessageSquare className="h-2.5 w-2.5" />
                            <span>{thread.replyCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <ThumbsUp className="h-2.5 w-2.5" />
                            <span>{(thread.upvotes || 0) - (thread.downvotes || 0)}</span>
                          </div>
                          <div className="text-[8px]">{formatTimeAgo(thread.createdAt)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}

            {/* Regular Threads */}
            {filteredThreads.filter(thread => !thread.isPinned).map((thread, index) => {
              const category = categories.find(c => c.value === thread.category);
              return (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link href={`/forum/${thread.slug}`}>
                    <Card className="h-full hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 hover:scale-105 transition-all cursor-pointer group">
                      <CardContent className="p-3 h-full flex flex-col">
                        {/* Category Badge */}
                        {category && (
                          <div className={`w-full h-1 rounded-full ${category.color} mb-2`}></div>
                        )}
                        
                        {/* Category Label */}
                        <div className="mb-2">
                          {category && (
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 h-3.5 ${category.textColor} ${category.borderColor}`}>
                              {category.label}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight mb-2 flex-1">
                          {thread.title}
                        </h3>
                        
                        {/* Author */}
                        <div className="text-[9px] text-muted-foreground mb-2 truncate">
                          <User className="h-2.5 w-2.5 inline mr-0.5" />
                          {thread.authorName || "Anonymous"}
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center justify-between text-[9px] text-muted-foreground pt-2 border-t">
                          <div className="flex items-center gap-0.5">
                            <MessageSquare className="h-2.5 w-2.5" />
                            <span>{thread.replyCount || 0}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <ThumbsUp className="h-2.5 w-2.5" />
                            <span>{(thread.upvotes || 0) - (thread.downvotes || 0)}</span>
                          </div>
                          <div className="text-[8px]">{formatTimeAgo(thread.createdAt)}</div>
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
