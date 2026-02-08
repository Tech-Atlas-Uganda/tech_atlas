import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { 
  FileText, 
  Image, 
  Plus, 
  X, 
  Upload,
  Eye,
  Send,
  Tag
} from "lucide-react";

interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  coverImage: File | null;
  coverImagePreview: string;
}

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

export default function SubmitBlog() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [post, setPost] = useState<BlogPost>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: [],
    coverImage: null,
    coverImagePreview: ""
  });
  const [newTag, setNewTag] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  // TRPC mutation for creating blog posts
  const createBlogPost = trpc.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post submitted successfully! It will be reviewed before publication.");
      setLocation("/blog");
    },
    onError: (error) => {
      console.error("Failed to submit blog post:", error);
      toast.error("Failed to submit blog post. Please try again.");
    }
  });

  const handleInputChange = (field: keyof BlogPost, value: any) => {
    setPost(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost(prev => ({ ...prev, coverImage: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPost(prev => ({ ...prev, coverImagePreview: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !post.tags.includes(newTag.trim()) && post.tags.length < 10) {
      setPost(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate cover image is present
    if (!post.coverImage) {
      toast.error('Please upload a cover image for your blog post.');
      return;
    }

    try {
      let coverImageUrl = "";
      
      // Upload cover image
      const fileExt = post.coverImage.name.split('.').pop();
      const fileName = `blog-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(fileName, post.coverImage, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Image upload error:', uploadError);
        toast.error('Failed to upload image. Please try again or use a different image.');
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName);
      
      coverImageUrl = publicUrl;

      await createBlogPost.mutateAsync({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags,
        coverImage: coverImageUrl,
      });
      
      // Reset form on success
      setPost({
        title: "",
        excerpt: "",
        content: "",
        category: "",
        tags: [],
        coverImage: null,
        coverImagePreview: ""
      });
      
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-bold text-foreground">Submit Blog Post</h1>
            <p className="text-muted-foreground">
              Share your insights, experiences, and knowledge with Uganda's tech community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Blog Post Details
                  </CardTitle>
                  <CardDescription>
                    Create engaging content that adds value to the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={post.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="Write a compelling title for your blog post"
                        required
                      />
                    </div>

                    {/* Excerpt */}
                    <div className="space-y-2">
                      <Label htmlFor="excerpt">Excerpt *</Label>
                      <Textarea
                        id="excerpt"
                        value={post.excerpt}
                        onChange={(e) => handleInputChange("excerpt", e.target.value)}
                        placeholder="Write a brief summary that will appear in blog listings..."
                        rows={3}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        {post.excerpt.length}/200 characters
                      </p>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-2">
                      <Label>Cover Image *</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                        {post.coverImagePreview ? (
                          <div className="space-y-4">
                            <img
                              src={post.coverImagePreview}
                              alt="Cover preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setPost(prev => ({ 
                                ...prev, 
                                coverImage: null, 
                                coverImagePreview: "" 
                              }))}
                            >
                              Remove Image
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center space-y-4">
                            <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                            <div className="space-y-2">
                              <p className="text-sm text-muted-foreground">
                                Click to upload or drag and drop
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, GIF up to 5MB
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById('cover-image')?.click()}
                                className="mt-2"
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Choose Image
                              </Button>
                              <Input
                                id="cover-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <span>Don't have an image?</span>
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto p-0 text-blue-500 hover:text-blue-600"
                          onClick={() => window.open('/tools/image-generator', '_blank')}
                        >
                          Generate one here →
                        </Button>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        value={post.category}
                        onChange={(e) => handleInputChange("category", e.target.value)}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="space-y-3">
                      <Label>Tags</Label>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag (e.g., React, AI, Startup)"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button type="button" onClick={addTag} size="sm" disabled={post.tags.length >= 10}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {post.tags.length}/10 tags
                      </p>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <Label htmlFor="content">Content *</Label>
                      <Textarea
                        id="content"
                        value={post.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        placeholder="Write your blog post content here. You can use Markdown formatting..."
                        rows={15}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Supports Markdown formatting. {post.content.length} characters
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsPreview(!isPreview)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        {isPreview ? "Edit" : "Preview"}
                      </Button>
                      
                      <Button
                        type="submit"
                        disabled={createBlogPost.isPending || !post.title || !post.excerpt || !post.content || !post.category || !post.coverImage}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        <Send className="h-4 w-4" />
                        {createBlogPost.isPending ? "Submitting..." : "Submit for Review"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium text-foreground">Content Quality</h4>
                    <p className="text-muted-foreground">Write original, valuable content that helps the community learn and grow.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Formatting</h4>
                    <p className="text-muted-foreground">Use clear headings, bullet points, and code blocks to improve readability.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Images</h4>
                    <p className="text-muted-foreground">Include relevant images to illustrate your points and engage readers.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Review Process</h4>
                    <p className="text-muted-foreground">All posts are reviewed for quality and relevance before publication.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Author Info */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {(user.user_metadata?.name || user.email)?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Preview Modal */}
          {isPreview && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>How your blog post will appear to readers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {post.coverImagePreview && (
                  <img
                    src={post.coverImagePreview}
                    alt="Cover"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold">{post.title || "Your Blog Title"}</h1>
                  <p className="text-muted-foreground mt-2">{post.excerpt || "Your blog excerpt will appear here..."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.category && (
                    <Badge variant="default">{post.category}</Badge>
                  )}
                  {post.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{post.content || "Your blog content will appear here..."}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}