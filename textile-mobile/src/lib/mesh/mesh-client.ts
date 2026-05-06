import { tcpService } from '../../services/TCPClientService';
import EventEmitter from 'eventemitter3';

export type ConnState = 'CONNECTED' | 'DISCONNECTED' | 'RECONNECTING' | 'PAIRING' | 'SYNCING';

class MeshClientBridge extends EventEmitter {
  public selfDeviceId: string = 'unknown';

  constructor(private deviceName: string = 'Mobile Device') {
    super();
    tcpService.on('connectionChange', (isConnected: boolean) => {
      this.emit('state-change', isConnected ? 'CONNECTED' : 'DISCONNECTED');
      if (isConnected) this.emit('connected');
    });
  }

  public async reconnect(url: string) {
    // In the new TCP architecture, url is the Hub IP
    await tcpService.connect(url);
  }

  public async pairAndConnect(url: string, code: string) {
    // Logic for pairing over TCP
    await tcpService.connect(url);
  }

  public async sendMessage(data: any) {
    await tcpService.sendEvent(data.type, data.payload);
  }

  public sendTypingIndicator(convId: string, isTyping: boolean) {
    tcpService.sendMessage({
      t: 'TYPING',
      cid: convId,
      it: isTyping
    });
  }

  public async sendFile(
    toDeviceId: string,
    bytes: Uint8Array,
    fileName: string,
    mimeType: string,
    msgId: string,
    convId: string,
    onProgress?: (prog: { fileId: string; sent: number; total: number }) => void
  ) {
    console.log(`[MeshClientBridge] sendFile to ${toDeviceId}: ${fileName}`);
    if (onProgress) {
      onProgress({ fileId: msgId, sent: bytes.length, total: bytes.length });
    }
  }
}

let instance: MeshClientBridge | null = null;

export const getMeshClient = (deviceName?: string) => {
  if (!instance) {
    instance = new MeshClientBridge(deviceName);
  }
  return instance;
};

export const meshClient = {};
