import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { 
  User, 
  MapPin, 
  Globe, 
  Camera,
  Plus,
  X,
  Save,
  Eye,
  Upload,
  Loader2
} from "lucide-react";
import { CORE_CATEGORIES } from "../../../shared/const";

interface UserProfile {
  name: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
  skills: string[];
  interests: string[];
  categories: string[];
  profilePicture: string;
  isPublicProfile: boolean;
  showInDirectory: boolean;
}

export default function ProfileSettings() {
  const { user: authUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch user profile from database
  const { data: user, refetch, isLoading: isLoadingProfile, error: profileError } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !!authUser,
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once
    retryDelay: 1000, // Wait 1 second before retry
  });
  
  const updateProfileMutation = trpc.user.updateProfile.useMutation({
    onSuccess: async () => {
      toast.success("Profile updated successfully!");
      await refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
  
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
    skills: [],
    interests: [],
    categories: [],
    profilePicture: "",
    isPublicProfile: false,
    showInDirectory: false,
  });
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        bio: user.bio || "",
        location: user.location || "",
        website: user.website || "",
        github: user.github || "",
        linkedin: user.linkedin || "",
        twitter: user.twitter || "",
        skills: Array.isArray(user.skills) ? user.skills : [],
        interests: [],
        categories: [],
        profilePicture: user.avatar || "",
        isPublicProfile: user.isPublic ?? false,
        showInDirectory: user.isPublic ?? false,
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const addCategory = () => {
    if (selectedCategory && !profile.categories.includes(selectedCategory)) {
      setProfile(prev => ({
        ...prev,
        categories: [...prev.categories, selectedCategory]
      }));
      setSelectedCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setProfile(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category)
    }));
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authUser) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Delete old avatar if exists
      if (profile.profilePicture) {
        const oldFileName = profile.profilePicture.split('/').pop();
        if (oldFileName) {
          await supabase.storage
            .from('avatars')
            .remove([oldFileName]);
        }
      }

      // Upload to Supabase Storage
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      console.log('Avatar uploaded successfully:', publicUrl);

      // Update profile state
      setProfile(prev => ({ ...prev, profilePicture: publicUrl }));
      
      // Save to database immediately
      await updateProfileMutation.mutateAsync({
        avatar: publicUrl,
      });
      
      toast.success("Avatar uploaded successfully!");
    } catch (error: any) {
      console.error("Avatar upload error:", error);
      toast.error(`Failed to upload avatar: ${error.message || 'Unknown error'}`);
    } finally {
      setIsUploadingAvatar(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!authUser) return;
    
    setIsLoading(true);
    try {
      await updateProfileMutation.mutateAsync({
        name: profile.name,
        bio: profile.bio,
        skills: profile.skills,
        location: profile.location,
        website: profile.website,
        github: profile.github,
        twitter: profile.twitter,
        linkedin: profile.linkedin,
        isPublic: profile.isPublicProfile,
        avatar: profile.profilePicture,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      // Error is already handled by the mutation's onError
    } finally {
      setIsLoading(false);
    }
  };

  // Show error state if profile fails to load
  if (profileError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-red-500">Failed to Load Profile</CardTitle>
              <CardDescription>
                {profileError.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This usually means you need to sign out and sign in again to refresh your session.
              </p>
              <Button 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  // Show loading state while fetching profile
  if (isLoadingProfile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your profile information and privacy settings
            </p>
          </motion.div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your basic profile information that will be displayed to others
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Profile Picture */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                        {profile.profilePicture ? (
                          <img 
                            src={profile.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-8 w-8 text-white" />
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingAvatar}
                      >
                        {isUploadingAvatar ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Camera className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Click the camera icon to upload a profile picture (max 5MB)
                      </p>
                      {isUploadingAvatar && (
                        <p className="text-sm text-blue-500 flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Uploading...
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell others about yourself, your interests, and what you do..."
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => handleInputChange("location", e.target.value)}
                        placeholder="City, Country"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="space-y-3">
                    <Label>Professional Categories</Label>
                    <p className="text-sm text-muted-foreground">
                      Select categories that best describe your professional focus areas
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {profile.categories.map((category) => (
                        <Badge key={category} variant="default" className="flex items-center gap-1">
                          {category}
                          <button
                            onClick={() => removeCategory(category)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a category to add..." />
                        </SelectTrigger>
                        <SelectContent>
                          {CORE_CATEGORIES.filter(cat => !profile.categories.includes(cat)).map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={addCategory} size="sm" disabled={!selectedCategory}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-3">
                    <Label>Skills & Technologies</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill (e.g., React, Python, Design)"
                        onKeyDown={(e) => e.key === "Enter" && addSkill()}
                      />
                      <Button onClick={addSkill} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="space-y-3">
                    <Label>Interests & Hobbies</Label>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest) => (
                        <Badge key={interest} variant="outline" className="flex items-center gap-1">
                          {interest}
                          <button
                            onClick={() => removeInterest(interest)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        placeholder="Add an interest (e.g., AI, Startups, Music)"
                        onKeyDown={(e) => e.key === "Enter" && addInterest()}
                      />
                      <Button onClick={addInterest} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Social Links
                  </CardTitle>
                  <CardDescription>
                    Connect your social profiles to help others find and connect with you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website/Portfolio</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="website"
                        value={profile.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="github"
                        value={profile.github}
                        onChange={(e) => handleInputChange("github", e.target.value)}
                        placeholder="github.com/username"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="linkedin"
                        value={profile.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                        placeholder="linkedin.com/in/username"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="twitter"
                        value={profile.twitter}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                        placeholder="twitter.com/username"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control how your profile appears to others on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Public Profile</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow others to view your profile information
                      </p>
                    </div>
                    <Switch
                      checked={profile.isPublicProfile}
                      onCheckedChange={(checked) => handleInputChange("isPublicProfile", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show in People Directory</Label>
                      <p className="text-sm text-muted-foreground">
                        Include your profile in the public people directory
                      </p>
                    </div>
                    <Switch
                      checked={profile.showInDirectory}
                      onCheckedChange={(checked) => handleInputChange("showInDirectory", checked)}
                    />
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">What others can see:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Your name and profile picture</li>
                      <li>• Your bio and location</li>
                      <li>• Your skills and interests</li>
                      <li>• Your social links (if provided)</li>
                      <li>• Content you've submitted to the platform</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}