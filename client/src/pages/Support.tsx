import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Heart, Coffee, Zap, Users } from "lucide-react";

export default function Support() {
  return (
    <div className="min-h-screen p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Support Tech Atlas</h1>
          <p className="text-lg text-slate-400">Help us build and maintain Uganda's tech ecosystem platform</p>
        </div>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-pink-400" />Why Support Us</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Tech Atlas operates as public infrastructure for Uganda's technology ecosystem. The platform is free to use, open source, and community-governed. Maintaining and improving this service requires resources for hosting, development, moderation, and community management.</p>
            <p>Your support helps keep Tech Atlas independent, sustainable, and focused on serving the ecosystem rather than commercial interests. Contributions fund platform improvements, ensure reliable hosting, and enable us to expand coverage and features.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><Coffee className="h-5 w-5 text-amber-400" />Ways to Support</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Financial Contributions</h3>
              <p className="text-slate-300">One-time or recurring donations help cover operational costs. Every contribution, regardless of size, makes a difference in sustaining the platform.</p>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Heart className="h-4 w-4 mr-2" />
                Make a Donation
              </Button>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Contribute Content</h3>
              <p className="text-slate-300">Help build the ecosystem map by submitting hubs, startups, jobs, events, and resources. Quality content makes the platform more valuable for everyone.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Contribute Code</h3>
              <p className="text-slate-300">Tech Atlas is open source. Developers can contribute features, fix bugs, or improve documentation on GitHub.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Spread the Word</h3>
              <p className="text-slate-300">Share Tech Atlas with your network. The more people who know about and use the platform, the more valuable it becomes for the entire ecosystem.</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5 text-yellow-400" />Sponsorship Opportunities</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Organizations can sponsor Tech Atlas to support ecosystem development while gaining visibility. Sponsorships are clearly labeled and do not influence platform governance or content moderation. Sponsors support the mission of making Uganda's tech ecosystem more accessible and connected.</p>
            <p>Contact us to discuss sponsorship opportunities that align with your organization's goals and our community values.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-green-400" />Transparency</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>All financial contributions are used exclusively for platform operations and development. We publish regular updates on how funds are allocated and platform progress. Tech Atlas remains independent and community-governed regardless of funding sources.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
