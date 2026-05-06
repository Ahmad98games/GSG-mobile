/**
 * NOXIS INDUSTRIAL OS - SYNAPSE PROTOCOL PARSER
 * Hardened encoder/decoder for proprietary event serialization.
 */
import { Packet, PacketType } from "./SynapseTypes";
import EventEmitter from 'eventemitter3';

export class Encoder {
  public encode(packet: Packet): string[] {
    return [JSON.stringify(packet)];
  }
}

export class Decoder extends EventEmitter {
  public add(data: any): void {
    try {
      const packet = JSON.parse(data);
      this.emit('decoded', packet);
    } catch (e) {
      console.error('[SYNAPSE:PARSER] Parse error:', e);
    }
  }

  public destroy(): void {}
}
