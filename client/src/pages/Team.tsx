import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Code, Users, Target } from "lucide-react";

const teamMembers = [
  {
    name: "Tech Atlas Team",
    role: "Core Contributors",
    bio: "Building Uganda's open-source tech ecosystem platform",
    avatar: "",
    github: "https://github.com",
    linkedin: "",
    twitter: "",
  },
];

const values = [
  {
    icon: Users,
    title: "Community First",
    description: "Built by the ecosystem, for the ecosystem. Every feature serves the community's needs.",
  },
  {
    icon: Code,
    title: "Open Source",
    description: "Transparent, collaborative, and accessible. Our code is open for everyone to contribute.",
  },
  {
    icon: Target,
    title: "Impact Driven",
    description: "Focused on creating real value and connections within Uganda's tech landscape.",
  },
  {
    icon: Heart,
    title: "Passion Powered",
    description: "Driven by love for technology and commitment to growing Uganda's digital future.",
  },
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground font-['Space_Grotesk'] mb-4">
            About Tech Atlas
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            An open-source platform mapping and connecting Uganda's technology ecosystem. 
            Built with passion, powered by community.
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-['Space_Grotesk']">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Tech Atlas exists to solve a fundamental problem in Uganda's tech ecosystem: fragmentation. 
                Information about hubs, communities, startups, jobs, and opportunities is scattered across 
                countless platforms and personal networks. We're building the definitive, community-owned 
                platform that brings everything together in one place—making it easier for everyone to 
                discover opportunities, connect with others, and contribute to the growth of Uganda's 
                technology sector.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center font-['Space_Grotesk']">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center font-['Space_Grotesk']">
            The Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-all">
                  <CardHeader className="text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription>
                      <Badge variant="secondary">{member.role}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                    <div className="flex justify-center gap-2">
                      {member.github && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.linkedin && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.twitter && (
                        <Button variant="ghost" size="icon" asChild>
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Get Involved */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4 font-['Space_Grotesk']">
                Get Involved
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Tech Atlas is a community project. Whether you're a developer, designer, content creator, 
                or just passionate about Uganda's tech ecosystem, there's a place for you to contribute.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5 mr-2" />
                    Contribute on GitHub
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="mailto:hello@techatlas.ug">
                    <Mail className="h-5 w-5 mr-2" />
                    Get in Touch
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
