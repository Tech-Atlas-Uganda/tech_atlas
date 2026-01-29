import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function CodeOfConduct() {
  return (
    <div className="min-h-screen p-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Code of Conduct</h1>
          <p className="text-lg text-slate-400">Our commitment to a respectful and inclusive community</p>
        </div>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-blue-400" />Our Pledge</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Tech Atlas is committed to providing a welcoming, safe, and inclusive environment for all community members regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, education, socioeconomic status, nationality, personal appearance, race, religion, or sexual identity and orientation.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Expected Behavior</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Community members are expected to demonstrate empathy and kindness toward others. Use welcoming and inclusive language. Respect differing viewpoints and experiences. Accept constructive criticism gracefully. Focus on what is best for the community. Show courtesy and respect in all interactions.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Unacceptable Behavior</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Unacceptable behaviors include harassment, discrimination, intimidation, or any form of unwelcome conduct. Trolling, insulting or derogatory comments, personal or political attacks, and public or private harassment are prohibited. Publishing others' private information without permission is not allowed. Any conduct that could reasonably be considered inappropriate in a professional setting is unacceptable.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Enforcement</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>Community moderators and administrators are responsible for enforcing this Code of Conduct. They have the right and responsibility to remove, edit, or reject comments, commits, code, issues, and other contributions that do not align with this Code. Violations may result in temporary or permanent bans from the platform. All complaints will be reviewed and investigated promptly and fairly.</p>
          </CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader><CardTitle>Reporting</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>If you experience or witness unacceptable behavior, please report it to the platform administrators. All reports will be handled with discretion and confidentiality. We are committed to creating a safe environment and will take appropriate action to address violations.</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
