import * as Battery from 'expo-battery';
import * as Brightness from 'expo-brightness';
import { AppState, type AppStateStatus, Platform } from 'react-native';
import { Heartbeat } from './HeartbeatService';

/**
 * ENERGY SHIELD SERVICE
 * Focus: Battery & Heat Optimization for 12-hour shifts.
 */
class EnergyShieldService {
  private idleTimer: NodeJS.Timeout | null = null;
  private originalBrightness: number = 0.8;
  private IDLE_THRESHOLD = 2 * 60 * 1000; // 2 minutes
  private LOW_BATTERY_THRESHOLD = 0.15; // 15%

  constructor() {
    this.init();
  }

  private async init() {
    if (Platform.OS === 'web') return;

    // 1. Set original brightness to current
    const { status } = await Brightness.requestPermissionsAsync();
    if (status === 'granted') {
      this.originalBrightness = await Brightness.getBrightnessAsync();
    }

    // 2. Battery Listener
    Battery.addBatteryLevelListener(({ batteryLevel }) => {
      this.checkBattery(batteryLevel);
    });

    // 3. App State / Activity Listener
    // We'll reset the timer on activity in the UI components
  }

  /**
   * Adaptive Heartbeat based on battery
   */
  private checkBattery(level: number) {
    if (level <= this.LOW_BATTERY_THRESHOLD) {
      console.log('[EnergyShield] Low Battery detected. Throttling Heartbeat.');
      Heartbeat.updateFrequency(60000); // 60s
    } else {
      Heartbeat.updateFrequency(30000); // 30s
    }
  }

  /**
   * Reset Idle Timer
   * Should be called on user interaction
   */
  public async resetIdleTimer() {
    if (Platform.OS === 'web') return;
    if (this.idleTimer) clearTimeout(this.idleTimer);
    
    // Restore brightness if dimmed
    const current = await Brightness.getBrightnessAsync();
    if (current < 0.3) {
      await Brightness.setBrightnessAsync(this.originalBrightness);
    }

    this.idleTimer = setTimeout(() => this.dimScreen(), this.IDLE_THRESHOLD);
  }

  private async dimScreen() {
    if (Platform.OS === 'web') return;
    try {
      const { status } = await Brightness.requestPermissionsAsync();
      if (status === 'granted') {
        console.log('[EnergyShield] Idle detected. Dimming screen to save energy.');
        await Brightness.setBrightnessAsync(0.2);
      }
    } catch (e) {}
  }
}

export const energyShield = new EnergyShieldService();
