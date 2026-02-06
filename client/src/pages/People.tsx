import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, MapPin, Search, Globe, Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

interface PublicUser {
  id: number;
  name: string | null;
  bio: string | null;
  skills: string[] | null;
  location: string | null;
  website: string | null;
  github: string | null;
  twitter: string | null;
  linkedin: string | null;
  avatar: string | null;
  role: string;
  createdAt: Date;
}

export default function People() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);

  const { data: users, isLoading } = trpc.user.listPublicProfiles.useQuery();

  const filteredUsers = users?.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
              Community Members
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with developers, designers, and tech enthusiasts
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, skills, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'}
          </div>

          {/* User Grid */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No members found matching your search</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card
                    className="h-full cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                    onClick={() => setSelectedUser(user)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-3 mb-2">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || "User"}
                            className="w-12 h-12 rounded-full object-cover border-2 border-border"
                          />
                        ) : (
                          <div className="p-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <User className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg line-clamp-1">
                            {user.name || "Anonymous User"}
                          </CardTitle>
                          <Badge variant="outline" className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      {user.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{user.location}</span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      {user.bio && (
                        <CardDescription className="line-clamp-2 text-sm mb-3">
                          {user.bio}
                        </CardDescription>
                      )}
                      {user.skills && user.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {user.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{user.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* User Detail Modal */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedUser && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-3">
                    {selectedUser.avatar ? (
                      <img
                        src={selectedUser.avatar}
                        alt={selectedUser.name || "User"}
                        className="w-16 h-16 rounded-full object-cover border-2 border-border"
                      />
                    ) : (
                      <div className="p-3 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <DialogTitle className="text-2xl mb-2">
                        {selectedUser.name || "Anonymous User"}
                      </DialogTitle>
                      <Badge variant="outline">{selectedUser.role}</Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {selectedUser.location && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Location
                      </h4>
                      <p className="text-muted-foreground">{selectedUser.location}</p>
                    </div>
                  )}

                  {selectedUser.bio && (
                    <div>
                      <h4 className="font-semibold mb-2">About</h4>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {selectedUser.bio}
                      </p>
                    </div>
                  )}

                  {selectedUser.skills && selectedUser.skills.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedUser.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {(selectedUser.website || selectedUser.github || selectedUser.twitter || selectedUser.linkedin) && (
                    <div>
                      <h4 className="font-semibold mb-3">Links</h4>
                      <div className="space-y-2">
                        {selectedUser.website && (
                          <a
                            href={selectedUser.website.startsWith('http') ? selectedUser.website : `https://${selectedUser.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="truncate">{selectedUser.website}</span>
                          </a>
                        )}
                        {selectedUser.github && (
                          <a
                            href={selectedUser.github.startsWith('http') ? selectedUser.github : `https://github.com/${selectedUser.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {selectedUser.twitter && (
                          <a
                            href={selectedUser.twitter.startsWith('http') ? selectedUser.twitter : `https://twitter.com/${selectedUser.twitter.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <Twitter className="h-4 w-4" />
                            <span>Twitter/X</span>
                          </a>
                        )}
                        {selectedUser.linkedin && (
                          <a
                            href={selectedUser.linkedin.startsWith('http') ? selectedUser.linkedin : `https://linkedin.com/in/${selectedUser.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors"
                          >
                            <Linkedin className="h-4 w-4" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      Member since {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
