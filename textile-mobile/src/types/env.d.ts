declare module 'engine.io-client' {
  export function parse(uri: string): any;
  export const Fetch: any;
  export const NodeXHR: any;
  export const XHR: any;
  export const NodeWebSocket: any;
  export const WebSocket: any;
  export const WebTransport: any;
}

declare module 'debug' {
  const debug: any;
  export default debug;
}

declare module 'socket.io-parser' {
  export const protocol: number;
  export class Decoder {
    add(obj: any): void;
    on(event: string, callback: (packet: any) => void): void;
    destroy(): void;
  }
  export class Encoder {
    encode(packet: any): any[];
  }
  export interface Packet {
    type: number;
    nsp: string;
    data?: any;
    id?: number;
  }
  export enum PacketType {
    CONNECT = 0,
    DISCONNECT = 1,
    EVENT = 2,
    ACK = 3,
    CONNECT_ERROR = 4,
    BINARY_EVENT = 5,
    BINARY_ACK = 6,
  }
}

declare module '@socket.io/component-emitter' {
  export class Emitter {
    on(event: string, fn: Function): Emitter;
    once(event: string, fn: Function): Emitter;
    off(event: string, fn?: Function): Emitter;
    emit(event: string, ...args: any[]): Emitter;
    listeners(event: string): Function[];
    hasListeners(event: string): boolean;
  }
}
declare module 'd3-scale' {
  export const scaleLinear: any;
  export type ScaleLinear<T = any, U = any> = any;
  export const scaleTime: any;
  export const scaleLog: any;
  export type ScaleLogarithmic<T = any, U = any> = any;
  export const scaleBand: any;
  export const scaleOrdinal: any;
  export const scalePoint: any;
  export const scaleThreshold: any;
  export const scaleQuantize: any;
  export const scaleQuantile: any;
  export const scaleIdentity: any;
  export const scaleSequential: any;
}

declare module 'd3-shape' {
  export const curveBasis: any;
  export const curveLinear: any;
  export const curveStep: any;
  export const area: any;
  export const line: any;
}

declare module 'd3-zoom' {
  export const zoom: any;
  export const zoomIdentity: any;
  export type ZoomTransform = any;
}

declare module 'its-fine' {
  export const useFiber: any;
  export const FiberProvider: any;
  export const ContextBridge: any;
  export type ContextBridge = any;
  export const useContextBridge: any;
}

declare module 'expo-location' {
  export const requestForegroundPermissionsAsync: any;
  export const watchPositionAsync: any;
  export const Accuracy: any;
  export type LocationSubscription = { remove: () => void };
  export type LocationObject = { coords: { latitude: number; longitude: number; speed: number | null }; timestamp: number };
}

declare module 'expo-sensors' {
  export const Accelerometer: any;
}
