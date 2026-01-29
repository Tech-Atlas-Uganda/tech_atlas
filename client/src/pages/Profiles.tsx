import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, Github, Linkedin, Twitter, Globe, MapPin, Briefcase, Plus } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Profiles() {
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const { data: profiles, isLoading } = trpc.profiles.list.useQuery();

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = !searchTerm || 
      profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = !selectedSkill || 
      (Array.isArray(profile.skills) && profile.skills.some(s => s.toLowerCase().includes(selectedSkill.toLowerCase())));
    
    return matchesSearch && matchesSkill;
  });

  const allSkills = profiles?.flatMap(p => Array.isArray(p.skills) ? p.skills : []) || [];
  const uniqueSkills = Array.from(new Set(allSkills)).slice(0, 20);

  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Tech Talent Directory
            </h1>
            <p className="text-slate-400 mt-2">
              Discover developers, designers, and tech professionals in Uganda
            </p>
          </div>
          {isAuthenticated && (
            <Link href="/profile-settings">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Plus className="h-4 w-4 mr-2" />
                Create/Edit Profile
              </Button>
            </Link>
          )}
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name, bio, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSkill === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSkill(null)}
              >
                All Skills
              </Button>
              {uniqueSkills.map(skill => (
                <Button
                  key={skill}
                  variant={selectedSkill === skill ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSkill(skill)}
                >
                  {skill}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Loading profiles...</p>
          </div>
        ) : filteredProfiles && filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile: any, index: number) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-slate-900/50 border-slate-800 hover:border-blue-500/50 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-white">{profile.name}</CardTitle>
                        {profile.location && (
                          <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {profile.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile.bio && (
                      <p className="text-slate-300 text-sm line-clamp-3">{profile.bio}</p>
                    )}

                    {profile.skills && (
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(profile.skills) ? profile.skills : []).slice(0, 5).map((skill: string, i: number) => (
                          <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {profile.github && (
                        <a href={profile.github} target="_blank" rel="noopener noreferrer" 
                           className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                          <Github className="h-4 w-4 text-slate-400" />
                        </a>
                      )}
                      {profile.linkedin && (
                        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                           className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                          <Linkedin className="h-4 w-4 text-slate-400" />
                        </a>
                      )}
                      {profile.twitter && (
                        <a href={profile.twitter} target="_blank" rel="noopener noreferrer"
                           className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                          <Twitter className="h-4 w-4 text-slate-400" />
                        </a>
                      )}
                      {profile.website && (
                        <a href={profile.website} target="_blank" rel="noopener noreferrer"
                           className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors">
                          <Globe className="h-4 w-4 text-slate-400" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="py-12 text-center">
              <Briefcase className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No profiles found matching your criteria.</p>
              {isAuthenticated && (
                <Link href="/profile-settings">
                  <Button className="mt-4" variant="outline">
                    Be the first to create a profile
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
