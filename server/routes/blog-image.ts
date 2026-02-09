import { Router } from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const router = Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY not configured');
  }
  
  return new GoogleGenAI({ apiKey });
};

router.post('/generate', async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (error) {
      return res.status(500).json({
        error: 'API key not configured',
        message: error instanceof Error ? error.message : 'GEMINI_API_KEY missing',
      });
    }

    const prompt = `Create a stunning blog post cover image for Tech Atlas Uganda with this title: "${title}"

🎨 DESIGN REQUIREMENTS:
- IMPORTANT: SVG must be EXACTLY 1200x630px (width="1200" height="630" viewBox="0 0 1200 630")
- Modern, vibrant design with purple/pink/blue gradients
- Include "Tech Atlas" branding subtly
- Use creative visual elements related to the blog title
- Professional, eye-catching design
- Perfect for social media sharing
- The title "${title}" should be prominently displayed
- Add decorative elements, icons, or illustrations that match the topic
- Use modern typography
- ALL content must fit within the 1200x630px frame

📱 FORMAT: Return ONLY valid SVG code
🎯 GOAL: Create a beautiful, shareable blog post cover image

CRITICAL: Ensure SVG has width="1200" height="630" viewBox="0 0 1200 630"

Return ONLY the SVG code, no explanations.`;

    const config = {
      thinkingConfig: {
        thinkingLevel: ThinkingLevel.HIGH,
      },
      temperature: 0.9,
      topP: 0.95,
    };

    const model = 'gemini-3-flash-preview';

    const contents = [{
      role: 'user',
      parts: [{ text: prompt }],
    }];

    console.log('Generating blog image for:', title);
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });

    let svgCode = '';
    for await (const chunk of response) {
      if (chunk.text) {
        svgCode += chunk.text;
      }
    }

    // Clean up SVG
    svgCode = svgCode.trim();
    
    const svgMatch = svgCode.match(/```(?:svg)?\s*([\s\S]*?)```/);
    if (svgMatch) {
      svgCode = svgMatch[1].trim();
    }

    if (!svgCode.startsWith('<svg')) {
      const svgStart = svgCode.indexOf('<svg');
      if (svgStart !== -1) {
        svgCode = svgCode.substring(svgStart);
      }
    }

    if (!svgCode.endsWith('</svg>')) {
      const svgEnd = svgCode.lastIndexOf('</svg>');
      if (svgEnd !== -1) {
        svgCode = svgCode.substring(0, svgEnd + 6);
      }
    }

    console.log('Blog image generated successfully');
    res.json({
      success: true,
      svg: svgCode,
      title,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating blog image:', error);
    res.status(500).json({
      error: 'Failed to generate',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
