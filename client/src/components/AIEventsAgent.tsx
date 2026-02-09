import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Loader2, Search, ExternalLink, CheckCircle, XCircle, Calendar, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { supabase } from "@/lib/supabase";

export function AIEventsAgent() {
  const [mode, setMode] = useState<"auto" | "guided">("guided");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemType, setItemType] = useState<"event" | "opportunity">("event");
  const [searching, setSearching] = useState(false);
  const [foundItem, setFoundItem] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const utils = trpc.useUtils();
  const createEvent = trpc.events.create.useMutation({
    onSuccess: () => {
      toast.success("Event added successfully!");
      utils.events.list.invalidate();
      setFoundItem(null);
      setShowDialog(false);
      setSearchQuery("");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  const createOpportunity = trpc.opportunities.create.useMutation({
    onSuccess: () => {
      toast.success("Opportunity added successfully!");
      utils.opportunities.list.invalidate();
      setFoundItem(null);
      setShowDialog(false);
      setSearchQuery("");
    },
    onError: (error) => {
      toast.error(`Failed: ${error.message}`);
    },
  });

  // Generate and upload default image (same logic as SubmitEvent form)
  const generateAndUploadDefaultImage = async (type: "event" | "opportunity"): Promise<string> => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    if (type === 'event') {
      gradient.addColorStop(0, '#FCD34D'); // Yellow
      gradient.addColorStop(1, '#F59E0B'); // Amber
    } else {
      gradient.addColorStop(0, '#34D399'); // Green
      gradient.addColorStop(1, '#059669'); // Emerald
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 300);

    // Add pattern/texture
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 400, Math.random() * 300, Math.random() * 30, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add Tech Atlas text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('TECH ATLAS', 200, 120);
    
    ctx.font = '18px Arial, sans-serif';
    ctx.fillText(type.toUpperCase(), 200, 150);
    
    // Add icon
    ctx.font = '48px Arial, sans-serif';
    ctx.fillText(type === 'event' ? '📅' : '🏆', 200, 200);

    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate image'));
          return;
        }

        try {
          // Upload to Supabase Storage
          const fileName = `default-${type}-${Date.now()}.png`;
          const bucketName = type === 'event' ? 'event-images' : 'opportunity-images';
          const filePath = `defaults/${fileName}`;

          console.log(`📤 Uploading default ${type} image to ${bucketName}/${filePath}`);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, blob, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error('❌ Failed to upload default image:', uploadError);
            // Try to use existing default image as fallback
            const fallbackUrl = type === 'event' 
              ? 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png'
              : 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770670986986.png';
            resolve(fallbackUrl);
            return;
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(filePath);

          console.log('✅ Default image uploaded:', publicUrl);
          resolve(publicUrl);
        } catch (error) {
          console.error('❌ Error uploading default image:', error);
          // Use fallback URL
          const fallbackUrl = type === 'event' 
            ? 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png'
            : 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/opportunity-images/defaults/default-opportunity-1770670986986.png';
          resolve(fallbackUrl);
        }
      }, 'image/png');
    });
  };

  const searchAndFill = async () => {
    if (!searchQuery.trim()) {
      toast.error('Enter a search query');
      return;
    }

    setSearching(true);
    setFoundItem(null);

    try {
      const response = await fetch('/api/ai-events-agent/search-and-fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery, type: itemType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Search failed');
        throw new Error(data.message);
      }

      if (data.duplicate) {
        toast.warning(`${itemType === 'event' ? 'Event' : 'Opportunity'} already exists`);
        setFoundItem(data.item);
        setShowDialog(true);
      } else {
        setFoundItem(data.item);
        setShowDialog(true);
        toast.success(`Found a ${itemType}!`);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSearching(false);
    }
  };

  const submitItem = async () => {
    if (!foundItem) return;

    setSubmitting(true);
    try {
      // Use local default images from public folder
      const defaultEventImage = 'https://opjxkfzofuqzijkvinzd.supabase.co/storage/v1/object/public/event-images/defaults/default-event-1770670986986.png';
      const defaultOpportunityImage = '/tech_atlas_opportunity.png'; // Local image from public folder
      
      const imageUrl = itemType === 'event' ? defaultEventImage : defaultOpportunityImage;
      console.log(`✅ Using ${itemType} image: ${imageUrl}`);
      
      if (itemType === 'event') {
        await createEvent.mutateAsync({
          title: foundItem.title,
          description: foundItem.description,
          type: foundItem.type,
          category: foundItem.category,
          startDate: foundItem.startDate ? new Date(foundItem.startDate) : new Date(),
          endDate: foundItem.endDate ? new Date(foundItem.endDate) : undefined,
          location: foundItem.location,
          virtual: foundItem.virtual || false,
          meetingUrl: foundItem.virtual ? foundItem.url : undefined,
          registrationUrl: !foundItem.virtual ? foundItem.url : undefined,
          organizer: foundItem.organizer,
          capacity: foundItem.capacity ? Number(foundItem.capacity) : undefined,
          tags: foundItem.tags,
          imageUrl: imageUrl,
        });
      } else {
        await createOpportunity.mutateAsync({
          title: foundItem.title,
          description: foundItem.description,
          type: foundItem.type,
          category: foundItem.category,
          provider: foundItem.provider,
          amount: foundItem.amount,
          currency: foundItem.currency,
          applicationUrl: foundItem.url,
          deadline: foundItem.deadline ? new Date(foundItem.deadline) : undefined,
          tags: foundItem.tags,
          imageUrl: imageUrl,
        });
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-purple-200 dark:border-purple-800">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="font-semibold text-lg">AI Events & Opportunities Agent</h3>
          </div>

          <p className="text-sm text-muted-foreground">
            Let AI search the internet and auto-fill events and opportunities for the Ugandan tech community
          </p>

          <Tabs value={itemType} onValueChange={(v) => setItemType(v as "event" | "opportunity")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="event" className="gap-2">
                <Calendar className="h-4 w-4" />
                Events
              </TabsTrigger>
              <TabsTrigger value="opportunity" className="gap-2">
                <Award className="h-4 w-4" />
                Opportunities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="event" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., tech meetups in Kampala, AI hackathons"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAndFill()}
                  className="flex-1"
                />
                <Button 
                  onClick={searchAndFill}
                  disabled={searching}
                  className="gap-2 bg-gradient-to-r from-blue-500 to-purple-500"
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
                  <li>Tech meetups in Kampala</li>
                  <li>Upcoming AI hackathons in Africa</li>
                  <li>Web development workshops</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="opportunity" className="space-y-4 mt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., tech grants for Africans, coding scholarships"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchAndFill()}
                  className="flex-1"
                />
                <Button 
                  onClick={searchAndFill}
                  disabled={searching}
                  className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500"
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
                  <li>Tech grants for African startups</li>
                  <li>Coding scholarships for students</li>
                  <li>Developer fellowships</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              AI Found {itemType === 'event' ? 'an Event' : 'an Opportunity'}
            </DialogTitle>
            <DialogDescription>
              Review and submit this {itemType}
            </DialogDescription>
          </DialogHeader>

          {foundItem && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div>
                <h3 className="font-semibold text-lg mb-2">{foundItem.title}</h3>
                <p className="text-sm text-muted-foreground">{foundItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {foundItem.type && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                    <Badge variant="outline">{foundItem.type}</Badge>
                  </div>
                )}
                {foundItem.category && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <Badge className="bg-purple-500">{foundItem.category}</Badge>
                  </div>
                )}
              </div>

              {itemType === 'event' && (
                <>
                  {foundItem.startDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Start Date</p>
                      <p className="text-sm">{new Date(foundItem.startDate).toLocaleString()}</p>
                    </div>
                  )}
                  {foundItem.endDate && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">End Date</p>
                      <p className="text-sm">{new Date(foundItem.endDate).toLocaleString()}</p>
                    </div>
                  )}
                  {foundItem.location && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm">{foundItem.location}</p>
                    </div>
                  )}
                  {foundItem.virtual !== undefined && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Format</p>
                      <Badge variant={foundItem.virtual ? "default" : "secondary"}>
                        {foundItem.virtual ? "Virtual" : "In-Person"}
                      </Badge>
                    </div>
                  )}
                  {foundItem.organizer && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Organizer</p>
                      <p className="text-sm">{foundItem.organizer}</p>
                    </div>
                  )}
                  {foundItem.capacity && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Capacity</p>
                      <p className="text-sm">{foundItem.capacity} attendees</p>
                    </div>
                  )}
                </>
              )}

              {itemType === 'opportunity' && (
                <>
                  {foundItem.provider && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Provider</p>
                      <p className="text-sm">{foundItem.provider}</p>
                    </div>
                  )}
                  {foundItem.amount && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount</p>
                      <p className="text-sm">{foundItem.currency} {foundItem.amount}</p>
                    </div>
                  )}
                  {foundItem.deadline && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                      <p className="text-sm">{new Date(foundItem.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                </>
              )}

              {foundItem.url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">URL</p>
                  <a 
                    href={foundItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {foundItem.url}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}

              {foundItem.tags && foundItem.tags.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {foundItem.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {foundItem.relevance && (
                <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">Why relevant for Ugandan tech community:</p>
                  <p className="text-sm">{foundItem.relevance}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={submitItem}
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
                      Submit {itemType === 'event' ? 'Event' : 'Opportunity'}
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
