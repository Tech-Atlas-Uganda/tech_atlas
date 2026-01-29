import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Privacy Policy</h1>
          <p className="text-lg text-slate-400">How we collect, use, and protect your information</p>
        </div>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-blue-400" />Information Collection</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Tech Atlas collects minimal personal information necessary to operate the platform. When you create an account, we collect your name, email address, and authentication credentials. Profile information including bio, skills, location, and social media links is optional and publicly visible if provided.</p>
            <p>We automatically collect technical information including IP addresses, browser type, and usage patterns to improve platform performance and security. This data is not linked to individual users and is used only for aggregate analytics.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Data Usage and Sharing</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Your personal information is used solely to provide platform services. We do not sell, rent, or share your data with third parties for marketing purposes. Public profile information is visible to all platform users. Content submissions including hubs, jobs, and events are publicly accessible.</p>
            <p>We may share information when required by law or to protect platform security and user safety. In the event of a platform transfer or acquisition, user data would be transferred with appropriate notice.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Data Security and Retention</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>We implement industry-standard security measures to protect your data including encryption, secure authentication, and regular security audits. User data is retained as long as your account is active. You may request account deletion at any time, after which your personal information will be removed within 30 days.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Your Rights</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>You have the right to access, correct, or delete your personal information. You can update your profile at any time through account settings. To exercise these rights or for privacy-related questions, contact the platform administrators.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
