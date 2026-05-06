import { useProductStore } from '../../store/useProductStore';
import { tcpService } from '../../services/TCPClientService';
import * as Haptics from 'expo-haptics';
import { meshBus, MeshEvent } from '../../services/MeshEventBus';

/**
 * VOICE COMMAND PROCESSOR
 * Hardened NLP bridge for automated ledger entries and remote control.
 */

export class VoiceCommandProcessor {
  /**
   * Processes raw text from Sonic Ear and triggers the appropriate action.
   */
  public static async process(text: string) {
    // 1. Privacy: Never log transcribed text to remote services
    const cleanText = text.toLowerCase().trim();

    // Pattern 1: Khata Entry (supports: amount, party, and optional note)
    // Matches: "debit 500 for Ahmad" or "credit 1000 to Ali note fabric payment"
    const khataRegex = /(debit|credit)\s+(\d+)\s+(?:for|to)\s+([a-z0-9\s]+?)(?:\s+(?:note|rem)\s+(.+))?$/i;
    const khataMatch = cleanText.match(khataRegex);

    if (khataMatch) {
      const [, type, amount, person, note] = khataMatch;
      console.log(`[VOICE] KHATA_RECOGNIZED: ${type} ${amount} for ${person} (Note: ${note || 'N/A'})`);
      
      await this.handleKhataEntry(type as 'debit' | 'credit', parseInt(amount), person.trim(), note?.trim());
      return;
    }

    // Pattern 2: Remote Hub Control
    const hubRegex = /(?:show|open|system)\s+([a-z0-9\s]+)/i;
    const hubMatch = cleanText.match(hubRegex);

    if (hubMatch) {
      const [, command] = hubMatch;
      await this.handleHubCommand(command);
      return;
    }

    // 3. UNKNOWN COMMAND handling
    console.warn(`[VOICE] UNKNOWN_COMMAND: "${cleanText}"`);
    // Signal UI to show "Command not recognized"
    meshBus.broadcast('VOICE_COMMAND_UNKNOWN' as MeshEvent, { rawText: cleanText });
  }

  private static async handleKhataEntry(type: 'debit' | 'credit', amount: number, person: string, note?: string) {
    const store = useProductStore.getState();
    const party = store.parties.find(p => p.name.toLowerCase().includes(person.toLowerCase()));
    
    if (party) {
      store.addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        party_id: party.id,
        amount: amount,
        type: type,
        category: 'VOICE_ENTRY',
        description: note || `Voice entry: ${type} ${amount}`,
        created_at: new Date().toISOString(),
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Send result via NSP (Log action but not raw words)
      const { NspService } = require('../../services/NspService');
      await NspService.sendResponse({
        voice_command_result: {
          command_text: `RECORD_${type.toUpperCase()}`,
          mapped_action: `khata_${type}`,
          entity_name: party.name,
          amount_pkr: amount.toString(),
          confidence_ok: true,
          timestamp: Date.now()
        }
      });
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  private static async handleHubCommand(command: string) {
    const mappedCmd = command.toUpperCase().replace(/\s+/g, '_');
    
    tcpService.sendMessage({
      t: 'UI_COMMAND',
      cmd: mappedCmd,
      ts: Date.now()
    });

    // Send result via NSP
    const { NspService } = require('../../services/NspService');
    await NspService.sendResponse({
      voice_command_result: {
        command_text: mappedCmd,
        mapped_action: 'hub_control',
        confidence_ok: true,
        timestamp: Date.now()
      }
    });

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
}
