import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Globe } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            About Tech Atlas
          </h1>
          <p className="text-lg text-slate-400">
            Mapping and connecting Uganda's technology ecosystem
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-400" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Tech Atlas exists to create a comprehensive, accessible, and community-driven map of Uganda's technology ecosystem. The platform serves as digital infrastructure connecting tech hubs, communities, startups, talent, opportunities, and resources across the country.
            </p>
            <p>
              Uganda's tech sector has grown rapidly, but information remains fragmented across social media, personal networks, and isolated platforms. This fragmentation creates barriers for newcomers, limits collaboration, and makes it difficult to understand the ecosystem's true scope and potential. Tech Atlas addresses this challenge by centralizing ecosystem data in an open, transparent, and community-governed platform.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-purple-400" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Tech Atlas envisions a future where Uganda's technology ecosystem is fully visible, connected, and accessible to anyone seeking to participate. The platform aims to become the definitive reference for understanding and engaging with Uganda's tech sector, serving students, professionals, entrepreneurs, investors, policymakers, and international partners.
            </p>
            <p>
              By providing transparent, up-to-date information about the ecosystem, Tech Atlas enables better decision-making, facilitates connections, and accelerates collaboration. The platform supports ecosystem growth by making opportunities discoverable, talent visible, and resources accessible.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Community-Driven Approach
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Tech Atlas is built by the ecosystem, for the ecosystem. The platform operates as open-source software with transparent governance, ensuring that no single entity controls the information or direction. Community members contribute content, moderate submissions, and shape platform development through open discussions and feedback.
            </p>
            <p>
              This community-driven model ensures that Tech Atlas reflects the diverse perspectives and needs of all ecosystem stakeholders. It also creates shared ownership and responsibility for maintaining accurate, comprehensive information about Uganda's tech sector.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-amber-400" />
              Core Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Transparency</h3>
              <p>All platform operations, governance decisions, and data are open and accessible. Users can understand how the platform works and how decisions are made.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Inclusivity</h3>
              <p>Tech Atlas welcomes participation from all ecosystem members regardless of experience level, location, or background. The platform serves the entire ecosystem, not just established players.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Accuracy</h3>
              <p>Information quality is paramount. Moderation processes ensure that content is accurate, complete, and regularly updated to reflect ecosystem changes.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Sustainability</h3>
              <p>Tech Atlas operates as public infrastructure with sustainable funding models that do not compromise its independence or mission. The platform prioritizes long-term ecosystem value over short-term gains.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
