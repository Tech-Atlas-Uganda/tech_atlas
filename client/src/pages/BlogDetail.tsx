import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, Eye, Calendar } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

export default function BlogDetail() {
  const [, params] = useRoute("/blog/:slug");

  // Fetch blog post details
  const { data: post, isLoading } = trpc.blog.getBySlug.useQuery(
    params?.slug || "",
    { enabled: !!params?.slug }
  );

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-12">
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">Article not found</p>
              <Button asChild>
                <Link href="/blog">Back to Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Button */}
          <Button asChild variant="ghost" className="gap-2">
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>

          {/* Article */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Header */}
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Category and Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.category && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600">
                      {post.category}
                    </Badge>
                  )}
                  {post.tags && post.tags.length > 0 && (
                    <>
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] leading-tight">
                  {post.title}
                </h1>

                {/* Excerpt */}
                {post.excerpt && (
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-b py-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>By {post.authorId ? `Author ${post.authorId}` : "Tech Atlas Team"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">
                    Featured
                  </Badge>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  {post.tags && post.tags.length > 0 && (
                    <>
                      <span className="text-sm text-muted-foreground">Tags:</span>
                      {post.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline">
                    <Link href="/blog">
                      More Articles
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/submit/blog">
                      Write Article
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Related Articles Section */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Reading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Discover more insights from Uganda's tech community
                </p>
                <Button asChild>
                  <Link href="/blog">
                    Browse All Articles
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}