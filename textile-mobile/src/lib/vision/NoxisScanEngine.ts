import { createWorker } from './NoxisScanEngine/index';
import * as ImageManipulator from 'expo-image-manipulator';
import { ModelManager } from '../../services/ModelManager';

/**
 * NOXIS SCAN ENGINE (NIDP)
 * Industrial vision core for textile invoice extraction.
 * [NoxisScanEngine / Tesseract 5.x]
 */

export class NoxisScanEngineError extends Error {
  constructor(message: string, options?: { cause?: any }) {
    super(message);
    this.name = 'NoxisScanEngineError';
    if (options?.cause) (this as any).cause = options.cause;
  }
}

export interface ExtractedInvoiceData {
  rawText: string;
  amount: string | null;
  billNo: string | null;
  date: string | null;
  lowConfidence: boolean;
}

export class NoxisScanEngine {
  /**
   * Processes an invoice image and extracts financial fields.
   */
  public static async processInvoice(imageUri: string) {
    console.log('[NoxisScanEngine / Tesseract 5.x] START_INFERENCE:', imageUri);

    // 1. Ensure Model is Ready
    const modelPath = await ModelManager.getModelPath('ocr');
    if (!modelPath) {
       console.log('[NoxisScanEngine / Tesseract 5.x] MODEL_NOT_FOUND: Initiating download...');
       await ModelManager.downloadModel('ocr');
    }

    let worker: any = null;
    try {
      // 2. Industrial Preprocessing
      const processed = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1200 } }],
        { format: ImageManipulator.SaveFormat.JPEG, compress: 0.8 }
      );

      // 3. Worker Lifecycle Management (Per-Scan Isolation)
      worker = await createWorker('eng');
      
      // 4. Timeout: 15s Limit
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('TIMEOUT_EXCEEDED')), 15000)
      );

      const recognitionPromise = worker.recognize(processed.uri);
      
      const { data } = await Promise.race([recognitionPromise, timeoutPromise]) as any;
      const text = data.text;
      const confidence = data.confidence;

      console.log(`[NoxisScanEngine / Tesseract 5.x] RECOGNITION_COMPLETE: Confidence: ${confidence}%`);

      // 5. Confidence Gate: < 60% requires manual review
      if (confidence < 60) {
        console.warn('[NoxisScanEngine / Tesseract 5.x] LOW_CONFIDENCE_WARNING');
        return {
          rawText: text,
          amount: null,
          billNo: null,
          date: null,
          lowConfidence: true
        };
      }

      // 6. Noxis Regex Parser
      const amountRegex = /(?:Total|Amt|Amount|Rs\.?)\s*[:\-\s]*([\d,]+\.?\d*)/i;
      const billNoRegex = /(?:Bill|Inv|Invoice|No\.?)\s*[:\-\s]*([A-Z0-9\-\/]+)/i;
      const dateRegex = /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/;

      return {
        rawText: text,
        amount: text.match(amountRegex)?.[1]?.replace(/,/g, '') || null,
        billNo: text.match(billNoRegex)?.[1] || null,
        date: text.match(dateRegex)?.[0] || null,
        lowConfidence: false
      };

    } catch (err: any) {
      const msg = err.message === 'TIMEOUT_EXCEEDED' 
        ? 'Image too complex — try better lighting' 
        : `OCR failed: ${err.message}`;
      
      throw new NoxisScanEngineError(msg, { cause: err });
    } finally {
      // 7. Memory: Aggressive Resource Release
      if (worker) {
        await worker.terminate();
        console.log('[NoxisScanEngine / Tesseract 5.x] WORKER_TERMINATED');
      }
    }
  }
}
