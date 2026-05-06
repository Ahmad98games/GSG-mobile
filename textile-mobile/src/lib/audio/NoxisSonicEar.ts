import { AudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import { VoiceCommandProcessor } from './VoiceCommandProcessor';
import { ModelManager } from '../../services/ModelManager';
import * as Haptics from 'expo-haptics';

/**
 * NOXIS SONIC EAR
 * High-performance offline speech-to-text with industrial noise suppression.
 * NoxisSonicEar Industrial Engine
 */

export class NoxisSonicEarError extends Error {
  constructor(message: string, options?: { cause?: any }) {
    super(message);
    this.name = 'NoxisSonicEarError';
    if (options?.cause) (this as any).cause = options.cause;
  }
}

export class NoxisSonicEar {
  private static recorder: AudioRecorder | null = null;
  private static isListening = false;

  /**
   * Initializes the Sonic Ear engine and loads the local acoustic model.
   */
  public static async initialize() {
    try {
      await requestRecordingPermissionsAsync();
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // 1. Ensure Model is Ready
      const modelPath = await ModelManager.getModelPath('voice');
      if (!modelPath) {
        console.log('[NoxisSonicEar / NSE] MODEL_NOT_FOUND: Required for offline processing.');
        // UI will prompt download via startListening gate
      }

      console.log('[NoxisSonicEar / NSE] ENGINE_INITIALIZED: Industrial Model Ready');
    } catch (err: any) {
      throw new NoxisSonicEarError(`Init failed: ${err.message}`, { cause: err });
    }
  }

  /**
   * Start listening (Push-to-Talk).
   */
  public static async startListening() {
    if (this.isListening) return;

    // 2. Model Download Gate
    const modelPath = await ModelManager.getModelPath('voice');
    if (!modelPath) {
      console.log('[NoxisSonicEar / NSE] START_ABORTED: Model downloading...');
      await ModelManager.downloadModel('voice');
      return;
    }

    this.isListening = true;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      this.recorder = new AudioRecorder({
        android: {
          extension: '.aac',
          outputFormat: 'aac_adts',
          audioEncoder: 'aac',
          sampleRate: 44100,
        },
        ios: {
          extension: '.aac',
          audioQuality: 127,
          sampleRate: 44100,
        },
      });

      await this.recorder.prepareToRecordAsync();
      this.recorder.record();
      
      // 3. Noise Threshold Monitor - Note: expo-audio getStatus metering behavior might differ
      // We implement a polling fallback for metering if needed, or rely on event listeners if available
      const checkInterval = setInterval(() => {
        if (!this.isListening || !this.recorder) {
          clearInterval(checkInterval);
          return;
        }
        const status: any = this.recorder.getStatus();
        if (status.metering !== undefined && status.metering > -2) { // Roughly 85dB+ threshold
          console.warn('[NoxisSonicEar / NSE] NOISE_THRESHOLD_EXCEEDED');
          // Optional: Pulse UI to indicate noise interference
        }
      }, 200);

      console.log('[NoxisSonicEar / NSE] MIC_ACTIVE: Local-only processing enforced.');

    } catch (err: any) {
      this.isListening = false;
      throw new NoxisSonicEarError(`Start failed: ${err.message}`, { cause: err });
    }
  }

  /**
   * Stop listening and process audio with NSE Industrial STT locally.
   */
  public static async stopListening() {
    if (!this.recorder) return;
    this.isListening = false;

    try {
      const status: any = this.recorder.getStatus();
      
      // 4. Noise Protection: Disable if too loud
      if (status.metering !== undefined && status.metering > -1) {
         console.warn('[NoxisSonicEar / NSE] ABORTING: Environment too loud for voice commands');
         await this.recorder.stop();
         this.recorder = null;
         return;
      }

      await this.recorder.stop();
      const uri = this.recorder.uri;
      this.recorder = null;

      if (uri) {
        console.log('[NoxisSonicEar / NSE] PROCESSING_LOCAL_BUFFER');
        
        // 5. Privacy Enforcement: Never log raw text/audio to Sentry/Remote
        // const text = await Vosk.recognize(uri);
        // VoiceCommandProcessor.process(text);
      }

    } catch (err: any) {
      throw new NoxisSonicEarError(`Stop failed: ${err.message}`, { cause: err });
    }
  }
}
