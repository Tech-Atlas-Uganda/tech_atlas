import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
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

  // TRPC mutation for creating threads
  const createThread = trpc.forum.createThread.useMutation({
    onSuccess: (data) => {
      if (data) {
        toast.success("Thread created successfully!");
        setLocation(`/forum/${data.slug}`);
      } else {
        setLocation("/forum");
      }
    },
    onError: (error) => {
      console.error("Failed to create thread:", error);
      toast.error("Failed to create thread. Please try again.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createThread.mutateAsync({
        title,
        content,
        category: category as any,
        authorName: user?.user_metadata?.name || user?.email?.split('@')[0] || "Anonymous"
      });
    } catch (error) {
      // Error handling is done in the mutation
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <Link href="/forum">
            <Button variant="ghost" className="gap-2">
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
                  <Button 
                    type="submit" 
                    disabled={createThread.isPending} 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
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
    </ProtectedRoute>
  );
}
