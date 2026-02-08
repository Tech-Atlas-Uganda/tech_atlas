import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { FileText, Search, Plus, Clock, User, PenTool } from "lucide-react";
import { motion } from "framer-motion";

export default function Blog() {
  const { isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Fetch real blog posts from database
  const { data: posts, isLoading } = trpc.blog.list.useQuery({ 
    status: "published",
    limit: 50 
  });

  const filterPosts = (items: any[] | undefined) => {
    if (!items) return [];
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    return filtered;
  };

  const filteredPosts = filterPosts(posts);
  const featuredPosts = filteredPosts.filter(post => post.featured).slice(0, 3);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const categories = [
    "Community Spotlight",
    "Startup Journey", 
    "Career Guidance",
    "Policy & Ecosystem",
    "Event Recap",
    "Tech Trends",
    "Tutorial",
    "Case Study",
    "Innovation"
  ];

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
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }).format(d);
  };

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
                Blog & Stories
              </h1>
              <p className="text-lg text-muted-foreground">
                Community insights, startup journeys, and ecosystem updates
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button asChild className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Link href="/submit/blog">
                    <a className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Write Article
                    </a>
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <PenTool className="h-4 w-4 mr-2" />
                  Sign in to Write
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">Loading stories...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No stories found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-16"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6 font-['Space_Grotesk']">
                  Featured Stories
                </h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <a>
                          <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden">
                            {post.coverImage && (
                              <div className="aspect-video w-full overflow-hidden bg-muted">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <CardHeader>
                              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 w-fit mb-2">
                                Featured
                              </Badge>
                              <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(post.publishedAt || post.createdAt)}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="line-clamp-3">
                                {post.excerpt || "No excerpt available"}
                              </CardDescription>
                              {post.category && (
                                <Badge variant="outline" className="mt-4">
                                  {post.category}
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6 font-['Space_Grotesk']">
                  Latest Stories
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <a>
                          <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden">
                            {post.coverImage && (
                              <div className="aspect-video w-full overflow-hidden bg-muted">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            <CardHeader>
                              <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(post.publishedAt || post.createdAt)}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <CardDescription className="line-clamp-3 mb-4">
                                {post.excerpt || "No excerpt available"}
                              </CardDescription>
                              <div className="flex flex-wrap gap-2">
                                {post.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {post.category}
                                  </Badge>
                                )}
                                {post.tags && post.tags.length > 0 && (
                                  <>
                                    {post.tags.slice(0, 2).map((tag: string) => (
                                      <Badge key={tag} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                    {post.tags.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{post.tags.length - 2}
                                      </Badge>
                                    )}
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </a>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
