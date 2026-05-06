import EventEmitter from 'eventemitter3';
import { tcpService } from '../../services/TCPClientService';

/**
 * MESH TCP CLIENT BRIDGE
 * Adapts the production TCPClientService to the API expected by pairing screens.
 */
class MeshTCPClient extends EventEmitter {
  constructor() {
    super();
    // Forward events from the core service
    tcpService.on('connectionChange', (isConnected: boolean) => {
      this.emit('state-change', isConnected ? 'CONNECTED' : 'DISCONNECTED');
    });

    tcpService.on('hub_unreachable', () => {
      this.emit('state-change', 'DISCONNECTED');
    });

    tcpService.on('profileChange', (profile: any) => {
      this.emit('config-downloaded', profile);
    });
  }

  public connect(ip: string, port: number, code?: string) {
    // In a real pairing flow, the code would be used for ECDH.
    // For now, we delegate to the existing connect logic.
    tcpService.connect(ip, port);
  }

  public disconnect() {
    // Core service handles its own disconnect/reconnect logic
  }
}

export const meshTCPClient = new MeshTCPClient();
