import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { trpc } from "@/lib/trpc";
import { 
  Building2, 
  Users, 
  Rocket, 
  Briefcase, 
  Calendar, 
  BookOpen,
  Github,
  GitFork,
  Star,
  TrendingUp,
  Activity,
  Plus,
  Info,
  CheckCircle
} from "lucide-react";
import { motion } from "framer-motion";

interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
  updated_at: string;
}

interface GitHubContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export default function Dashboard() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [contributors, setContributors] = useState<GitHubContributor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmissionInfo, setShowSubmissionInfo] = useState(false);

  const { user } = useAuth();

  // Fetch real platform statistics from database
  const { data: stats, isLoading: statsLoading, error: statsError } = trpc.stats.getCounts.useQuery();

  // Show loading state or error state for stats
  const getStatValue = (value: number | undefined) => {
    if (statsLoading) return "...";
    if (statsError) return "0";
    return value || 0;
  };

  useEffect(() => {
    // Fetch Uganda tech repos
    const fetchGitHubData = async () => {
      try {
        const reposResponse = await fetch(
          'https://api.github.com/search/repositories?q=topic:uganda+topic:tech+OR+topic:uganda+topic:technology&sort=stars&per_page=6'
        );
        const reposData = await reposResponse.json();
        setRepos(reposData.items || []);

        // Fetch contributors from the top repo
        if (reposData.items && reposData.items[0]) {
          const contributorsResponse = await fetch(
            `https://api.github.com/repos/${reposData.items[0].full_name}/contributors?per_page=8`
          );
          const contributorsData = await contributorsResponse.json();
          setContributors(contributorsData || []);
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  const dashboardStats = [
    { label: "Tech Hubs", value: getStatValue(stats?.hubs), icon: Building2, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { label: "Communities", value: getStatValue(stats?.communities), icon: Users, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { label: "Startups", value: getStatValue(stats?.startups), icon: Rocket, color: "text-pink-500", bgColor: "bg-pink-500/10" },
    { label: "Job Listings", value: getStatValue(stats?.jobs), icon: Briefcase, color: "text-green-500", bgColor: "bg-green-500/10" },
    { label: "Events", value: getStatValue(stats?.events), icon: Calendar, color: "text-orange-500", bgColor: "bg-orange-500/10" },
    { label: "Blog Posts", value: getStatValue(stats?.blogPosts), icon: BookOpen, color: "text-cyan-500", bgColor: "bg-cyan-500/10" },
  ];

  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalContributors = contributors.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground font-['Space_Grotesk'] mb-2">
            Uganda Tech Ecosystem
          </h1>
          <p className="text-lg text-muted-foreground">
            Real-time insights into Uganda's technology landscape
          </p>
        </motion.div>

        {/* Ecosystem Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-3`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <p className="text-3xl font-bold text-foreground mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* GitHub Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{totalStars.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Stars</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <GitFork className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{totalForks.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Forks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-foreground">{totalContributors}</p>
                    <p className="text-sm text-muted-foreground">Contributors</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Featured Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Github className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl font-bold text-foreground font-['Space_Grotesk']">
                Featured Open Source Projects
              </h2>
            </div>
            <Dialog open={showSubmissionInfo} onOpenChange={setShowSubmissionInfo}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Submit Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Github className="h-5 w-5 text-blue-500" />
                    Submit Your Project
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Projects are curated by our moderators to showcase Uganda's best tech innovations.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">Requirements</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Created by Ugandan developers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Open source with documentation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Active development</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span>Community value</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <h3 className="font-semibold text-foreground mb-2">How to Submit</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Email us with your GitHub URL and project description:
                    </p>
                    <p className="text-sm font-medium text-blue-400">
                      projects@techatlasug.com
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => window.open('mailto:projects@techatlas.ug?subject=Project Submission', '_blank')}
                    >
                      Send Email
                    </Button>
                    <Button variant="outline" onClick={() => setShowSubmissionInfo(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <Activity className="h-8 w-8 animate-spin mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Loading GitHub repositories...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {repos.map((repo, index) => (
                <motion.div
                  key={repo.full_name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg line-clamp-1">
                          <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-blue-500 transition-colors"
                          >
                            {repo.name}
                          </a>
                        </CardTitle>
                        {repo.language && (
                          <Badge variant="outline" className="text-xs">
                            {repo.language}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {repo.description || "No description available"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{repo.stargazers_count.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitFork className="h-4 w-4 text-blue-500" />
                          <span>{repo.forks_count.toLocaleString()}</span>
                        </div>
                        {repo.open_issues_count > 0 && (
                          <div className="flex items-center gap-1">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span>{repo.open_issues_count}</span>
                          </div>
                        )}
                      </div>
                      {repo.topics && repo.topics.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {repo.topics.slice(0, 3).map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Top Contributors */}
        {contributors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-foreground" />
              <h2 className="text-2xl font-bold text-foreground font-['Space_Grotesk']">
                Top Contributors
              </h2>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {contributors.map((contributor, index) => (
                    <motion.a
                      key={contributor.login}
                      href={contributor.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <img
                        src={contributor.avatar_url}
                        alt={contributor.login}
                        className="w-16 h-16 rounded-full border-2 border-border"
                      />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground truncate w-full">
                          {contributor.login}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contributor.contributions} commits
                        </p>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
