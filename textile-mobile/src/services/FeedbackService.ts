import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';

/**
 * TACTICAL FEEDBACK SERVICE
 * Focus: Industrial-grade worker feedback (Eyes-free operation)
 */
class FeedbackService {
  private successSound: Audio.Sound | null = null;
  private errorSound: Audio.Sound | null = null;

  constructor() {
    this.setupAudio();
  }

  private async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Industrial Override
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      
      // Load sounds - In a real app, these would be local assets
      // For now, we'll initialize them with placeholders if assets are available later
    } catch (error) {
      console.warn('[Feedback] Audio setup failed:', error);
    }
  }

  /**
   * SUCCESS: Short vibrate + Bleep
   * Used for: Successful scan, ACK received
   */
  public async success() {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // Play "Bleep" sound here
      // await this.playSuccessSound();
    } catch (e) {}
  }

  /**
   * ERROR: Heavy long vibrate + Warning Buzz
   * Used for: Scan failure, Sync error, Collision
   */
  public async error() {
    try {
      // Mod 1: Heavy long vibrate for errors
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 100);
      
      // Play "Warning Buzz" sound here
      // await this.playErrorSound();
    } catch (e) {}
  }

  /**
   * WARNING: Medium impact
   */
  public async warning() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {}
  }

  /**
   * PULSE: Light tap for background rhythm
   */
  public async pulse() {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (e) {}
  }
}

export const feedback = new FeedbackService();
