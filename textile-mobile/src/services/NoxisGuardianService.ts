import FingerprintScanner from '../lib/auth/NoxisGuardian';
import { tcpService } from './TCPClientService';
import { MobileCrypto } from '../lib/MobileCrypto';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';
import crypto from 'react-native-quick-crypto';
import { meshBus, MeshEvent } from './MeshEventBus';

/**
 * NOXIS GUARDIAN AUTH SERVICE
 * Hardened remote biometric authorization for the industrial PC Hub.
 */
export class NoxisGuardianService {
  private static isAuthenticating = false;
  private static requestHistory: number[] = [];

  /**
   * Triggers biometric validation for a remote PC request (NSP protocol).
   */
  public static async requestBiometric(req: { request_id: string, hub_action: string, expires_at: number }) {
    // 1. Rate Limiting: 3 requests / 60s
    const now = Date.now();
    this.requestHistory = this.requestHistory.filter(ts => now - ts < 60000);
    if (this.requestHistory.length >= 3) {
      console.warn('[GUARDIAN] FLOOD_DETECTED: Dropping auth request.');
      meshBus.broadcast('GUARDIAN_FLOOD_DETECTED' as MeshEvent, { requestId: req.request_id });
      return;
    }
    this.requestHistory.push(now);

    // 2. TTL Check: Mobile-side validation
    if (now > req.expires_at) {
      console.error('[GUARDIAN] REQ_EXPIRED: Request TTL exceeded.');
      // In a real UI, we'd show a toast: "Request expired — Hub must re-request"
      return;
    }

    if (this.isAuthenticating) return;
    this.isAuthenticating = true;

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      
      // 3. Biometric Prompt with Hub Action
      await FingerprintScanner.authenticate({
        title: 'Noxis Guardian Auth',
        subTitle: 'Awaiting Biometric Signature',
        description: `Hub requests: ${req.hub_action} — Approve with biometric`,
      });

      // Authentication Success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // 4. Token Hardening: HMAC-SHA256(requestId + ':' + timestamp)
      const meshKeyHex = await SecureStore.getItemAsync('gs_mesh_key');
      if (!meshKeyHex) {
        console.error('[GUARDIAN] NO_MESH_KEY: Cannot sign auth response.');
        return;
      }
      const timestamp = Date.now();
      const hmac = crypto.createHmac('sha256', Buffer.from(meshKeyHex, 'hex'));
      hmac.update(`${req.request_id}:${timestamp}`);
      const authToken = hmac.digest('hex');

      // Send Response via NSP (TCP)
      const { NspService } = require('./NspService');
      await NspService.sendResponse({
        guardian_response: {
          request_id: req.request_id,
          approved: true,
          node_id: await SecureStore.getItemAsync('gs_node_id'),
          timestamp: timestamp,
          auth_token: authToken
        }
      });

      // 5. Clear breach from UI state and cancel notification
      const { useAlertStore } = require('../store/AlertStore');
      useAlertStore.getState().removeBreach(req.expires_at);

      const notifee = require('../lib/notifications/notifee').default;
      await notifee.cancelAllNotifications();

    } catch (error: any) {
      console.error('[GUARDIAN] AUTH_FAULT', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      const { NspService } = require('./NspService');
      await NspService.sendResponse({
        guardian_response: {
          request_id: req.request_id,
          approved: false,
          node_id: await SecureStore.getItemAsync('gs_node_id'),
          timestamp: Date.now()
        }
      });
    } finally {
      this.isAuthenticating = false;
      FingerprintScanner.release();
    }
  }
}
