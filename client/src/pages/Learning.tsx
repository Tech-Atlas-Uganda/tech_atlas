import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { BookOpen, Search, Plus, ExternalLink, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Learning() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");

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

  const categories = [
    "Web Development",
    "Mobile Development",
    "AI & Machine Learning",
    "Data Science",
    "Cybersecurity",
    "Hardware & IoT",
    "Product Management",
    "UI/UX Design",
  ];

  return (
    <div className="min-h-screen bg-background">
      
      
      <div className="container py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 mb-12"
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
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Level" />
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

        {/* Resources Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading resources...</div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No resources found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl flex-1">{resource.title}</CardTitle>
                      {resource.featured && (
                        <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 ml-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resource.type && (
                        <Badge variant="secondary">{resource.type}</Badge>
                      )}
                      {resource.level && (
                        <Badge variant="outline">{resource.level}</Badge>
                      )}
                      {resource.cost && (
                        <Badge variant="outline" className={resource.cost.toLowerCase() === "free" ? "text-green-600" : ""}>
                          {resource.cost}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <CardDescription className="line-clamp-3 mb-4 flex-1">
                      {resource.description || "No description available"}
                    </CardDescription>
                    
                    <div className="space-y-3 mt-auto">
                      {resource.provider && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Provider:</span> {resource.provider}
                        </div>
                      )}
                      
                      {resource.duration && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {resource.duration}
                        </div>
                      )}
                      
                      {resource.category && (
                        <div className="text-sm">
                          <Badge variant="outline" className="text-xs">{resource.category}</Badge>
                        </div>
                      )}
                      
                      {resource.tags && resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {resource.tags.slice(0, 3).map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {resource.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{resource.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {resource.url && (
                        <Button asChild className="w-full mt-4" variant="outline">
                          <a href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            View Resource
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
            {categories.map((category, index) => (
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
      </div>
    </div>
  );
}
