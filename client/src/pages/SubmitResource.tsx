import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CORE_CATEGORIES } from "../../../shared/const";

export default function SubmitResource() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    level: "beginner",
    provider: "",
    url: "",
    cost: "free",
    duration: "",
    tags: "",
  });

  const utils = trpc.useUtils();

  const createResource = trpc.learning.create.useMutation({
    onSuccess: () => {
      toast.success("Learning resource submitted successfully!", {
        description: "Your resource is now live and visible to learners.",
        duration: 5000,
      });
      // Invalidate and refetch learning resources data
      utils.learning.list.invalidate();
      setLocation("/learning");
    },
    onError: (error) => {
      toast.error(`Failed to submit resource: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Resource title is required");
      return;
    }

    createResource.mutate({
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type || undefined,
      category: formData.category || undefined,
      level: formData.level || undefined,
      provider: formData.provider || undefined,
      url: formData.url || undefined,
      cost: formData.cost || undefined,
      duration: formData.duration || undefined,
      tags: formData.tags ? formData.tags.split(",").map(s => s.trim()) : undefined,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container max-w-3xl py-12">
        <Button
          variant="ghost"
          onClick={() => setLocation("/learning")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning Hub
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Submit a Learning Resource</CardTitle>
                <CardDescription>
                  Share valuable learning resources with the community. Your submission will be reviewed before publication.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Complete Web Development Bootcamp"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this resource covers, who it's for..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Resource Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g., Course, Tutorial, Book, Video"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORE_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cost">Cost</Label>
                  <Select value={formData.cost} onValueChange={(value) => setFormData({ ...formData, cost: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="freemium">Freemium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider">Provider/Author</Label>
                  <Input
                    id="provider"
                    value={formData.provider}
                    onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                    placeholder="e.g., Coursera, Udemy, Author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 6 weeks, 20 hours, Self-paced"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Resource URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., javascript, react, frontend (comma-separated)"
                />
                <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createResource.isPending}
                  className="flex-1"
                >
                  {createResource.isPending ? "Submitting..." : "Submit Resource"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/learning")}
                >
                  Cancel
                </Button>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-300">
                  <strong>Anonymous Submission:</strong> Your learning resource will appear immediately on the platform. 
                  Moderators will review and remove any inappropriate, duplicate, or irrelevant content.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
