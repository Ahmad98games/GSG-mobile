import * as FileSystem from 'expo-file-system';
import { openMeshDb } from '../lib/db/meshDb';

/**
 * VOICE FILE MANAGER
 * Handles automated storage maintenance for industrial audio data.
 */
export class VoiceFileManager {
  private static VOICE_DIR = `${FileSystem.documentDirectory}voice/`;

  /**
   * Runs maintenance tasks on cold boot.
   */
  public static async runCleanup() {
    console.log('[VoiceFileManager] Starting maintenance sequence...');
    const db = await openMeshDb();
    
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.VOICE_DIR);
      if (!dirInfo.exists) return;

      const files = await FileSystem.readDirectoryAsync(this.VOICE_DIR);
      let deletedCount = 0;
      let freedBytes = 0;

      for (const fileName of files) {
        const filePath = this.VOICE_DIR + fileName;
        
        // Query DB for message status
        const result = await db.getFirstAsync<{ id: string, read_at: string | null }>(
          'SELECT id, read_at FROM messages WHERE local_path = ?',
          [filePath]
        );

        let shouldDelete = false;
        if (!result) {
          // Orphaned file: file exists on disk but no matching DB record.
          shouldDelete = true;
        } else if (result.read_at) {
          // Retention policy: Delete read messages older than 30 days.
          const readDate = new Date(result.read_at).getTime();
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          if (readDate < thirtyDaysAgo) {
            shouldDelete = true;
          }
        }

        if (shouldDelete) {
          const info = await FileSystem.getInfoAsync(filePath);
          if (info.exists) {
            freedBytes += info.size || 0;
            await FileSystem.deleteAsync(filePath);
            deletedCount++;
            
            // Update DB to null out the local_path since file is gone
            if (result) {
              await db.runAsync('UPDATE messages SET local_path = NULL WHERE id = ?', [result.id]);
            }
          }
        }
      }

      const freedMB = (freedBytes / (1024 * 1024)).toFixed(2);
      console.log(`[VoiceFileManager] Maintenance complete. Cleaned ${deletedCount} files, freed ${freedMB} MB.`);

      // 30-day retention for industrial notification logs
      const logResult = await db.runAsync(
        "DELETE FROM notification_log WHERE displayed_at < datetime('now', '-30 days')"
      );
      if (logResult.changes > 0) {
        console.log(`[VoiceFileManager] Purged ${logResult.changes} legacy notification logs.`);
      }
    } catch (e) {
      console.error('[VoiceFileManager] Maintenance fault:', e);
    }
  }
}
