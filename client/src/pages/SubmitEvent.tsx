import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CORE_CATEGORIES } from "../../../shared/const";

export default function SubmitEvent() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [submissionType, setSubmissionType] = useState<"event" | "opportunity">("event");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    location: "",
    virtual: false,
    url: "",
    organizer: "",
    capacity: "",
    tags: "",
    // Opportunity specific fields
    provider: "",
    amount: "",
    currency: "USD",
    deadline: "",
    submitterName: "",
  });

  // Get submission type from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    if (type === 'opportunity') {
      setSubmissionType('opportunity');
    }
  }, []);

  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Event submitted successfully!");
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(`Failed to submit event: ${error.message}`);
    },
  });

  const createOpportunity = trpc.opportunities.create.useMutation({
    onSuccess: () => {
      toast.success("Opportunity submitted successfully!");
      setLocation("/events");
    },
    onError: (error) => {
      toast.error(`Failed to submit opportunity: ${error.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    const baseData = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type || undefined,
      category: formData.category || undefined,
      url: formData.url || undefined,
      tags: formData.tags ? formData.tags.split(",").map(s => s.trim()) : undefined,
      submitterName: formData.submitterName || undefined,
    };

    if (submissionType === "event") {
      if (!formData.startDate) {
        toast.error("Start date is required for events");
        return;
      }

      createEvent.mutate({
        ...baseData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        location: formData.location || undefined,
        virtual: formData.virtual,
        organizer: formData.organizer || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
      });
    } else {
      createOpportunity.mutate({
        ...baseData,
        provider: formData.provider || undefined,
        amount: formData.amount || undefined,
        currency: formData.currency || undefined,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
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
          onClick={() => setLocation("/events")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events & Opportunities
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${submissionType === 'event' ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                {submissionType === 'event' ? (
                  <Calendar className={`h-6 w-6 ${submissionType === 'event' ? 'text-blue-600' : 'text-green-600'}`} />
                ) : (
                  <Award className="h-6 w-6 text-green-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">
                  Submit {submissionType === 'event' ? 'an Event' : 'an Opportunity'}
                </CardTitle>
                <CardDescription>
                  {submissionType === 'event' 
                    ? "Share tech events, meetups, and conferences with the community."
                    : "Share grants, fellowships, competitions, and scholarships with the community."
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Submission Type Selection */}
              <div className="space-y-2">
                <Label htmlFor="submissionType">Submission Type</Label>
                <Select 
                  value={submissionType} 
                  onValueChange={(value: "event" | "opportunity") => setSubmissionType(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event - Meetups, conferences, workshops</SelectItem>
                    <SelectItem value="opportunity">Opportunity - Grants, fellowships, competitions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{submissionType === 'event' ? 'Event' : 'Opportunity'} Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder={submissionType === 'event' ? "e.g., Tech Meetup Kampala" : "e.g., Google Developer Scholarship"}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={submissionType === 'event' 
                    ? "Describe the event, agenda, speakers..." 
                    : "Describe the opportunity, requirements, benefits..."
                  }
                  rows={4}
                />
              </div>

              {/* Type and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{submissionType === 'event' ? 'Event' : 'Opportunity'} Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${submissionType} type`} />
                    </SelectTrigger>
                    <SelectContent>
                      {submissionType === 'event' ? (
                        <>
                          <SelectItem value="meetup">Meetup</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                          <SelectItem value="hackathon">Hackathon</SelectItem>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="grant">Grant</SelectItem>
                          <SelectItem value="fellowship">Fellowship</SelectItem>
                          <SelectItem value="scholarship">Scholarship</SelectItem>
                          <SelectItem value="competition">Competition</SelectItem>
                          <SelectItem value="accelerator">Accelerator</SelectItem>
                          <SelectItem value="incubator">Incubator</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CORE_CATEGORIES.map((cat: string) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Event-specific fields */}
              {submissionType === 'event' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date & Time *</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date & Time</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Venue name and address"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="virtual"
                      checked={formData.virtual}
                      onCheckedChange={(checked) => setFormData({ ...formData, virtual: checked as boolean })}
                    />
                    <Label htmlFor="virtual" className="cursor-pointer">
                      This is a virtual event
                    </Label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organizer">Organizer</Label>
                      <Input
                        id="organizer"
                        value={formData.organizer}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        placeholder="Organization or person name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        placeholder="Maximum attendees"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Opportunity-specific fields */}
              {submissionType === 'opportunity' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Provider/Organization</Label>
                    <Input
                      id="provider"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      placeholder="Organization providing the opportunity"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount/Value</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="UGX">UGX</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </>
              )}

              {/* Common fields */}
              <div className="space-y-2">
                <Label htmlFor="url">{submissionType === 'event' ? 'Event' : 'Application'} URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder={submissionType === 'event' 
                    ? "https://... (registration or event page)" 
                    : "https://... (application or details page)"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g., networking, beginner-friendly, remote (comma-separated)"
                />
                <p className="text-xs text-muted-foreground">Separate multiple tags with commas</p>
              </div>

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
                  disabled={createEvent.isPending || createOpportunity.isPending}
                  className="flex-1"
                >
                  {(createEvent.isPending || createOpportunity.isPending) 
                    ? "Submitting..." 
                    : `Submit ${submissionType === 'event' ? 'Event' : 'Opportunity'}`
                  }
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/events")}
                >
                  Cancel
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm">
                <p className="text-blue-700 dark:text-blue-300">
                  <strong>Anonymous Submissions Welcome:</strong> You can submit {submissionType === 'event' ? 'events' : 'opportunities'} without creating an account. 
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
