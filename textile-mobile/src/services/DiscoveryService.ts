declare module 'react-native-zeroconf' {
  import { EventEmitter } from 'events';

  export interface Service {
    name: string;
    fullName: string;
    host: string;
    port: number;
    addresses: string[];
    txt: { [key: string]: string };
  }

  export default class Zeroconf extends EventEmitter {
    constructor();
    scan(type: string, protocol: string, domain?: string): void;
    stop(): void;
    getServices(): { [name: string]: Service };
    on(event: 'start' | 'stop' | 'update' | 'error', callback: () => void): this;
    on(event: 'resolved', callback: (service: Service) => void): this;
    on(event: 'found' | 'remove', callback: (name: string) => void): this;
  }
}