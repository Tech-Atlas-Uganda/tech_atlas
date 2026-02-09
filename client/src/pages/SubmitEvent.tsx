import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Award, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CORE_CATEGORIES } from "../../../shared/const";

export default function SubmitEvent() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const utils = trpc.useUtils();
  const [submissionType, setSubmissionType] = useState<"event" | "opportunity">("event");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Generate default image and upload to Supabase Storage
  const generateAndUploadDefaultImage = async (type: "event" | "opportunity"): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    if (type === 'event') {
      gradient.addColorStop(0, '#FCD34D'); // Yellow
      gradient.addColorStop(1, '#F59E0B'); // Amber
    } else {
      gradient.addColorStop(0, '#34D399'); // Green
      gradient.addColorStop(1, '#059669'); // Emerald
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Add pattern/texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 400, Math.random() * 300, Math.random() * 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add Tech Atlas text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECH ATLAS', 200, 120);
    
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText(type.toUpperCase(), 200, 150);
    
    // Add icon
    ctx.font = '48px Arial, sans-serif';
    ctx.fillText(type === 'event' ? '📅' : '🏆', 200, 200);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image'));
          return;
        }

        try {
          // Upload to Supabase Storage
          const fileName = `default-${type}-${Date.now()}.png`;
          const bucketName = type === 'event' ? 'event-images' : 'opportunity-images';
          const filePath = `defaults/${fileName}`;

          console.log(`📤 Uploading default ${type} image to ${bucketName}/${filePath}`);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, blob, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('❌ Failed to upload default image:', uploadError);
            reject(uploadError);
            return;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          console.log('✅ Default image uploaded:', publicUrl);
          resolve(publicUrl);
        } catch (error) {
          console.error('❌ Error uploading default image:', error);
          reject(error);
        }
      }, 'image/png');
    });
  };

  // Generate preview of default image (for display only)
  const generateDefaultImagePreview = (type: "event" | "opportunity"): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    if (type === 'event') {
      gradient.addColorStop(0, '#FCD34D');
      gradient.addColorStop(1, '#F59E0B');
    } else {
      gradient.addColorStop(0, '#34D399');
      gradient.addColorStop(1, '#059669');
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 400, Math.random() * 300, Math.random() * 30, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECH ATLAS', 200, 120);
    
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText(type.toUpperCase(), 200, 150);
    
    ctx.font = '48px Arial, sans-serif';
    ctx.fillText(type === 'event' ? '📅' : '🏆', 200, 200);

    return canvas.toDataURL('image/png');
  };

  const createEvent = trpc.events.create.useMutation({
    onSuccess: async (data) => {
      console.log('✅ Event created successfully:', data);
      toast.success("Event submitted successfully! It's now live on the platform.");
      // Invalidate queries to refresh the events list
      await utils.events.list.invalidate();
      console.log('🔄 Cache invalidated, navigating to events page...');
      // Small delay to ensure cache is updated
      setTimeout(() => {
        setLocation("/events");
      }, 500);
    },
    onError: (error) => {
      console.error('❌ Event creation failed:', error);
      toast.error(`Failed to submit event: ${error.message}`);
    },
  });

  const createOpportunity = trpc.opportunities.create.useMutation({
    onSuccess: async (data) => {
      console.log('✅ Opportunity created successfully:', data);
      toast.success("Opportunity submitted successfully! It's now live on the platform.");
      // Invalidate queries to refresh the opportunities list
      await utils.opportunities.list.invalidate();
      console.log('🔄 Cache invalidated, navigating to events page...');
      // Small delay to ensure cache is updated
      setTimeout(() => {
        setLocation("/events");
      }, 500);
    },
    onError: (error) => {
      console.error('❌ Opportunity creation failed:', error);
      toast.error(`Failed to submit opportunity: ${error.message}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    console.log('🚀 Starting submission for:', submissionType, formData.title);

    // Upload image to Supabase Storage if provided
    let imageUrl = "";
    if (imageFile) {
      try {
        toast.info("Uploading image...");
        
        // Generate unique filename
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${submissionType}s/${fileName}`;
        
        // Use separate buckets for events and opportunities
        const bucketName = submissionType === 'event' ? 'event-images' : 'opportunity-images';

        console.log('📤 Uploading image to:', bucketName, filePath);

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('❌ Upload error:', uploadError);
          toast.error(`Failed to upload image: ${uploadError.message}`);
          // Use default image instead
          console.log('ℹ️ Using default image...');
          if (submissionType === 'opportunity') {
            imageUrl = '/tech_atlas_opportunity.png'; // Local image from public folder
            console.log('✅ Using local opportunity image:', imageUrl);
          } else {
            imageUrl = await generateAndUploadDefaultImage(submissionType);
          }
        } else {
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          imageUrl = publicUrl;
          console.log('✅ Image uploaded successfully:', imageUrl);
          toast.success("Image uploaded successfully!");
        }
      } catch (error: any) {
        console.error('❌ Image upload error:', error);
        toast.error(`Failed to upload image: ${error.message}`);
        // Use default image on error
        console.log('ℹ️ Using default image...');
        if (submissionType === 'opportunity') {
          imageUrl = '/tech_atlas_opportunity.png'; // Local image from public folder
          console.log('✅ Using local opportunity image:', imageUrl);
        } else {
          try {
            imageUrl = await generateAndUploadDefaultImage(submissionType);
          } catch (defaultError) {
            console.error('❌ Failed to generate default image:', defaultError);
            imageUrl = ""; // Empty string as final fallback
          }
        }
      }
    } else {
      // Use local default image for opportunities (no upload needed)
      console.log('ℹ️ No image provided, using local default image...');
      if (submissionType === 'opportunity') {
        imageUrl = '/tech_atlas_opportunity.png'; // Local image from public folder
        console.log('✅ Using local opportunity image:', imageUrl);
      } else {
        // For events, generate and upload
        try {
          imageUrl = await generateAndUploadDefaultImage(submissionType);
        } catch (defaultError) {
          console.error('❌ Failed to generate default image:', defaultError);
          imageUrl = ""; // Empty string as final fallback
        }
      }
    }

    const baseData = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type || undefined,
      category: formData.category || undefined,
      tags: formData.tags ? formData.tags.split(",").map(s => s.trim()) : undefined,
      submitterName: formData.submitterName || undefined,
      imageUrl: imageUrl || undefined,
    };

    console.log('📦 Submitting data:', { ...baseData, imageUrl: imageUrl ? `${imageUrl.substring(0, 50)}...` : 'none' });

    if (submissionType === "event") {
      if (!formData.startDate) {
        toast.error("Start date is required for events");
        return;
      }

      console.log('📅 Creating event...');
      createEvent.mutate({
        ...baseData,
        startDate: new Date(formData.startDate),
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        location: formData.location || undefined,
        virtual: formData.virtual,
        meetingUrl: formData.virtual ? formData.url : undefined,
        registrationUrl: !formData.virtual ? formData.url : undefined,
        organizer: formData.organizer || undefined,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
      });
    } else {
      console.log('🎯 Creating opportunity...');
      createOpportunity.mutate({
        ...baseData,
        provider: formData.provider || undefined,
        amount: formData.amount || undefined,
        currency: formData.currency || undefined,
        applicationUrl: formData.url || undefined,
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

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Flyer/Image (Optional)</Label>
                <div className="space-y-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload a flyer or image for your {submissionType}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        PNG, JPG up to 5MB. If no image is provided, we'll generate a default one.
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Choose Image
                      </Button>
                    </div>
                  )}
                  
                  {/* Preview of default image */}
                  {!imagePreview && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600 mb-2">Default image preview:</p>
                      <img 
                        src={generateDefaultImagePreview(submissionType)} 
                        alt="Default preview" 
                        className="w-full max-w-md h-48 object-cover rounded-lg border opacity-75"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        This default image will be used if you don't upload one
                      </p>
                    </div>
                  )}
                </div>
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
                <p className="text-blue-700 dark:text-blue-300 mb-2">
                  <strong>✨ Anonymous Submissions Welcome:</strong> You can submit {submissionType === 'event' ? 'events' : 'opportunities'} without creating an account. 
                  Your submission will be published immediately and appear live on the platform.
                </p>
                <p className="text-blue-600 dark:text-blue-400 text-xs">
                  <strong>📋 Content Moderation:</strong> Platform moderators and admins will review submissions and may remove content that is irrelevant, 
                  illegal, spam, or violates our community guidelines. Quality submissions help build a valuable resource for the tech community.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
