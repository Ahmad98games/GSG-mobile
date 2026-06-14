import EventEmitter from 'eventemitter3';

/**
 * NOXIS MESH EVENT BUS
 * Central nervous system for cross-module industrial synchronization.
 */

export enum MeshEvent {
  SENTINEL_BREACH = 'SENTINEL_BREACH',
  SYSTEM_LOCK = 'SYSTEM_LOCK',
  KHATA_ENTRY_RECORDED = 'KHATA_ENTRY_RECORDED',
  LOCATION_UPDATE = 'LOCATION_UPDATE',
  HUB_STATUS_CHANGE = 'HUB_STATUS_CHANGE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
  HEARTBEAT_ALERT = 'HEARTBEAT_ALERT',
  TACTICAL_MESSAGE = 'TACTICAL_MESSAGE',
  CASHFLOW_UPDATE = 'CASHFLOW_UPDATE',
  ANALYTICS_UPDATE = 'ANALYTICS_UPDATE',
  LEADERBOARD_UPDATE = 'LEADERBOARD_UPDATE',
  SHIFT_HANDOVER_ACK = 'SHIFT_HANDOVER_ACK',
  DEAD_STOCK_ALERT = 'DEAD_STOCK_ALERT',
  AUDIT_REMINDER = 'AUDIT_REMINDER',
  STAFF_ACTION = 'STAFF_ACTION',
}

class MeshEventBus extends EventEmitter {
  /**
   * Emits an event locally and prepares it for Mesh transmission.
   */
  public broadcast(event: MeshEvent, payload: any) {
    this.emit(event, payload);
    console.log(`[MESH_BUS] BROADCAST: ${event}`, payload);
  }

  public subscribe(event: MeshEvent, listener: (...args: any[]) => void) {
    this.on(event, listener);
    return () => { this.off(event, listener); };
  }
}

export const meshBus = new MeshEventBus();
