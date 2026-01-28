import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { MapPin, Briefcase, BookOpen, Calendar, FileText, Users, TrendingUp, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const features = [
    {
      icon: MapPin,
      title: "Ecosystem Mapping",
      description: "Discover tech hubs, communities, and startups across Uganda with interactive maps and verified profiles.",
      href: "/ecosystem",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Briefcase,
      title: "Jobs & Gigs",
      description: "Find full-time positions, internships, freelance opportunities, and paid tech help in one marketplace.",
      href: "/jobs",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BookOpen,
      title: "Learning Hub",
      description: "Access curated resources, career roadmaps, bootcamps, and mentorship programs for every skill level.",
      href: "/learning",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Calendar,
      title: "Events & Opportunities",
      description: "Stay updated on hackathons, meetups, workshops, grants, fellowships, and scholarships.",
      href: "/events",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: FileText,
      title: "Blog & Stories",
      description: "Read community spotlights, startup journeys, career guidance, and ecosystem insights.",
      href: "/blog",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Users,
      title: "Community Governance",
      description: "Contribute, moderate, and shape the platform through transparent community-driven processes.",
      href: "/about",
      gradient: "from-pink-500 to-rose-500",
    },
  ];

  const stats = [
    { icon: Users, label: "Communities", value: "50+" },
    { icon: Briefcase, label: "Active Jobs", value: "200+" },
    { icon: Calendar, label: "Events/Month", value: "30+" },
    { icon: TrendingUp, label: "Growth Rate", value: "40%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background pointer-events-none" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center space-y-8"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent font-['Space_Grotesk']">
                Uganda's Tech Ecosystem
              </span>
              <br />
              <span className="text-foreground">Mapped and Connected</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              The open platform connecting communities, opportunities, and resources across Uganda's technology landscape. Built by the ecosystem, for the ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/ecosystem">
                  <a className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Explore Ecosystem
                  </a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/jobs">
                  <a className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Find Opportunities
                  </a>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/40 bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center space-y-2"
                >
                  <Icon className="h-8 w-8 mx-auto text-primary" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
              Everything You Need in One Place
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tech Atlas brings together all the essential resources, opportunities, and connections to help you thrive in Uganda's tech ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={feature.href}>
                    <a>
                      <Card className="h-full hover:shadow-xl transition-smooth hover:-translate-y-1 border-border/50 group">
                        <CardHeader>
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <CardTitle className="text-xl font-['Space_Grotesk']">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-base">
                            {feature.description}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </a>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-primary/10 via-accent/5 to-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-foreground font-['Space_Grotesk']">
              Join the Movement
            </h2>
            <p className="text-lg text-muted-foreground">
              Tech Atlas is built on community contributions. Share your knowledge, list opportunities, and help build Uganda's digital future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/contribute">
                  <a>Start Contributing</a>
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/about">
                  <a>Learn More</a>
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-bold text-lg font-['Space_Grotesk']">Tech Atlas</h3>
              <p className="text-sm text-muted-foreground">
                Uganda's open platform for tech ecosystem mapping and community connection.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/ecosystem"><a className="hover:text-foreground transition-smooth">Ecosystem</a></Link></li>
                <li><Link href="/jobs"><a className="hover:text-foreground transition-smooth">Jobs & Gigs</a></Link></li>
                <li><Link href="/learning"><a className="hover:text-foreground transition-smooth">Learning</a></Link></li>
                <li><Link href="/events"><a className="hover:text-foreground transition-smooth">Events</a></Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Community</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog"><a className="hover:text-foreground transition-smooth">Blog</a></Link></li>
                <li><Link href="/contribute"><a className="hover:text-foreground transition-smooth">Contribute</a></Link></li>
                <li><Link href="/governance"><a className="hover:text-foreground transition-smooth">Governance</a></Link></li>
                <li><Link href="/about"><a className="hover:text-foreground transition-smooth">About</a></Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy"><a className="hover:text-foreground transition-smooth">Privacy Policy</a></Link></li>
                <li><Link href="/terms"><a className="hover:text-foreground transition-smooth">Terms of Service</a></Link></li>
                <li><Link href="/code-of-conduct"><a className="hover:text-foreground transition-smooth">Code of Conduct</a></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© 2026 Tech Atlas. Built with ❤️ by Uganda's tech community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
