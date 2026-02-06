import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Globe, Github, Twitter, Linkedin, Save, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Profile() {
  const { user: authUser, loading: authLoading } = useAuth();
  
  // Fetch full user profile from database
  const { data: user, isLoading: profileLoading } = trpc.user.getProfile.useQuery(undefined, {
    enabled: !!authUser,
  });

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!authUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to view your profile</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
                My Profile
              </h1>
              <p className="text-lg text-muted-foreground">
                View your profile information
              </p>
            </div>
            <Link href="/settings">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>

          <div className="space-y-6">
            {/* Avatar Display */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="relative">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.name || "No name set"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="outline" className="mt-2">{user.role}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Status */}
            <Card className={user.isPublic ? "border-2 border-green-500/20 bg-green-500/5" : "border-2 border-gray-500/20 bg-gray-500/5"}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {user.isPublic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                      Profile Visibility
                    </CardTitle>
                    <CardDescription>
                      {user.isPublic 
                        ? "Your profile is visible to everyone" 
                        : "Your profile is private and hidden from public listings"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="text-lg">{user.name || "Not set"}</p>
                </div>

                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="text-lg">{user.email}</p>
                </div>

                {user.bio && (
                  <div>
                    <Label className="text-muted-foreground">Bio</Label>
                    <p className="text-lg whitespace-pre-wrap">{user.bio}</p>
                  </div>
                )}

                {user.skills && user.skills.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground">Skills</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {user.location && (
                  <div>
                    <Label className="text-muted-foreground">Location</Label>
                    <p className="text-lg flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {(user.website || user.github || user.twitter || user.linkedin) && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {user.website && (
                    <a
                      href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>{user.website}</span>
                    </a>
                  )}
                  {user.github && (
                    <a
                      href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={user.twitter.startsWith('http') ? user.twitter : `https://twitter.com/${user.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Twitter className="h-4 w-4" />
                      <span>Twitter/X</span>
                    </a>
                  )}
                  {user.linkedin && (
                    <a
                      href={user.linkedin.startsWith('http') ? user.linkedin : `https://linkedin.com/in/${user.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Role</span>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Member since</span>
                  <span className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
