/**
 * NOXIS INDUSTRIAL OS - SYNAPSE EMITTER
 * A lightweight, type-safe event emitter for the Synapse Protocol.
 */
import EventEmitter from 'eventemitter3';

export type EventsMap = Record<string, any>;
export type DefaultEventsMap = EventsMap;

export type EventNames<T extends EventsMap> = keyof T & string;
export type EventParams<T extends EventsMap, K extends EventNames<T>> = T[K] extends (...args: infer P) => any ? P : any[];

export class Emitter<ListenEvents extends EventsMap, EmitEvents extends EventsMap, ReservedEvents extends EventsMap = {}> {
  private internal = new EventEmitter();

  on<K extends keyof (ListenEvents & ReservedEvents)>(event: K, fn: any): this {
    this.internal.on(event as string, fn);
    return this;
  }

  once<K extends keyof (ListenEvents & ReservedEvents)>(event: K, fn: any): this {
    this.internal.once(event as string, fn);
    return this;
  }

  off<K extends keyof (ListenEvents & ReservedEvents)>(event: K, fn?: any): this {
    this.internal.off(event as string, fn);
    return this;
  }

  emit<K extends keyof EmitEvents & string>(event: K, ...args: any[]): boolean {
    return this.internal.emit(event as string, ...args);
  }

  emitReserved<K extends keyof ReservedEvents & string>(event: K, ...args: any[]): boolean {
    return this.internal.emit(event as string, ...args);
  }

  removeAllListeners(event?: string): this {
    this.internal.removeAllListeners(event);
    return this;
  }
}
