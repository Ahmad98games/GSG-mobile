import protobuf from 'protobufjs';
import { useDiagnosticStore } from '../store/DiagnosticsStore';

/**
 * SHARED SCHEMA JSON
 * Mirrored from shared.proto for runtime stability.
 */
const schemaJson = {
  nested: {
    omnora: {
      nested: {
        Packet: {
          oneofs: { event: { oneof: ["scan", "heartbeat", "sos", "error", "telemetry", "khata", "stock", "message", "ack", "handshake", "nsp"] } },
          fields: {
            packetId: { type: "string", id: 1 },
            nodeId: { type: "string", id: 2 },
            timestamp: { type: "int64", id: 3 },
            scan: { type: "ScanEvent", id: 4 },
            heartbeat: { type: "HeartbeatEvent", id: 5 },
            sos: { type: "SOSEvent", id: 6 },
            error: { type: "ErrorEvent", id: 7 },
            telemetry: { type: "TelemetryEvent", id: 8 },
            khata: { type: "KhataEntry", id: 9 },
            stock: { type: "StockDelta", id: 10 },
            message: { type: "TacticalMessage", id: 11 },
            ack: { type: "HubAck", id: 12 },
            handshake: { type: "HandshakeEvent", id: 13 },
            nsp: { type: "NspEnvelope", id: 16 }
          }
        },
        ScanEvent: {
          fields: {
            nodeId: { type: "string", id: 1 },
            workerId: { type: "string", id: 2 },
            barcode: { type: "string", id: 3 },
            timestamp: { type: "int64", id: 4 },
            batchId: { type: "string", id: 5 }
          }
        },
        NspEnvelope: {
          oneofs: { payload: { oneof: ["stock_lookup_req", "stock_lookup_res", "scan_event"] } },
          fields: {
            stock_lookup_req: { type: "StockLookupRequest", id: 7 },
            stock_lookup_res: { type: "StockLookupResponse", id: 8 },
            scan_event: { type: "ScanEvent", id: 11 },
            requestId: { type: "string", id: 100 } // Custom requestId for matching
          }
        },
        StockLookupRequest: {
          fields: {
            barcode: { type: "string", id: 1 },
            node_id: { type: "string", id: 2 }
          }
        },
        StockLookupResponse: {
          fields: {
            sku_id: { type: "string", id: 1 },
            sku_code: { type: "string", id: 2 },
            name: { type: "string", id: 3 },
            qty_on_hand: { type: "string", id: 4 },
            unit: { type: "string", id: 5 },
            cost_price: { type: "string", id: 6 },
            sale_price: { type: "string", id: 7 },
            location: { type: "string", id: 8 }
          }
        },
        HandshakeEvent: {
          fields: {
            nodeId: { type: "string", id: 1 },
            token: { type: "string", id: 2 },
            timestamp: { type: "int64", id: 3 },
            type: { type: "string", id: 4 }
          }
        },
        HubAck: {
          fields: {
            packetId: { type: "string", id: 1 },
            status: { type: "string", id: 2 },
            syncOffsetMs: { type: "int32", id: 3 },
            timestamp: { type: "int64", id: 4 },
            active_branch_id: { type: "string", id: 8 }
          }
        }
      }
    }
  }
};

const root = protobuf.Root.fromJSON(schemaJson);
const Packet = root.lookupType("omnora.Packet");

/**
 * PRODUCTION PROTOBUF SERVICE
 * Centralized binary serialization with forensic size tracking.
 */
export const ProtobufService = {
  /**
   * Encodes an event into a unified Packet.
   */
  encode(nodeId: string, eventType: string, eventData: any): Uint8Array {
    const message = Packet.create({
      packetId: Math.random().toString(36).substring(7),
      nodeId,
      timestamp: Date.now(),
      [eventType]: eventData
    });
    const buffer = Packet.encode(message).finish();
    
    // Log packet size for diagnostics
    useDiagnosticStore.getState().addPacketSize(buffer.length);
    
    return buffer;
  },

  decode(buffer: Uint8Array): any {
    return Packet.decode(buffer);
  }
};
