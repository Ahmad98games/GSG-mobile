import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export interface VersionInfo {
  latest_version: string;
  apk_url: string;
  hash: string;
}

/**
 * SILENT UPDATE RECEIVER (v2.0)
 * Focus: Local Hub-to-Node deployment with Hash Check.
 */
class CheckUpdateService {
  private currentVersion = Constants.expoConfig?.version || '1.0.0';

  /**
   * Fetches latest version from Hub
   */
  public async checkForUpdates(): Promise<VersionInfo | null> {
    try {
      const hubIp = await AsyncStorage.getItem('gs_hub_ip');
      if (!hubIp) return null;

      const response = await fetch(`http://${hubIp}:7447/api/deploy/check-update`);
      if (!response.ok) throw new Error('HUB_VERSION_UNREACHABLE');

      const latest: VersionInfo = await response.json();
      
      if (this.isUpdateAvailable(latest.latest_version)) {
        return latest;
      }
      return null;
    } catch (e) {
      console.warn('[Update] Check failed:', e);
      return null;
    }
  }

  private isUpdateAvailable(latestVersion: string): boolean {
    if (!latestVersion) return false;
    const current = this.currentVersion.split('.').map(Number);
    const latest = latestVersion.split('.').map(Number);

    for (let i = 0; i < 3; i++) {
      if ((latest[i] || 0) > (current[i] || 0)) return true;
      if ((latest[i] || 0) < (current[i] || 0)) return false;
    }
    return false;
  }

  /**
   * Downloads, validates SHA-256 and triggers installation
   */
  public async installUpdate(apkUrl: string, expectedHash: string, onProgress?: (p: number) => void) {
    if (Platform.OS !== 'android') return;

    try {
      const hubIp = await AsyncStorage.getItem('gs_hub_ip');
      const fullUrl = `http://${hubIp}:7447${apkUrl}`;
      const filePath = `${RNFS.DocumentDirectoryPath}/update.apk`;

      // Remove old file if exists
      const exists = await RNFS.exists(filePath);
      if (exists) {
        await RNFS.unlink(filePath);
      }

      // Download using react-native-fs
      const download = RNFS.downloadFile({
        fromUrl: fullUrl,
        toFile: filePath,
        progress: (res) => {
          if (res.contentLength > 0) {
            const progress = res.bytesWritten / res.contentLength;
            if (onProgress) onProgress(progress);
          }
        },
        progressDivider: 2, // Emit progress events moderately
      });

      const result = await download.promise;
      if (result.statusCode !== 200) {
        throw new Error('DOWNLOAD_FAILED');
      }

      // Security Check: Calculate SHA-256 of downloaded file
      const fileHash = await RNFS.hash(filePath, 'sha256');
      if (fileHash.toLowerCase() !== expectedHash.toLowerCase()) {
        await RNFS.unlink(filePath);
        throw new Error('CORRUPTED');
      }

      // Trigger Installation Intent
      const fileUri = `file://${filePath}`;
      const contentUri = await FileSystem.getContentUriAsync(fileUri);
      
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: contentUri,
        flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
        type: 'application/vnd.android.package-archive',
      });
    } catch (e) {
      console.error('[Update] Install failed:', e);
      throw e;
    }
  }
}

export const updateService = new CheckUpdateService();

