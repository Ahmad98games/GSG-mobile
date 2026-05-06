import Zeroconf from 'react-native-zeroconf';
import EventEmitter from 'eventemitter3';
import { tcpService } from './TCPClientService';
import { meshBus, MeshEvent } from './MeshEventBus';

/**
 * NOXIS DISCOVERY SERVICE
 * Hardened mDNS/ZeroConf scanner with manual verification.
 */
export class NoxisDiscoveryService extends EventEmitter {
  private zeroconf = new Zeroconf();
  private isScanning = false;
  private scanTimer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.zeroconf.on('resolved', (service) => {
      if (service.name.includes('noxis-hub') || service.txt?.noxis === 'true') {
        const hub = {
          name: service.name,
          ip: service.addresses[0],
          port: service.port || 7447
        };
        
        console.log(`[DISCOVERY] HUB_FOUND: ${hub.ip}:${hub.port}`);
        this.emit('hubFound', hub);
        
        meshBus.broadcast('HUB_DISCOVERED' as MeshEvent, hub);
        this.stopScan();
      }
    });

    this.zeroconf.on('error', () => {
      console.error('[DISCOVERY_FAULT] mDNS lookup failed.');
      this.stopScan();
    });
  }

  public startScan() {
    if (this.isScanning) return;
    this.isScanning = true;
    this.emit('scanStateChange', true);

    console.log('[DISCOVERY] SCAN_START: Seeking Noxis Neural Hub...');

    this.scanTimer = setTimeout(() => {
      if (this.isScanning) {
        console.warn('[DISCOVERY] TIMEOUT: No Hub found via mDNS.');
        this.stopScan();
        meshBus.broadcast('DISCOVERY_TIMEOUT' as MeshEvent, {});
      }
    }, 10000);

    this.zeroconf.scan('noxis-hub', 'tcp', 'local.');
  }

  public stopScan() {
    if (this.scanTimer) clearTimeout(this.scanTimer);
    this.zeroconf.stop();
    this.isScanning = false;
    this.emit('scanStateChange', false);
    console.log('[DISCOVERY] SCAN_STOPPED');
  }

  public async confirmConnection(host: string, port: number) {
     console.log(`[DISCOVERY] USER_CONFIRMED: Connecting to ${host}:${port}`);
     await tcpService.connect(host, port);
  }
}

export const discoveryService = new NoxisDiscoveryService();
