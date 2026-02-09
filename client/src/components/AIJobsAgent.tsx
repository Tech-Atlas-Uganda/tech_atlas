import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Search, ExternalLink, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export function AIJobsAgent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundJob, setFoundJob] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const utils = trpc.useUtils();
  const createJob = trpc.jobs.create.useMutation({
    onSuccess: () => {
      toast.success("Job added successfully!");
      utils.jobs.list.invalidate();
      setFoundJob(null);
      setShowDialog(false);
      setSearchQuery("");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const searchAndFill = async () => {
    if (!searchQuery.trim()) {
      toast.error('Enter a search query');
      return;
    }

    setSearching(true);
    setFoundJob(null);

    try {
      const response = await fetch('/api/ai-jobs-agent/search-and-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Search failed');
        throw new Error(data.message);
      }

      if (data.duplicate) {
        toast.warning('Job already exists');
        setFoundJob(data.job);
        setShowDialog(true);
      } else {
        setFoundJob(data.job);
        setShowDialog(true);
        toast.success('Found a job!');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  const submitJob = async () => {
    if (!foundJob) return;

    setSubmitting(true);
    try {
      await createJob.mutateAsync({
        title: foundJob.title,
        company: foundJob.company,
        description: foundJob.description,
        requirements: foundJob.requirements || undefined,
        responsibilities: foundJob.responsibilities || undefined,
        type: foundJob.type as "full-time" | "part-time" | "internship" | "contract",
        location: foundJob.location || undefined,
        remote: foundJob.remote || false,
        experienceLevel: foundJob.experienceLevel || undefined,
        salaryMin: foundJob.salaryMin ? Number(foundJob.salaryMin) : undefined,
        salaryMax: foundJob.salaryMax ? Number(foundJob.salaryMax) : undefined,
        currency: foundJob.currency || undefined,
        applicationUrl: foundJob.applicationUrl || undefined,
        applicationEmail: foundJob.applicationEmail || undefined,
        expiresAt: foundJob.expiresAt ? new Date(foundJob.expiresAt) : undefined,
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-lg">AI Jobs Agent</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Let AI search the internet and auto-fill tech job opportunities for Ugandan professionals
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., software engineer jobs in Uganda, remote developer positions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchAndFill()}
              className="flex-1"
            />
            <Button 
              onClick={searchAndFill}
              disabled={searching}
              className="gap-2 bg-gradient-to-r from-blue-500 to-indigo-500"
            >
              {searching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Find
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>Try queries like:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Software engineer jobs in Kampala</li>
              <li>Remote developer positions for Africans</li>
              <li>Data science jobs in Uganda</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              AI Found a Job
            </DialogTitle>
            <DialogDescription>
              Review and submit this job opportunity
            </DialogDescription>
          </DialogHeader>

          {foundJob && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-xl mb-1">{foundJob.title}</h3>
                <p className="text-lg text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {foundJob.company}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {foundJob.type && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <Badge variant="outline">{foundJob.type}</Badge>
                  </div>
                )}
                {foundJob.experienceLevel && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Experience</p>
                    <Badge variant="outline">{foundJob.experienceLevel}</Badge>
                  </div>
                )}
                {foundJob.location && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <Badge variant="outline">{foundJob.location}</Badge>
                  </div>
                )}
                {foundJob.remote !== undefined && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Work Mode</p>
                    <Badge variant={foundJob.remote ? "default" : "secondary"}>
                      {foundJob.remote ? "Remote" : "On-site"}
                    </Badge>
                  </div>
                )}
              </div>

              {(foundJob.salaryMin || foundJob.salaryMax) && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Salary Range</p>
                  <p className="text-sm font-medium">
                    {foundJob.currency} {foundJob.salaryMin?.toLocaleString()} 
                    {foundJob.salaryMax && ` - ${foundJob.salaryMax.toLocaleString()}`}
                  </p>
                </div>
              )}

              {foundJob.description && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{foundJob.description}</p>
                </div>
              )}

              {foundJob.requirements && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Requirements</p>
                  <p className="text-sm whitespace-pre-wrap">{foundJob.requirements}</p>
                </div>
              )}

              {foundJob.responsibilities && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Responsibilities</p>
                  <p className="text-sm whitespace-pre-wrap">{foundJob.responsibilities}</p>
                </div>
              )}

              {foundJob.applicationUrl && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Application URL</p>
                  <a 
                    href={foundJob.applicationUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {foundJob.applicationUrl}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {foundJob.applicationEmail && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Application Email</p>
                  <p className="text-sm">{foundJob.applicationEmail}</p>
                </div>
              )}

              {foundJob.expiresAt && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Application Deadline</p>
                  <p className="text-sm">{new Date(foundJob.expiresAt).toLocaleDateString()}</p>
                </div>
              )}

              {foundJob.relevance && (
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Why relevant for Ugandan professionals:</p>
                  <p className="text-sm">{foundJob.relevance}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={submitJob}
                  disabled={submitting}
                  className="flex-1 gap-2 bg-gradient-to-r from-blue-500 to-indigo-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submit Job
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
