import vision from '@google-cloud/vision';

export interface FeedbackItem {
  type: 'accessibility' | 'visual-hierarchy' | 'content' | 'ui-ux';
  message: string;
  coordinates?: { x: number; y: number; w: number; h: number } | null;
}

const client = new vision.ImageAnnotatorClient({
  keyFilename: '/usr/src/app/secrets/google-api.json',
});

export async function analyzeImageWithGoogleVision(filePath: string): Promise<FeedbackItem[]> {
  try {
    const feedback: FeedbackItem[] = [];

    const [objectResult, labelResult, textResult] = await Promise.all([
      typeof client.objectLocalization === 'function'
        ? client.objectLocalization({ image: { source: { filename: filePath } } })
        : [{}],
      client.labelDetection({ image: { source: { filename: filePath } } }),
      client.textDetection({ image: { source: { filename: filePath } } }),
    ]);

    // Object Localization
    const objects = (objectResult as any)[0]?.localizedObjectAnnotations || [];
    feedback.push(
      ...objects.map((obj: any) => ({
        type: 'visual-hierarchy' as const,
        message: `Detected object: ${obj.name} with confidence ${(obj.score! * 100).toFixed(1)}%`,
        coordinates: obj.boundingPoly?.normalizedVertices
          ? {
              x: obj.boundingPoly.normalizedVertices[0].x || 0,
              y: obj.boundingPoly.normalizedVertices[0].y || 0,
              w: obj.boundingPoly.normalizedVertices[2].x! - obj.boundingPoly.normalizedVertices[0].x!,
              h: obj.boundingPoly.normalizedVertices[2].y! - obj.boundingPoly.normalizedVertices[0].y!,
            }
          : null,
      }))
    );

    // Label Detection (no bounding box in labels, set null)
    const labels = (labelResult as any)[0]?.labelAnnotations || [];
    feedback.push(
      ...labels.map((label: any) => ({
        type: 'content' as const,
        message: `Detected label: ${label.description} (${(label.score! * 100).toFixed(1)}%)`,
        coordinates: null,
      }))
    );

    // Text Detection
    const texts = (textResult as any)[0]?.textAnnotations || [];
    if (texts.length > 0) {
      const mainText = texts[0];
      // Take first bounding box if available
      const bounding = mainText.boundingPoly?.vertices;
      feedback.push({
        type: 'accessibility' as const,
        message: `Detected text: "${mainText.description}"`,
        coordinates: bounding
          ? {
              x: bounding[0].x || 0,
              y: bounding[0].y || 0,
              w: (bounding[2].x! - bounding[0].x!),
              h: (bounding[2].y! - bounding[0].y!),
            }
          : null,
      });
    }

    // Fallback
    if (feedback.length === 0) {
      feedback.push({
        type: 'ui-ux' as const,
        message: 'No objects, labels, or text detected. Check if the image is clear and well-lit.',
        coordinates: null,
      });
    }

    return feedback;
  } catch (error) {
    console.error('Google Vision analysis failed:', error);
    return [
      {
        type: 'ui-ux' as const,
        message: 'Failed to generate feedback',
        coordinates: null,
      },
    ];
  }
}
