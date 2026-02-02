import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const categories = [
  { value: "general", label: "General Discussion" },
  { value: "jobs", label: "Jobs & Opportunities" },
  { value: "events", label: "Events & Meetups" },
  { value: "help", label: "Help & Support" },
  { value: "showcase", label: "Showcase" },
  { value: "feedback", label: "Feedback" },
];

export default function NewThread() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("general");
  const [authorName, setAuthorName] = useState("");

  const createThread = trpc.forum.createThread.useMutation({
    onSuccess: (data) => {
      toast.success("Thread created successfully!");
      if (data) setLocation(`/forum/${data.slug}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create thread");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user && !authorName.trim()) {
      toast.error("Please provide your name");
      return;
    }

    createThread.mutate({
      title,
      content,
      category: category as any,
      authorName: !user ? authorName : undefined,
    });
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container max-w-3xl">
        <Link href="/forum">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Forum
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create New Thread</CardTitle>
            <CardDescription>Start a discussion with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!user && (
                <div className="space-y-2">
                  <Label htmlFor="authorName">Your Name *</Label>
                  <Input
                    id="authorName"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    You're posting as a guest. Sign in to track your threads.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your thread about?"
                  required
                  minLength={5}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or ideas..."
                  required
                  minLength={10}
                  rows={12}
                  className="resize-none"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={createThread.isPending} className="flex-1">
                  {createThread.isPending ? "Creating..." : "Create Thread"}
                </Button>
                <Link href="/forum">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
