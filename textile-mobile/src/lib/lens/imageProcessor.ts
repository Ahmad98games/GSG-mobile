import * as ImageManipulator from 'expo-image-manipulator';

/**
 * NOXIS LENS IMAGE PROCESSOR
 * Optimizes scanned documents for OCR and transmission.
 */

export interface ProcessedDocument {
  uri: string;
  base64: string;
}

export async function processDocument(
  uri: string
): Promise<ProcessedDocument> {
  // Step 1: Resize to reasonable size
  // Max 1200px wide to balance quality vs size
  // We use ImageManipulator to resize and compress
  const resized = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { 
      compress: 0.8, 
      format: ImageManipulator.SaveFormat.JPEG,
      base64: true 
    }
  );

  // Note: Tesseract handles color well, but compression is key for NSP TCP
  return {
    uri: resized.uri,
    base64: resized.base64 || ''
  };
}

/**
 * Estimates quality based on payload size.
 * Good documents are usually 100KB+ (133KB+ base64)
 */
export function estimateDocumentQuality(
  base64: string
): 'good' | 'low_light' | 'blurry' | 'too_small' | 'too_large' {
  const estimatedBytes = base64.length * 0.75;
  
  if (estimatedBytes < 30000) return 'too_small';
  if (estimatedBytes < 100000) return 'low_light';
  if (estimatedBytes > 10000000) return 'too_large';
  
  return 'good';
}
