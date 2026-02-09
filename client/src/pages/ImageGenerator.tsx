import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Palette, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Template {
  name: string;
  color1: string;
  color2: string;
  label: string;
}

const templates: Template[] = [
  { name: 'blue', color1: '#3b82f6', color2: '#1e40af', label: 'Blue Ocean' },
  { name: 'purple', color1: '#8b5cf6', color2: '#6d28d9', label: 'Purple Dream' },
  { name: 'green', color1: '#10b981', color2: '#059669', label: 'Green Forest' },
  { name: 'orange', color1: '#f59e0b', color2: '#d97706', label: 'Orange Sunset' },
  { name: 'pink', color1: '#ec4899', color2: '#be185d', label: 'Pink Blossom' },
  { name: 'teal', color1: '#14b8a6', color2: '#0f766e', label: 'Teal Wave' },
];

export default function ImageGenerator() {
  const [title, setTitle] = useState("Welcome to Tech Atlas Blog");
  const [color1, setColor1] = useState("#3b82f6");
  const [color2, setColor2] = useState("#1e40af");
  const [style, setStyle] = useState<'gradient' | 'solid' | 'minimal'>('gradient');
  const [generating, setGenerating] = useState(false);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [showAiDialog, setShowAiDialog] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add pattern if selected
    if (style === 'gradient') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      for (let i = 0; i < 20; i++) {
        ctx.fillRect(i * 60, 0, 30, canvas.height);
      }
    }

    // Add decorative circles for minimal style
    if (style === 'minimal') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(100, 100, 150, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(canvas.width - 100, canvas.height - 100, 200, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw "TECH ATLAS" text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TECH ATLAS', canvas.width / 2, canvas.height / 2 - 60);

    // Draw "BLOG" text
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.fillText('BLOG', canvas.width / 2, canvas.height / 2 + 20);

    // Draw blog title (truncated if too long)
    const truncatedTitle = title.length > 50 ? title.substring(0, 47) + '...' : title;
    ctx.font = '32px Arial, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(truncatedTitle, canvas.width / 2, canvas.height / 2 + 100);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    const filename = 'tech-atlas-blog-' + title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
    
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const applyTemplate = (template: Template) => {
    setColor1(template.color1);
    setColor2(template.color2);
  };

  const generateWithAI = async () => {
    if (!title.trim()) {
      toast.error('Please enter a blog title first');
      return;
    }

    setGenerating(true);
    setAiImage(null);

    try {
      const response = await fetch('/api/blog-image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast.error(data.message || 'Failed to generate');
        throw new Error(data.message);
      }

      setAiImage(data.svg);
      setShowAiDialog(true);
      toast.success('Generated!');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setGenerating(false);
    }
  };

  const downloadAiImage = () => {
    if (!aiImage) return;
    const blob = new Blob([aiImage], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-atlas-blog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  const downloadAiImagePng = async () => {
    if (!aiImage) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 630;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([aiImage], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const pngUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `tech-atlas-blog-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;
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

  // Generate initial image on mount and when values change
  useEffect(() => {
    generateImage();
  }, [title, color1, color2, style]);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Palette className="h-8 w-8 text-blue-500" />
            Default Blog Image Generator
          </h1>
          <p className="text-muted-foreground">
            Create beautiful default images for your Tech Atlas blog posts
          </p>
        </motion.div>

        {/* Info Box */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>1. Choose a template or customize colors</p>
            <p>2. Enter your blog post title</p>
            <p>3. Click "Generate Image" (auto-generates as you type)</p>
            <p>4. Download and use in your blog submission</p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Templates</CardTitle>
                <CardDescription>Choose a color scheme</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => applyTemplate(template)}
                    className="w-full p-3 border-2 border-muted rounded-lg hover:border-primary transition-all hover:scale-105"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-md"
                        style={{
                          background: `linear-gradient(135deg, ${template.color1} 0%, ${template.color2} 100%)`
                        }}
                      />
                      <span className="font-medium">{template.label}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Custom Colors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Custom Colors</CardTitle>
                <CardDescription>Create your own gradient</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="color1">Gradient Start</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="color1"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color1}
                      onChange={(e) => setColor1(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color2">Gradient End</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      id="color2"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={color2}
                      onChange={(e) => setColor2(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Style Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Image Style</CardTitle>
              </CardHeader>
              <CardContent>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value as 'gradient' | 'solid' | 'minimal')}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="gradient">Gradient with Pattern</option>
                  <option value="solid">Solid Gradient</option>
                  <option value="minimal">Minimal</option>
                </select>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Blog Post Title</CardTitle>
                <CardDescription>This will appear on your image</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog post title..."
                  className="text-lg"
                />
                
                <Button
                  onClick={generateWithAI}
                  disabled={generating}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                >
                  {generating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Generating with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Generate with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview (1200x630px)</CardTitle>
                <CardDescription>Perfect size for social media sharing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width="1200"
                  height="630"
                  className="w-full border-2 border-muted rounded-lg"
                />
                
                <Button
                  onClick={downloadImage}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  size="lg"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download Image
                </Button>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>💡 <strong>Tip:</strong> After downloading, you can upload this image when submitting your blog post.</p>
                  <p>📐 <strong>Size:</strong> 1200x630px (optimized for social media)</p>
                  <p>📁 <strong>Format:</strong> PNG with transparency support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Generated Image Dialog */}
        <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                AI Generated Blog Image
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Card className="bg-muted/30">
                <CardContent className="p-6">
                  <div 
                    className="w-full bg-white rounded-lg shadow-xl overflow-hidden mx-auto"
                    style={{ 
                      width: '100%',
                      maxWidth: '800px',
                      aspectRatio: '1200/630'
                    }}
                  >
                    <svg 
                      viewBox="0 0 1200 630" 
                      className="w-full h-full"
                      dangerouslySetInnerHTML={{ __html: aiImage?.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '') || '' }}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="text-center text-sm text-muted-foreground">
                📐 Size: 1200x630px (optimized for social media)
              </div>

              <div className="flex gap-3 justify-center">
                <Button onClick={downloadAiImagePng} size="lg" className="gap-2">
                  <Download className="h-4 w-4" />
                  PNG
                </Button>
                <Button onClick={downloadAiImage} size="lg" variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  SVG
                </Button>
                <Button variant="outline" size="lg" onClick={() => setShowAiDialog(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
