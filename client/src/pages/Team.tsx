import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail, Heart, Code, Users, Target, Shield, User, ExternalLink } from "lucide-react";

const teamMembers = [
  {
    id: 1,
    name: "Ronnie Atuhaire",
    role: "Founder",
    shortBio: "Tech enthusiast, social entrepreneur, and tech community builder from Uganda.",
    fullBio: "I am a tech enthusiast, social entrepreneur, and tech community builder from Uganda. One of my notable accomplishments is co-founding MpaMpe, a crowdfunding startup that aims to address financial barriers in education.\n\nThrough MpaMpe, we have been recognized in many prestigious competitions, including Google, MTN MoMo Hackathon, FITSPA, and many others.\n\nI'm passionate about building technology solutions that create real impact in our communities and fostering the growth of Uganda's tech ecosystem.",
    github: "https://github.com/ronlin1",
    linkedin: "",
    twitter: "",
    email: "ronnie@techatlas.ug",
  },
  {
    id: 2,
    name: "Sumaiya Nalukwago",
    role: "Community Lead",
    shortBio: "Community Builder & Manager who creates inclusive spaces for learning and growth.",
    fullBio: "🤝 Community Builder & Manager\nI live to create inclusive spaces for learning and growth. I'm proud to work with communities like Women Techmakers Mbarara, PyCon Uganda, Indabax Uganda, and GDG Cloud Mbarara, and I'm always looking for ways to connect with more people.\n\n🗣️ Global Speaker\nI share my tech journey and experience on stages around the world, from global conferences to local meetups. It's all about inspiring the next person to start their tech journey.\n\n🎥 Tech Content Creator\nI use my platforms to share my tech lifestyle, career insights, and behind-the-scenes looks at the industry. You can catch my content on my YouTube channel, 'Tech Over with Sumaiya,' and across my social media.",
    github: "https://github.com/sumaiyanalukwago",
    linkedin: "",
    twitter: "",
    youtube: "https://youtube.com/@techoversumaiya",
  },
  {
    id: 3,
    name: "Shakiran Nannyombi",
    role: "Platform Lead",
    shortBio: "Software Engineer proficient in JavaScript and Python with passion for data science.",
    fullBio: "Software Engineer\nI am a programmer who is proficient in JavaScript and Python, with a strong passion for data science and frontend engineering.\n\nI love building scalable web applications and exploring the intersection of technology and data to create meaningful solutions.\n\nMy expertise spans across modern web technologies, and I'm particularly interested in creating user-friendly interfaces that make complex data accessible and actionable.",
    github: "https://github.com/Shakiran-Nannyombi",
    linkedin: "",
    twitter: "",
  },
];

