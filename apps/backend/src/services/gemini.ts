// services/gemini.ts
import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FeedbackItem } from './googleVision';

const API_KEY = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Calls Gemini + Google Vision feedback to generate structured UI/UX suggestions.
 * Returns an array of FeedbackItems (same shape as Vision feedback).
 */
export async function getHybridUIUXSuggestions(
  feedback: FeedbackItem[],
  imagePath: string
): Promise<FeedbackItem[]> {
  try {
    const imageData = fs.readFileSync(imagePath);

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
You are a UX/UI expert tasked with analyzing a screen design. 
You will be provided with:
1. Google Vision feedback (objects, text, and detected regions)
2. A screenshot of the screen itself

Your job is to generate **structured feedback** covering these categories:
- **Accessibility issues** (contrast, text size, missing alt text, keyboard navigation, color blindness)
- **Visual hierarchy problems** (spacing, alignment, typography, inconsistent sizing)
- **Content/copy suggestions** (tone, clarity, conciseness, readability)
- **UI/UX recommendations** (button placement, information architecture, interaction affordances)

### Rules:
- Each feedback item must include:
  - **type**: one of [accessibility | visual-hierarchy | content | ui-ux]
  - **message**: a clear, actionable suggestion
  - **coordinates**: {x,y,w,h} using bounding boxes/text regions from Vision data.  
    If no coordinates are available, return \`null\`.
- Output **must be valid JSON only**, no plain text or explanations.
- Provide multiple feedback items in a **JSON array**.

### Role-based relevance (for later filtering):
- Designers → accessibility, visual-hierarchy  
- Reviewers → content, visual-hierarchy  
- Product managers → content, ui-ux  
- Developers → ui-ux  

### Input data:
${JSON.stringify(feedback, null, 2)}

### Expected Output (JSON only):
[
  {
    "type": "accessibility",
    "message": "Increase color contrast between text and background for better readability.",
    "coordinates": { "x": 120, "y": 200, "w": 300, "h": 50 }
  },
  {
    "type": "visual-hierarchy",
    "message": "Reduce spacing between heading and subheading for better grouping.",
    "coordinates": null
  },
  {
    "type": "content",
    "message": "Shorten the call-to-action text for clarity.",
    "coordinates": { "x": 400, "y": 600, "w": 180, "h": 40 }
  }
]
`;


    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageData.toString('base64'),
          mimeType: 'image/png',
        },
      },
    ]);

    const response = await result.response;
    let rawText = response.text() || '[]';

    rawText = rawText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    // Extract JSON array if mixed text is present
    const jsonMatch = rawText.match(/\[[\s\S]*\]/);
    const cleanJson = jsonMatch ? jsonMatch[0] : rawText;

    let parsed: FeedbackItem[] = [];
    try {
      parsed = JSON.parse(cleanJson);
    } catch (err) {
      console.error('❌ Gemini JSON parse failed. Cleaned:', cleanJson);
    }

    return parsed;
  } catch (error) {
    console.error('❌ Error generating UX suggestions:', error);
    return [];
  }
}
