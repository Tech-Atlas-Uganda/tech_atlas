import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Scale, Users, FileText, Shield } from "lucide-react";

export default function Governance() {
  return (
    <div className="min-h-screen p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Governance Model
          </h1>
          <p className="text-lg text-slate-400">
            How Tech Atlas is governed and decisions are made
          </p>
        </div>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-400" />
              Governance Philosophy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              Tech Atlas operates as a community-governed platform designed to serve Uganda's technology ecosystem transparently and equitably. The governance structure balances centralized oversight for quality assurance with distributed community participation to ensure the platform reflects the diverse needs and perspectives of all stakeholders.
            </p>
            <p>
              Decision-making authority is distributed across multiple tiers to prevent concentration of power while maintaining operational efficiency. This model ensures that strategic decisions receive broad input, while day-to-day operations can proceed without unnecessary delays.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Governance Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-slate-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white text-lg">Core Maintainers</h3>
              <p>
                Core maintainers hold administrative authority over the platform infrastructure, codebase, and strategic direction. This group consists of the founding team and senior technical contributors who have demonstrated long-term commitment to the project. Core maintainers approve major feature additions, architectural changes, and policy updates. They also appoint community moderators and resolve escalated disputes.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-lg">Community Moderators</h3>
              <p>
                Community moderators are trusted members appointed by core maintainers to review and approve content submissions. Moderators ensure that hubs, startups, jobs, events, and resources meet quality standards and adhere to community guidelines. They have authority to approve, reject, or request revisions to submissions. Moderators participate in policy discussions and provide feedback on platform improvements based on their frontline experience.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-lg">Contributors</h3>
              <p>
                Contributors include any community member who submits content, reports issues, suggests features, or contributes code. Contributors participate in discussions, provide feedback, and help shape the platform through their engagement. While contributors do not hold formal decision-making authority, their input is valued and considered in governance decisions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white text-lg">Users</h3>
              <p>
                All users of the platform benefit from the governance structure through transparent operations, clear policies, and responsive support. Users can escalate concerns through established channels and participate in community discussions to influence platform development.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-400" />
              Decision-Making Process
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Content Moderation</h3>
              <p>
                Content submissions are reviewed by community moderators within 48 hours. Moderators evaluate submissions against established criteria including accuracy, relevance, completeness, and adherence to community standards. Approved content is published immediately. Rejected submissions receive feedback explaining the decision and guidance for resubmission.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Feature Development</h3>
              <p>
                Feature requests and bug reports are tracked publicly on GitHub. Core maintainers prioritize issues based on community feedback, technical feasibility, and alignment with platform goals. Major features undergo community discussion before implementation. Contributors can propose features through GitHub issues or community discussions.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Policy Changes</h3>
              <p>
                Changes to governance policies, community guidelines, or terms of service are proposed by core maintainers and announced to the community for feedback. A comment period of at least two weeks allows community members to provide input. Core maintainers consider all feedback before finalizing policy changes, which are then published with effective dates.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-white">Dispute Resolution</h3>
              <p>
                Disputes regarding content moderation decisions, policy interpretation, or community conduct are escalated to core maintainers. Disputes are reviewed within one week. Core maintainers may request additional information from involved parties before making a final decision. All parties are notified of the outcome with clear reasoning.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-400" />
              Transparency and Accountability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-slate-300">
            <p>
              All governance activities are conducted transparently. Policy documents, moderation guidelines, and decision-making processes are publicly accessible. Core maintainers publish regular updates on platform development, community growth, and governance activities.
            </p>
            <p>
              Community members can request clarification on any governance decision or policy. Core maintainers are accountable to the community and commit to responding to inquiries within a reasonable timeframe. Feedback mechanisms ensure that governance evolves to meet community needs.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
