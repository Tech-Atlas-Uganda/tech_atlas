import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { ArrowLeft, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CORE_CATEGORIES } from "../../../shared/const";

export default function SubmitJob() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    opportunityType: "job" as "job" | "gig",
    title: "",
    company: "", // For jobs only
    description: "",
    type: "", // Job type or gig category
    location: "",
    remote: false,
    budget: "", // For gigs
    salaryMin: "", // For jobs
    salaryMax: "", // For jobs
    currency: "UGX",
    contactEmail: "",
    expiresAt: "",
    submitterName: "",
  });

  const createJob = trpc.jobs.create.useMutation({
    onSuccess: () => {
      toast.success("Job posted successfully!");
      setLocation("/jobs");
    },
    onError: (error) => {
      toast.error(`Failed to post job: ${error.message}`);
    },
  });

  const createGig = trpc.gigs.create.useMutation({
    onSuccess: () => {
      toast.success("Gig posted successfully!");
      setLocation("/jobs");
    },
    onError: (error) => {
      toast.error(`Failed to post gig: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (formData.opportunityType === "job" && !formData.company.trim()) {
      toast.error("Company name is required for jobs");
      return;
    }

    const baseData = {
      title: formData.title,
      description: formData.description || undefined,
      location: formData.location || undefined,
      remote: formData.remote,
      contactEmail: formData.contactEmail || undefined,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      submitterName: formData.submitterName || undefined,
    };

    if (formData.opportunityType === "job") {
      createJob.mutate({
        ...baseData,
        company: formData.company,
        type: formData.type as "full-time" | "part-time" | "internship" | "contract",
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        currency: formData.currency || undefined,
      });
    } else {
      createGig.mutate({
        ...baseData,
        category: formData.type || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        currency: formData.currency || undefined,
      });
    }
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
          onClick={() => setLocation("/jobs")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs & Gigs
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Post an Opportunity</CardTitle>
                <CardDescription>
                  Share job openings or gig projects with Uganda's tech community.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Opportunity Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="opportunityType">Opportunity Type *</Label>
                <Select 
                  value={formData.opportunityType} 
                  onValueChange={(value: "job" | "gig") => setFormData({ ...formData, opportunityType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job - Permanent/Long-term position</SelectItem>
                    <SelectItem value="gig">Gig - Project/Freelance work</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{formData.opportunityType === "job" ? "Job" : "Project"} Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={formData.opportunityType === "job" ? "e.g., Senior Frontend Developer" : "e.g., Build a React Dashboard"}
                  required
                />
              </div>

              {/* Company (Jobs only) */}
              {formData.opportunityType === "job" && (
                <div className="space-y-2">
                  <Label htmlFor="company">Company Name *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Your company name"
                    required
                  />
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={formData.opportunityType === "job" 
                    ? "Describe the role, responsibilities, and what you're looking for..." 
                    : "Describe the project, requirements, and deliverables..."
                  }
                  rows={4}
                />
              </div>

              {/* Type/Category */}
              <div className="space-y-2">
                <Label htmlFor="type">
                  {formData.opportunityType === "job" ? "Job Type" : "Category"}
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${formData.opportunityType === "job" ? "job type" : "category"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.opportunityType === "job" ? (
                      <>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                      </>
                    ) : (
                      CORE_CATEGORIES.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Kampala, Uganda"
                />
              </div>

              {/* Remote Work */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remote"
                  checked={formData.remote}
                  onCheckedChange={(checked) => setFormData({ ...formData, remote: checked as boolean })}
                />
                <Label htmlFor="remote" className="cursor-pointer">
                  Remote work available
                </Label>
              </div>

              {/* Compensation */}
              {formData.opportunityType === "job" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Min Salary</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Max Salary</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UGX">UGX</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UGX">UGX</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@company.com"
                />
              </div>

              {/* Expiration Date */}
              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiration Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank for no expiration. Expired listings will be marked as such.
                </p>
              </div>

              {/* Submitter Name */}
              <div className="space-y-2">
                <Label htmlFor="submitterName">Your Name (Optional)</Label>
                <Input
                  id="submitterName"
                  value={formData.submitterName}
                  onChange={(e) => setFormData({ ...formData, submitterName: e.target.value })}
                  placeholder="Enter your name to be credited as the submitter"
                />
                <p className="text-xs text-muted-foreground">
                  {isAuthenticated 
                    ? "Leave blank to use your account name, or enter a different name" 
                    : "Optional: Enter your name to be credited for this submission"
                  }
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={createJob.isPending || createGig.isPending}
                  className="flex-1"
                >
                  {(createJob.isPending || createGig.isPending) ? "Posting..." : `Post ${formData.opportunityType === "job" ? "Job" : "Gig"}`}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/jobs")}
                >
                  Cancel
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Anonymous Submissions Welcome:</strong> You can post opportunities without creating an account. 
                  Platform moderators will remove any submissions that are irrelevant, illegal, or violate our community guidelines.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
