import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, Search, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export function AIResourceAgent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundResource, setFoundResource] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const utils = trpc.useUtils();
  const createResource = trpc.learning.create.useMutation({
    onSuccess: () => {
      toast.success("Resource added successfully!");
      utils.learning.list.invalidate();
      setFoundResource(null);
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
    setFoundResource(null);

    try {
      const response = await fetch('/api/ai-resource-agent/search-and-fill', {
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
        toast.warning('Resource already exists');
        setFoundResource(data.resource);
        setShowDialog(true);
      } else {
        setFoundResource(data.resource);
        setShowDialog(true);
        toast.success('Found a resource!');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  const submitResource = async () => {
    if (!foundResource) return;

    setSubmitting(true);
    try {
      await createResource.mutateAsync({
        title: foundResource.title,
        description: foundResource.description,
        type: foundResource.type,
        category: foundResource.category,
        level: foundResource.level,
        provider: foundResource.provider,
        url: foundResource.url,
        cost: foundResource.cost,
        duration: foundResource.duration,
        tags: foundResource.tags,
      });
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Resource Agent
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Let AI search the internet and auto-fill learning resources for Ugandan tech learners
          </p>

          <div className="flex gap-2">
            <Input
              placeholder="e.g., free coding courses for Ugandans"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && searchAndFill()}
              className="flex-1"
            />
            <Button 
              onClick={searchAndFill}
              disabled={searching}
              className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
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
              <li>Free web development bootcamps</li>
              <li>Python courses for beginners</li>
              <li>Tech opportunities in Uganda</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Found a Resource
            </DialogTitle>
            <DialogDescription>
              Review and submit this learning resource
            </DialogDescription>
          </DialogHeader>

          {foundResource && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{foundResource.title}</h3>
                <p className="text-sm text-muted-foreground">{foundResource.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <Badge variant="outline">{foundResource.type}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Level</p>
                  <Badge variant="outline">{foundResource.level}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Cost</p>
                  <Badge variant="outline" className={
                    foundResource.cost === 'free' ? 'border-green-500 text-green-600' : ''
                  }>
                    {foundResource.cost}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Duration</p>
                  <Badge variant="outline">{foundResource.duration}</Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <Badge className="bg-purple-500">{foundResource.category}</Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Provider</p>
                <p className="text-sm">{foundResource.provider}</p>
              </div>

              {foundResource.url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">URL</p>
                  <a 
                    href={foundResource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {foundResource.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {foundResource.tags && foundResource.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {foundResource.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {foundResource.relevance && (
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Why relevant for Ugandans:</p>
                  <p className="text-sm">{foundResource.relevance}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={submitResource}
                  disabled={submitting}
                  className="flex-1 gap-2 bg-gradient-to-r from-purple-500 to-pink-500"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Submit Resource
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