const moderators = [
  {
    id: 1,
    name: "Community Moderator 1",
    role: "Content Moderator",
    shortBio: "Ensuring quality and authenticity of ecosystem submissions",
    fullBio: "Content Moderation Excellence\nAs a Content Moderator, I work tirelessly to ensure that all submissions to Tech Atlas meet our community standards for quality, accuracy, and relevance.\n\nI review job postings, event submissions, learning resources, and startup profiles to maintain the integrity of our platform.\n\nMy goal is to create a trusted environment where users can find reliable information about Uganda's tech ecosystem.",
    github: "https://github.com",
    linkedin: "",
    twitter: "",
  },
  {
    id: 2,
    name: "Community Moderator 2",
    role: "Forum Moderator",
    shortBio: "Maintaining healthy discussions and community guidelines",
    fullBio: "Forum Leadership\nI oversee our community forum to ensure discussions remain constructive, respectful, and valuable to all participants.\n\nMy role involves moderating conversations, enforcing community guidelines, and fostering an inclusive environment where tech professionals can share knowledge, ask questions, and build meaningful connections.\n\nI believe in the power of community-driven learning and collaboration.",
    github: "https://github.com",
    linkedin: "",
    twitter: "",
  },
  {
    id: 3,
    name: "Community Moderator 3",
    role: "Events Curator",
    shortBio: "Curating and verifying tech events and opportunities",
    fullBio: "Events & Opportunities\nAs an Events Curator, I focus on discovering, verifying, and promoting tech events, workshops, conferences, and opportunities across Uganda.\n\nI work closely with event organizers, tech communities, and educational institutions to ensure our events calendar is comprehensive and up-to-date.\n\nMy passion lies in connecting people with learning and networking opportunities that can advance their tech careers.",
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
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [selectedModerator, setSelectedModerator] = useState<any>(null);

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

        {/* Moderators Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4 text-center font-['Space_Grotesk']">
            Community Moderators
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our trusted moderators help maintain the quality and integrity of Tech Atlas, 
            ensuring all content meets community standards.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {moderators.map((moderator, index) => (
              <motion.div
                key={moderator.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 mx-auto mb-6 flex items-center justify-center border-2 border-green-500/30 shadow-lg">
                      <Shield className="h-10 w-10 text-green-400" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-green-400 transition-colors duration-300 font-['Space_Grotesk']">{moderator.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-3 py-1">
                        {moderator.role}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{moderator.shortBio}</p>
                    <div className="flex justify-center gap-2 mb-6">
                      {moderator.github && (
                        <Button variant="ghost" size="icon" className="hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <a href={moderator.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {moderator.linkedin && (
                        <Button variant="ghost" size="icon" className="hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <a href={moderator.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {moderator.twitter && (
                        <Button variant="ghost" size="icon" className="hover:bg-green-500/20 hover:text-green-400 transition-colors">
                          <a href={moderator.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedModerator(moderator)}
                      className="w-full bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50 transition-all duration-300"
                    >
                      View Full Bio
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center font-['Space_Grotesk']">
            The Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-card/50 to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="text-center pb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 mx-auto mb-6 flex items-center justify-center border-2 border-blue-500/30 shadow-lg">
                      <User className="h-12 w-12 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-blue-400 transition-colors duration-300 font-['Space_Grotesk']">{member.name}</CardTitle>
                    <CardDescription className="mt-2">
                      <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-3 py-1">
                        {member.role}
                      </Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center px-6 pb-6">
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-3 leading-relaxed">{member.shortBio}</p>
                    <div className="flex justify-center gap-2 mb-6">
                      {member.github && (
                        <Button variant="ghost" size="icon" className="hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                          <a href={member.github} target="_blank" rel="noopener noreferrer">
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.linkedin && (
                        <Button variant="ghost" size="icon" className="hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {member.twitter && (
                        <Button variant="ghost" size="icon" className="hover:bg-blue-500/20 hover:text-blue-400 transition-colors">
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                            <Twitter className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setSelectedMember(member)}
                      className="w-full bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300"
                    >
                      View Full Bio
                    </Button>
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

        {/* Team Member Modal */}
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border-border/50">
            <DialogHeader className="pb-6">
              <DialogTitle className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border-2 border-blue-500/30 shadow-xl">
                  <User className="h-10 w-10 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground font-['Space_Grotesk'] mb-2">{selectedMember?.name}</h3>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-2 text-sm">
                    {selectedMember?.role}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {selectedMember?.fullBio}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
                {selectedMember?.github && (
                  <Button variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50" asChild>
                    <a href={selectedMember.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {selectedMember?.linkedin && (
                  <Button variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50" asChild>
                    <a href={selectedMember.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {selectedMember?.twitter && (
                  <Button variant="outline" className="bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 hover:border-blue-500/50" asChild>
                    <a href={selectedMember.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {selectedMember?.youtube && (
                  <Button variant="outline" className="bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50" asChild>
                    <a href={selectedMember.youtube} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      YouTube
                    </a>
                  </Button>
                )}
                {selectedMember?.email && (
                  <Button variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50" asChild>
                    <a href={`mailto:${selectedMember.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Moderator Modal */}
        <Dialog open={!!selectedModerator} onOpenChange={() => setSelectedModerator(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl border-border/50">
            <DialogHeader className="pb-6">
              <DialogTitle className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center border-2 border-green-500/30 shadow-xl">
                  <Shield className="h-10 w-10 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground font-['Space_Grotesk'] mb-2">{selectedModerator?.name}</h3>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 px-4 py-2 text-sm">
                    {selectedModerator?.role}
                  </Badge>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {selectedModerator?.fullBio}
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-6 border-t border-border/50">
                {selectedModerator?.github && (
                  <Button variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50" asChild>
                    <a href={selectedModerator.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                )}
                {selectedModerator?.linkedin && (
                  <Button variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50" asChild>
                    <a href={selectedModerator.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {selectedModerator?.twitter && (
                  <Button variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:border-green-500/50" asChild>
                    <a href={selectedModerator.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
