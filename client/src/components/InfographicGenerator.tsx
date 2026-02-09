import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, 
  Download,
  Share2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function InfographicGenerator() {
  const [open, setOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedSvg, setGeneratedSvg] = useState<string | null>(null);

  const generateInfographic = async () => {
    setGenerating(true);
    setGeneratedSvg(null);

    try {
      const response = await fetch('/api/infographics/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: 'complete' }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        const errorMsg = data.message || 'Failed to generate';
        toast.error(errorMsg);
        throw new Error(errorMsg);
      }

      setGeneratedSvg(data.svg);
      toast.success('Generated!');
    } catch (error) {
      console.error('Error:', error);
      setGeneratedSvg(null);
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setGeneratedSvg(null);
  };

  const downloadSvg = () => {
    if (!generatedSvg) return;
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-atlas-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const downloadPng = async () => {
    if (!generatedSvg) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([generatedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `tech-atlas-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
            toast.success('Downloaded!');
          }
        });
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (error) {
      toast.error('Failed to convert');
    }
  };

  const share = async () => {
    if (!generatedSvg) return;
    try {
      const svgBlob = new Blob([generatedSvg], { type: 'image/svg+xml' });
      const file = new File([svgBlob], 'tech-atlas.svg', { type: 'image/svg+xml' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Tech Atlas Uganda',
          files: [file],
        });
        toast.success('Shared!');
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        toast.success('Link copied!');
      }
    } catch (error) {
      toast.error('Failed to share');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) setTimeout(reset, 300);
    }}>
      <DialogTrigger asChild>
        <Button 
          size="lg"
          className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
        >
          <Sparkles className="h-5 w-5" />
          Generate Infographic
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-purple-500" />
            AI Infographic Generator
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          {!generatedSvg && !generating ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Create Your Infographic</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Generate a stunning visual with all your ecosystem stats, GitHub metrics, and community data
              </p>
              <Button size="lg" onClick={generateInfographic} className="gap-2">
                <Sparkles className="h-5 w-5" />
                Generate Now
              </Button>
            </motion.div>
          ) : generating ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <Loader2 className="h-16 w-16 animate-spin mx-auto text-purple-500 mb-6" />
              <h3 className="text-xl font-bold mb-2">Generating...</h3>
              <p className="text-sm text-muted-foreground">Takes 5-15 seconds</p>
            </motion.div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Ready! 🎉</h3>
                  <Button variant="outline" size="sm" onClick={reset}>
                    Generate New
                  </Button>
                </div>

                <Card className="bg-muted/30">
                  <CardContent className="p-8">
                    <div 
                      className="w-full bg-white rounded-lg shadow-xl overflow-hidden mx-auto"
                      style={{ 
                        width: '100%',
                        maxWidth: '600px',
                        aspectRatio: '1/1'
                      }}
                    >
                      <svg 
                        viewBox="0 0 1080 1080" 
                        className="w-full h-full"
                        dangerouslySetInnerHTML={{ __html: generatedSvg?.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '') || '' }}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 justify-center pt-2">
                  <Button onClick={downloadSvg} size="lg" className="gap-2">
                    <Download className="h-4 w-4" />
                    SVG
                  </Button>
                  <Button onClick={downloadPng} size="lg" variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    PNG
                  </Button>
                  <Button onClick={share} size="lg" variant="outline" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
