import { AudioRecorder, requestRecordingPermissionsAsync, setAudioModeAsync } from 'expo-audio';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';

export class VoiceRecorder {
  private recorder: AudioRecorder | null = null;
  private onLevelChange: ((level: number) => void) | null = null;
  private levelInterval: NodeJS.Timeout | null = null;

  public async startRecording(onLevel: (level: number) => void) {
    try {
      const permission = await requestRecordingPermissionsAsync();
      if (permission.status !== 'granted') {
        throw new Error('Permission to access microphone was denied');
      }

      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

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
      
      this.onLevelChange = onLevel;

      this.levelInterval = setInterval(() => {
        if (this.recorder) {
          const status = this.recorder.getStatus();
          if (status.isRecording) {
            // Since meter API differs or is absent in basic getStatus, fallback to 0.5 or custom implementation if needed.
            // Some versions of expo-audio might not provide metering via getStatus. 
            // We'll emulate a safe normalized value if metering is not natively available to avoid breaking.
            const level = (status as any).metering || -160;
            const normalized = Math.max(0, (level + 160) / 160);
            this.onLevelChange?.(normalized);
          }
        }
      }, 100);

    } catch (err) {
      console.error('Failed to start recording', err);
      throw err;
    }
  }

  public async stopRecording(): Promise<{ uri: string; duration: number } | null> {
    if (!this.recorder) return null;

    try {
      if (this.levelInterval) clearInterval(this.levelInterval);
      
      await this.recorder.stop();
      const uri = this.recorder.uri;
      const status = this.recorder.getStatus();
      const duration = status.durationMillis || 0;

      this.recorder = null;

      if (!uri) return null;

      // Move to permanent storage
      const voiceDir = `${FileSystem.documentDirectory}voice/`;
      const fileName = `${Crypto.randomUUID()}.aac`;
      const newUri = `${voiceDir}${fileName}`;

      await FileSystem.makeDirectoryAsync(voiceDir, { intermediates: true });
      await FileSystem.moveAsync({ from: uri, to: newUri });

      return { uri: newUri, duration };
    } catch (err) {
      console.error('Failed to stop recording', err);
      return null;
    }
  }

  public async cancelRecording() {
    if (!this.recorder) return;
    if (this.levelInterval) clearInterval(this.levelInterval);
    await this.recorder.stop();
    this.recorder = null;
  }
}

export const voiceRecorder = new VoiceRecorder();
