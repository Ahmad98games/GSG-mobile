/**
 * DENO AMBIENT TYPES SHIM
 * This file provides type definitions for Deno globals when working in a 
 * non-Deno environment (like a React Native project being analyzed by VS Code).
 */

declare namespace Deno {
  export interface Env {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    delete(key: string): void;
    toObject(): { [key: string]: string };
  }

  export const env: Env;

  export interface DirOptions {
    recursive?: boolean;
    mode?: number;
  }

  export function mkdir(path: string | URL, options?: DirOptions): Promise<void>;
  export function readTextFile(path: string | URL): Promise<string>;
  export function writeTextFile(path: string | URL, data: string): Promise<void>;
}

// Support for URL imports in standard TypeScript (limited)
declare module "https://*" {
  const content: any;
  export default content;
}
