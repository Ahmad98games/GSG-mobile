/**
 * NOXIS INDUSTRIAL OS - SYNAPSE PROTOCOL (NSP)
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
import { Emitter } from "./SynapseEmitter";

export function on(
  obj: Emitter<any, any>,
  ev: string,
  fn: (err?: any) => any,
): VoidFunction {
  obj.on(ev, fn);
  return function subDestroy(): void {
    obj.off(ev, fn);
  };
}

