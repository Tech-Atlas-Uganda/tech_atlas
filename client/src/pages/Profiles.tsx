import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Search, Globe, MapPin, Users, User, Briefcase, Share2, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { CORE_CATEGORIES } from "../../../shared/const";
import { toast } from "sonner";

// Use standardized categories from shared constants

interface Person {
  id: number;
  name: string;
  bio: string;
  location: string;
  skills: string[];
  interests: string[];
  categories: string[]; // Add categories field
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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Fetch real users from database
  const { data: users, isLoading } = trpc.profiles.list.useQuery();

  // Convert database users to Person format for compatibility
  const people: Person[] = (users || []).map(user => ({
    id: user.id,
    name: user.name || 'Anonymous User',
    bio: user.bio || '',
    location: user.location || 'Uganda',
    role: user.role === 'admin' ? 'Platform Admin' : user.role === 'moderator' ? 'Community Moderator' : 'Community Member',
    company: '', // Not in user schema yet
    experience: '', // Not in user schema yet
    skills: Array.isArray(user.skills) ? user.skills : [],
    interests: [], // Derived from skills for now
    categories: Array.isArray((user as any).categories) ? (user as any).categories : [],
    github: user.github || undefined,
    linkedin: user.linkedin || undefined,
    twitter: user.twitter || undefined,
    website: user.website || undefined,
    profilePicture: (user as any).avatar || undefined,
    isPublicProfile: (user as any).isPublic ?? false,
    showInDirectory: (user as any).isPublic ?? false,
  }));

  // Enhanced filtering function
  const filteredPeople = people.filter(person => {
    if (!person.showInDirectory || !person.isPublicProfile) return false;
    
    // Search filter
    const matchesSearch = !searchTerm || 
      person.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === "all" || 
      person.categories.includes(categoryFilter) ||
      person.skills.some(skill => 
        skill.toLowerCase().includes(categoryFilter.toLowerCase()) ||
        categoryFilter.toLowerCase().includes(skill.toLowerCase())
      );
    
    // Location filter
    const matchesLocation = locationFilter === "all" ||
      person.location?.toLowerCase().includes(locationFilter.toLowerCase());
    
    // Role filter
    const matchesRole = roleFilter === "all" ||
      person.role?.toLowerCase().includes(roleFilter.toLowerCase());
    
    // Experience filter
    const matchesExperience = experienceFilter === "all" ||
      person.experience?.toLowerCase().includes(experienceFilter.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRole && matchesExperience;
  });

  // Get unique values for filters
  const uniqueLocations = Array.from(new Set(
    people.map(person => person.location).filter(Boolean)
  )).sort();

  const uniqueRoles = Array.from(new Set(
    people.map(person => person.role).filter(Boolean)
  )).sort();

  const uniqueExperience = Array.from(new Set(
    people.map(person => person.experience).filter(Boolean)
  )).sort();

  // Clear filters function
  const clearAllFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setLocationFilter("all");
    setRoleFilter("all");
    setExperienceFilter("all");
  };

  // Check if any filters are active
  const hasActiveFilters = searchTerm || categoryFilter !== "all" || locationFilter !== "all" || 
    roleFilter !== "all" || experienceFilter !== "all";

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
            {/* Search and Clear Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, role, company, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CORE_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location || "unknown"}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {uniqueRoles.map(role => (
                    <SelectItem key={role} value={role || "unknown"}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Experience Filter */}
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Experience</SelectItem>
                  {uniqueExperience.length > 0 ? uniqueExperience.map(exp => (
                    <SelectItem key={exp} value={exp || "unknown"}>{exp}</SelectItem>
                  )) : (
                    <>
                      <SelectItem value="entry">Entry Level</SelectItem>
                      <SelectItem value="mid">Mid Level</SelectItem>
                      <SelectItem value="senior">Senior Level</SelectItem>
                      <SelectItem value="lead">Lead/Principal</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredPeople.length} of {people.length} profiles{hasActiveFilters && " (filtered)"}</span>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Active filters:</span>
                {searchTerm && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm("")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {locationFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Location: {locationFilter}
                    <button onClick={() => setLocationFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {roleFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Role: {roleFilter}
                    <button onClick={() => setRoleFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
                {experienceFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Experience: {experienceFilter}
                    <button onClick={() => setExperienceFilter("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                      ×
                    </button>
                  </Badge>
                )}
              </div>
            )}
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

                  {/* Categories */}
                  {selectedPerson.categories.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">Professional Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedPerson.categories.map((category, i) => (
                          <Badge key={i} variant="default">{category}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

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
                            <Globe className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        </a>
                      )}
                      {selectedPerson.linkedin && (
                        <a href={selectedPerson.linkedin} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4 mr-2" />
                            LinkedIn
                          </Button>
                        </a>
                      )}
                      {selectedPerson.twitter && (
                        <a href={selectedPerson.twitter} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" variant="outline">
                            <Globe className="h-4 w-4 mr-2" />
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

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        const profileUrl = `${window.location.origin}/profile/${selectedPerson.id}`;
                        navigator.clipboard.writeText(profileUrl);
                        toast.success("Profile link copied to clipboard!");
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Profile
                    </Button>
                    <Link href={`/profile/${selectedPerson.id}`}>
                      <Button className="flex-1">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                    </Link>
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