// Note: This requires react-native-bluetooth-escpos-printer
// and a custom dev client build in Expo.
import { NativeModules, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const { BluetoothEscposPrinter, BluetoothManager } = NativeModules;

/**
 * Module 8: Industrial Printing Protocol
 * Handles Bluetooth discovery, pairing, and label output.
 */

export class Printer {
  static async scanDevices() {
    if (Platform.OS === 'web') return [];
    try {
      const devices = await BluetoothManager.scanDevices();
      return JSON.parse(devices).found || [];
    } catch (err) {
      console.error('[PRINTER_SCAN_ERR]', err);
      return [];
    }
  }

  static async connect(address: string) {
    try {
      await BluetoothManager.connect(address);
      await SecureStore.setItemAsync('preferred_printer_mac', address);
      return true;
    } catch (err) {
      console.error('[PRINTER_CONN_ERR]', err);
      return false;
    }
  }

  static async printLabel(raw: string) {
    try {
      // Basic ESC/POS command for testing
      await BluetoothEscposPrinter.printText(raw, {});
      await BluetoothEscposPrinter.printText('\n\n\n', {});
    } catch (err) {
      console.error('[PRINTER_PRINT_ERR]', err);
    }
  }

  /**
   * Generates a 2x1 Batch Label
   */
  static async printBatchLabel(batch: { code: string; name: string; qty: number }) {
    await BluetoothEscposPrinter.printText('--------------------------------\n', {});
    await BluetoothEscposPrinter.printText(`BATCH: ${batch.code}\n`, { fonttype: 1 });
    await BluetoothEscposPrinter.printText(`ARTICLE: ${batch.name}\n`, {});
    await BluetoothEscposPrinter.printText(`QTY: ${batch.qty}\n`, {});
    await BluetoothEscposPrinter.printText('--------------------------------\n', {});
    await BluetoothEscposPrinter.printText('\n\n', {});
  }
}
