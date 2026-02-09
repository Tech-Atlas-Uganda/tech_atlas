import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { CORE_CATEGORIES } from "../../../shared/const";
import { BookOpen, Search, Plus, ExternalLink, Award, Clock, User, DollarSign, Tag, Star, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIResourceAgent } from "@/components/AIResourceAgent";

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [selectedResource, setSelectedResource] = useState<any>(null);

  const { data: resources, isLoading } = trpc.learning.list.useQuery({ status: "approved" });

  const filterResources = (items: any[] | undefined) => {
    if (!items) return [];
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter(item => item.level === levelFilter);
    }

    return filtered;
  };

  const filteredResources = filterResources(resources);

  const CompactResourceCard = ({ resource, index }: { resource: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={() => setSelectedResource(resource)}
    >
      <Card className="h-full hover:shadow-md transition-all duration-200 hover:border-primary/30 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-base leading-tight truncate">{resource.title}</h3>
                {resource.featured && (
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-xs px-1.5 py-0.5">
                    Featured
                  </Badge>
                )}
              </div>
              
              {resource.provider && (
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <User className="h-3.5 w-3.5 mr-1.5" />
                  <span className="truncate">{resource.provider}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-1.5">
                {resource.type && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-blue-200 text-blue-700 bg-blue-50">
                    {resource.type}
                  </Badge>
                )}
                
                {resource.level && (
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {resource.level}
                  </Badge>
                )}
                
                {resource.cost && (
                  <Badge 
                    variant="outline" 
                    className={`text-xs px-2 py-0.5 ${resource.cost.toLowerCase() === "free" ? "border-green-200 text-green-700 bg-green-50" : "border-orange-200 text-orange-700 bg-orange-50"}`}
                  >
                    {resource.cost}
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              {resource.duration && (
                <div className="text-sm font-medium text-primary mb-1">
                  {resource.duration}
                </div>
              )}
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {new Date(resource.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardHeader>
        
        {resource.description && (
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {resource.description}
            </p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );

  const ResourceDetailModal = ({ resource, onClose }: { resource: any; onClose: () => void }) => (
    <Dialog open={!!resource} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{resource.title}</DialogTitle>
              {resource.provider && (
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{resource.provider}</span>
                </div>
              )}
            </div>
            <div className="text-right">
              {resource.cost && (
                <div className={`text-lg font-bold mb-1 ${resource.cost.toLowerCase() === 'free' ? 'text-green-600' : 'text-primary'}`}>
                  {resource.cost}
                </div>
              )}
              <Badge variant="outline" className="border-blue-500 text-blue-600">
                Learning Resource
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {resource.type && (
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.type}</span>
                </div>
              )}
              
              {resource.level && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.level} Level</span>
                </div>
              )}
              
              {resource.category && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.category}</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {resource.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.duration}</span>
                </div>
              )}
              
              {resource.cost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{resource.cost}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Added {new Date(resource.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {resource.description && (
            <div>
              <h4 className="font-semibold mb-2">About This Resource</h4>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {resource.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Topics Covered</h4>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Access Resource */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Access Resource</h4>
            <div className="flex flex-wrap gap-3">
              {resource.url ? (
                <Button asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Resource
                  </a>
                </Button>
              ) : (
                <Button disabled>
                  <Globe className="h-4 w-4 mr-2" />
                  No URL Available
                </Button>
              )}
            </div>
            
            {resource.cost && resource.cost.toLowerCase() === 'free' && (
              <p className="text-sm text-green-600 mt-2">✨ This resource is completely free!</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
                Learning Hub
              </h1>
              <p className="text-lg text-muted-foreground">
                Curated resources, bootcamps, and mentorship programs
              </p>
            </div>
            <Button asChild>
              <Link href="/submit/resource">
                <a className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Share Resource
                </a>
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CORE_CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* AI Resource Agent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <AIResourceAgent />
        </motion.div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {filteredResources.map((resource, index) => (
              <CompactResourceCard 
                key={resource.id}
                resource={resource} 
                index={index} 
              />
            ))}
          </div>
        )}

        {/* Career Roadmaps Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-['Space_Grotesk'] mb-4">
              Career Roadmaps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured learning paths to guide your journey in tech
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_CATEGORIES.map((category, index) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Explore the learning path for {category.toLowerCase()}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedResource && (
            <ResourceDetailModal 
              resource={selectedResource} 
              onClose={() => setSelectedResource(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}