import { Alert } from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

/**
 * ══════════════════════════════════════════════════════════════
 * SOVEREIGN PRINTER SERVICE (v4.0 — BARE CLIENT / TCP NETWORK)
 * ══════════════════════════════════════════════════════════════
 *
 * Single-shot TCP/IP connection to an ESC/POS network printer.
 * Each print job opens → sends → drains → destroys the socket.
 * No persistent connections — factory-grade reliability.
 */

// ─── Configuration ─────────────────────────────────────────────
const PRINTER_IP   = '192.168.1.100';
const PRINTER_PORT = 9100;
const TIMEOUT_MS   = 5_000; // strict 5-second constraint

// ─── Core send function ────────────────────────────────────────

/**
 * Opens a TCP socket, sends the raw ESC/POS buffer, waits for
 * the kernel write buffer to drain, then immediately destroys
 * the socket.  Rejects on any error or if the 5 s wall-clock
 * timeout fires first.
 */
export async function sendToNetworkPrinter(buffer: Buffer): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    let settled = false;

    // ── Wall-clock timeout — the hard 5 s limit ──────────────
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { socket.destroy(); } catch { /* ignore */ }
      reject(new Error(`PRINTER_TIMEOUT: No response from ${PRINTER_IP}:${PRINTER_PORT} within ${TIMEOUT_MS}ms`));
    }, TIMEOUT_MS);

    // ── Open TCP connection ──────────────────────────────────
    const socket = TcpSocket.createConnection(
      { port: PRINTER_PORT, host: PRINTER_IP },
      () => {
        // Connection established — send the buffer immediately
        socket.write(buffer, 'utf8', () => {
          // write() callback fires when data is flushed to the
          // kernel buffer.  For ESC/POS printers this is "done".
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          socket.destroy();
          resolve();
        });
      }
    );

    socket.on('error', (err: Error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try { socket.destroy(); } catch { /* ignore */ }
      reject(new Error(`PRINTER_TCP_ERROR: ${err.message}`));
    });

    socket.on('close', () => {
      // If close fires before we've settled, treat it as a failure
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error('PRINTER_CLOSED: Socket closed before data was sent'));
    });
  });
}

// ─── Queue wrapper (optional convenience layer) ────────────────

class PrinterService {
  private printQueue: Buffer[] = [];
  private isPrinting = false;

  /**
   * Enqueue a raw ESC/POS buffer for printing.  The queue
   * processes jobs sequentially so labels don't interleave.
   */
  async enqueue(buffer: Buffer, label: string): Promise<void> {
    this.printQueue.push(buffer);
    console.log(`[Printer] QUEUED: ${label}`);
    this.processQueue();
  }

  private async processQueue(): Promise<void> {
    if (this.isPrinting || this.printQueue.length === 0) return;
    this.isPrinting = true;

    while (this.printQueue.length > 0) {
      const buf = this.printQueue[0];
      try {
        await sendToNetworkPrinter(buf);
        console.log('[Printer] TRANSMITTED');
        this.printQueue.shift();           // remove only on success
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error('[Printer] FAILED:', msg);
        Alert.alert(
          'PRINTER OFFLINE',
          `Could not reach ${PRINTER_IP}. Label remains in queue.\n\n${msg}`
        );
        break; // stop processing — retry on next call
      }
    }

    this.isPrinting = false;
  }

  // ─── Convenience helpers (build ESC/POS buffers inline) ────

  /**
   * Print an industrial Batch Sticker
   */
  async printBatchSticker(batch: { code: string; articleName: string; suits: number }): Promise<void> {
    const commands = [
      '\x1B\x40',             // ESC @ — Initialize
      '\x1B\x61\x01',         // Center align
      '\x1D\x21\x11',         // Double width + height
      `BATCH: ${batch.code}\n`,
      '\x1D\x21\x00',         // Normal size
      `${batch.articleName}\n`,
      `COUNT: ${batch.suits} SETS\n`,
      '\x1D\x6B\x04\x42\x0C', // QR command stub
      `${batch.code}\n`,
      '\n\n\n\n',              // Feed + cut zone
    ].join('');

    await this.enqueue(Buffer.from(commands, 'binary'), `Batch ${batch.code}`);
  }

  /**
   * Print a Khata Receipt
   */
  async printKhataReceipt(party: string, amount: number, type: 'CR' | 'DR'): Promise<void> {
    const commands = [
      '\x1B\x40',
      '\x1B\x61\x01',
      'GOLD SHE INDUSTRIAL\n',
      'KHATA RECEIPT\n',
      '\x1B\x61\x00',
      '--------------------------------\n',
      `PARTY: ${party}\n`,
      `AMOUNT: Rs. ${amount.toLocaleString()}\n`,
      `TYPE: ${type === 'CR' ? 'CREDIT' : 'DEBIT'}\n`,
      `DATE: ${new Date().toLocaleString()}\n`,
      '--------------------------------\n',
      '\x1B\x61\x01',
      'Thank you for your business.\n',
      '\n\n',
    ].join('');

    await this.enqueue(Buffer.from(commands, 'binary'), `Receipt ${party}`);
  }
}

export const Printer = new PrinterService();
