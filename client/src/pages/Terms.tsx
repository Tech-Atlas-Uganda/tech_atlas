import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Terms of Service</h1>
          <p className="text-lg text-slate-400">Rules and guidelines for using Tech Atlas</p>
        </div>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-400" />Acceptance of Terms</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>By accessing or using Tech Atlas, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the platform.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>User Responsibilities</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Users are responsible for maintaining the confidentiality of their account credentials. You agree to provide accurate, current, and complete information when creating content or profiles. Users must not impersonate others, submit false information, or engage in fraudulent activities.</p>
            <p>All content submitted must comply with applicable laws and platform guidelines. Users retain ownership of their submitted content but grant Tech Atlas a license to display and distribute it on the platform.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Platform Usage</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Tech Atlas is provided for informational purposes. While we strive for accuracy, we do not guarantee the completeness or reliability of any content. Users should conduct their own due diligence before acting on any information found on the platform.</p>
            <p>Prohibited activities include spamming, harassment, unauthorized data collection, attempts to compromise platform security, and any use that violates laws or infringes on others' rights.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Limitation of Liability</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Tech Atlas is provided "as is" without warranties of any kind. We are not liable for any damages arising from platform use, including but not limited to direct, indirect, incidental, or consequential damages. We do not endorse any listed organizations, jobs, or opportunities.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Modifications and Termination</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance of the new terms. We may suspend or terminate accounts that violate these terms.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
