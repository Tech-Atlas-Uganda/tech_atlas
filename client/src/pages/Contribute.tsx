import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Github, Code, FileText, Users, AlertCircle } from "lucide-react";

export default function Contribute() {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Contribute to Tech Atlas
          </h1>
          <p className="text-lg text-slate-400">
            Help build Uganda's definitive tech ecosystem platform
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="h-5 w-5 text-blue-400" />
              Contributing via GitHub
            </CardTitle>
            <CardDescription>
              Tech Atlas is open source. Contribute code, report bugs, or suggest features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Getting Started</h3>
              <p className="text-slate-400">
                Fork the repository on GitHub and clone it locally. Install dependencies with <code className="bg-slate-800 px-2 py-1 rounded">pnpm install</code> and start the development server with <code className="bg-slate-800 px-2 py-1 rounded">pnpm dev</code>. The platform uses React, TypeScript, tRPC, and Tailwind CSS.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Development Workflow</h3>
              <p className="text-slate-400">
                Create a new branch for your feature or bug fix. Make your changes and ensure all tests pass with <code className="bg-slate-800 px-2 py-1 rounded">pnpm test</code>. Write clear commit messages following conventional commits format. Push your branch and open a pull request with a detailed description of your changes.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Code Standards</h3>
              <p className="text-slate-400">
                Follow the existing code style and structure. Use TypeScript for type safety. Write unit tests for new features. Ensure your code passes linting with <code className="bg-slate-800 px-2 py-1 rounded">pnpm format</code>. Document complex logic with comments.
              </p>
            </div>

            <Button className="w-full" variant="outline">
              <Github className="h-4 w-4 mr-2" />
              View on GitHub
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-400" />
              Contributing Content
            </CardTitle>
            <CardDescription>
              Add hubs, startups, jobs, events, and resources to the platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Submission Guidelines</h3>
              <p className="text-slate-400">
                All content submissions go through a moderation process to ensure quality and accuracy. Provide complete and accurate information including names, descriptions, locations, and contact details. Use clear, professional language. Include relevant links to websites and social media profiles.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Content Standards</h3>
              <p className="text-slate-400">
                Submissions must be relevant to Uganda's tech ecosystem. Avoid promotional or marketing language. Focus on factual information. Ensure all links are working and lead to legitimate resources. Respect intellectual property and do not plagiarize content.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">What to Submit</h3>
              <p className="text-slate-400">
                Tech hubs and co-working spaces across Uganda. Developer communities and meetup groups. Startups building technology products. Job opportunities in tech companies. Learning resources including courses, tutorials, and bootcamps. Tech events, hackathons, and conferences. Funding opportunities, grants, and fellowships.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-400" />
              Community Participation
            </CardTitle>
            <CardDescription>
              Engage with the community through discussions and feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Join the Conversation</h3>
              <p className="text-slate-400">
                Participate in community discussions on the forum. Share your experiences and insights. Help answer questions from other community members. Provide constructive feedback on platform features. Report issues or suggest improvements.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Community Guidelines</h3>
              <p className="text-slate-400">
                Be respectful and professional in all interactions. Stay on topic and keep discussions relevant. No spam, self-promotion, or advertising. Respect privacy and do not share personal information. Follow the Code of Conduct at all times.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-900/20 border-amber-800/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertCircle className="h-5 w-5" />
              Important Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300">
              Tech Atlas is a community-driven platform. While we moderate submissions, users should conduct their own due diligence before engaging with any listed organizations, applying for jobs, or following external links. We are not responsible for the accuracy of third-party information or the outcomes of any interactions facilitated through this platform. Always verify credentials, research companies thoroughly, and exercise caution when sharing personal information.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
