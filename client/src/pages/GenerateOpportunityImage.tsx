import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Download, Upload, CheckCircle } from "lucide-react";

export default function GenerateOpportunityImage() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const generateImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d')!;

    // Background gradient (Green to Emerald)
    const gradient = ctx.createLinearGradient(0, 0, 400, 300);
    gradient.addColorStop(0, '#34D399'); // Green
    gradient.addColorStop(1, '#059669'); // Emerald
    
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
    ctx.fillText('OPPORTUNITY', 200, 150);
    
    // Add icon
    ctx.font = '48px Arial, sans-serif';
    ctx.fillText('🏆', 200, 200);

    const dataUrl = canvas.toDataURL('image/png');
    setPreviewUrl(dataUrl);
    toast.success("Image generated!");
  };

  const uploadImage = async () => {
    if (!previewUrl) {
      toast.error("Generate image first!");
      return;
    }

    setUploading(true);
    try {
      // Convert data URL to blob
      const response = await fetch(previewUrl);
      const blob = await response.blob();

      // Upload to Supabase
      const fileName = `default-opportunity-${Date.now()}.png`;
      const filePath = `defaults/${fileName}`;

      console.log('📤 Uploading to opportunity-images/defaults/...');

      const { data, error } = await supabase.storage
        .from('opportunity-images')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        toast.error(`Upload failed: ${error.message}`);
        return;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('opportunity-images')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      console.log('✅ Uploaded:', publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const downloadImage = () => {
    if (!previewUrl) {
      toast.error("Generate image first!");
      return;
    }

    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = 'default-opportunity.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="container max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🏆 Generate Default Opportunity Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Generate and upload the default Tech Atlas branded image for opportunities.
              </p>

              <div className="flex gap-3">
                <Button onClick={generateImage} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Generate Image
                </Button>
                <Button onClick={downloadImage} variant="outline" className="gap-2" disabled={!previewUrl}>
                  <Download className="h-4 w-4" />
                  Download PNG
                </Button>
                <Button 
                  onClick={uploadImage} 
                  variant="default" 
                  className="gap-2 bg-green-600 hover:bg-green-700" 
                  disabled={!previewUrl || uploading}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Uploading..." : "Upload to Supabase"}
                </Button>
              </div>
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  <img 
                    src={previewUrl} 
                    alt="Generated opportunity image" 
                    className="w-full max-w-md border rounded"
                  />
                </div>
              </div>
            )}

            {imageUrl && (
              <div className="space-y-4">
                <div className="border border-green-500 rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
                  <p className="text-sm font-medium mb-2 text-green-700 dark:text-green-300">
                    ✅ Image uploaded successfully!
                  </p>
                  <p className="text-xs text-muted-foreground mb-2">Public URL:</p>
                  <code className="block p-2 bg-background rounded text-xs break-all">
                    {imageUrl}
                  </code>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Next steps:</p>
                    <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                      <li>Copy the URL above</li>
                      <li>Update <code>client/src/components/AIEventsAgent.tsx</code></li>
                      <li>Replace <code>defaultOpportunityImage</code> with this URL</li>
                      <li>Test the AI agent on /events page</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            <div className="border rounded-lg p-4 bg-muted/50">
              <p className="text-sm font-medium mb-2">Image Specifications:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Size: 400x300px</li>
                <li>• Format: PNG</li>
                <li>• Colors: Green (#34D399) to Emerald (#059669) gradient</li>
                <li>• Text: "TECH ATLAS" and "OPPORTUNITY"</li>
                <li>• Icon: 🏆 trophy emoji</li>
                <li>• Bucket: opportunity-images/defaults/</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
