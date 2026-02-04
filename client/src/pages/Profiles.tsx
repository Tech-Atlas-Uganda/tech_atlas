import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Search, Github, Linkedin, Twitter, Globe, MapPin, Users, Plus, User, Mail, Briefcase } from "lucide-react";
import { Link } from "wouter";
import { CORE_CATEGORIES } from "../../../shared/const";

// Use standardized categories from shared constants

interface Person {
  id: number;
  name: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  github?: string;
  linkedin?: string;
  twitter?: string;
  website?: string;
  profilePicture?: string;
  isPublicProfile: boolean;
  showInDirectory: boolean;
  role?: string;
  company?: string;
  experience?: string;
}

export default function Profiles() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Fetch real users from database
  const { data: users, isLoading } = trpc.profiles.list.useQuery();

  // Convert database users to Person format for compatibility
  const people: Person[] = (users || []).map(user => ({
    id: user.id,
    name: user.name || 'Anonymous User',
    bio: user.bio || 'Tech enthusiast from Uganda',
    location: user.location || 'Uganda',
    role: user.role === 'admin' ? 'Platform Admin' : user.role === 'moderator' ? 'Community Moderator' : 'Community Member',
    company: '', // Not in user schema yet
    experience: '', // Not in user schema yet
    skills: user.skills || [],
    interests: [], // Derived from skills for now
    github: user.github || undefined,
    linkedin: user.linkedin || undefined,
    twitter: user.twitter || undefined,
    website: user.website || undefined,
    profilePicture: undefined, // Not implemented yet
    isPublicProfile: true, // All users are public for now
    showInDirectory: true, // All users show in directory for now
  }));

  const filteredPeople = people.filter(person => {
    if (!person.showInDirectory || !person.isPublicProfile) return false;
    
    const matchesSearch = !searchTerm || 
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      person.skills.some(skill => 
        skill.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        selectedCategory.toLowerCase().includes(skill.toLowerCase())
      );
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading community profiles...</p>
          </div>
        )}

        {/* Content - only show when not loading */}
        {!isLoading && (
          <>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              People Directory
            </h1>
            <p className="text-muted-foreground mt-2">
              Connect with {people.length}+ developers, designers, and tech professionals in Uganda's ecosystem
            </p>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/profile/settings">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <User className="h-4 w-4 mr-2" />
                  Manage Profile
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                <Users className="h-4 w-4 mr-2" />
                Sign in to Join
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {CORE_CATEGORIES.map((category: string) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* People Grid */}
        {filteredPeople.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {filteredPeople.map((person, index) => (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedPerson(person)}
                className="cursor-pointer group"
              >
                <Card className="h-full bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:bg-gradient-to-br group-hover:from-white/15 group-hover:to-white/5">
                  <CardContent className="p-4 text-center space-y-3">
                    {/* Avatar */}
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      {person.profilePicture ? (
                        <img 
                          src={person.profilePicture} 
                          alt={person.name}
                          className="w-full h-full rounded-full object-cover border-2 border-white/20"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {person.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">{person.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{person.role}</p>
                      {person.company && (
                        <p className="text-xs text-muted-foreground/80 truncate">{person.company}</p>
                      )}
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{person.location}</span>
                    </div>

                    {/* Top Skills */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {person.skills.slice(0, 2).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-xs px-2 py-0 bg-white/10 hover:bg-white/20 transition-colors">
                          {skill}
                        </Badge>
                      ))}
                      {person.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs px-2 py-0 border-white/30 hover:border-white/50 transition-colors">
                          +{person.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No profiles found matching your criteria.</p>
              {isAuthenticated ? (
                <Link href="/profile/settings">
                  <Button variant="outline">
                    Create your profile to be listed here
                  </Button>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sign in to create your profile and connect with the community
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Person Detail Modal */}
        <Dialog open={!!selectedPerson} onOpenChange={() => setSelectedPerson(null)}>
          <DialogContent className="max-w-2xl">
            {selectedPerson && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      {selectedPerson.profilePicture ? (
                        <img 
                          src={selectedPerson.profilePicture} 
                          alt={selectedPerson.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-2xl">
                          {selectedPerson.name?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedPerson.name}</h2>
                      <p className="text-muted-foreground">{selectedPerson.role}</p>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPerson.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedPerson.location}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h3 className="font-semibold mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{selectedPerson.bio}</p>
                  </div>

                  {/* Skills */}
                  <div>
                    <h3 className="font-semibold mb-2">Skills & Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div>
                    <h3 className="font-semibold mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPerson.interests.map((interest, i) => (
                        <Badge key={i} variant="outline">{interest}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Social Links */}
                  <div>
                    <h3 className="font-semibold mb-2">Connect</h3>
                    <div className="flex gap-3">
                      {selectedPerson.github && (
                        <a href={selectedPerson.github} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </a>
                      )}
                      {selectedPerson.linkedin && (
                        <a href={selectedPerson.linkedin} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        </a>
                      )}
                      {selectedPerson.twitter && (
                        <a href={selectedPerson.twitter} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Twitter className="h-4 w-4 mr-2" />
                            Twitter
                          </Button>
                        </a>
                      )}
                      {selectedPerson.website && (
                        <a href={selectedPerson.website} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4 mr-2" />
                            Website
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        </>
        )}
      </div>
    </div>
  );
}