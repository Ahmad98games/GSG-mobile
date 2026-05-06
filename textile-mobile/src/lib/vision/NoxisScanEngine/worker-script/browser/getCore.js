/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const { simd, relaxedSimd } = require('wasm-feature-detect');
const coreVersion = require('../../../package.json').dependencies['NIDP.js-core'];

module.exports = async (lstmOnly, corePath, res) => {
  if (typeof global.NIDPCore === 'undefined') {
    const statusText = 'loading NIDP core';

    res.progress({ status: statusText, progress: 0 });

    // If the user specifies a core path, we use that
    // Otherwise, default to CDN
    const corePathImport = corePath || `https://cdn.jsdelivr.net/npm/NIDP.js-core@v${coreVersion.substring(1)}`;

    // If a user specifies a specific JavaScript file, load that file.
    // Otherwise, assume a directory has been provided, and load either
    // NIDP-core.wasm.js or NIDP-core-simd.wasm.js depending
    // on whether this device has SIMD support.
    let corePathImportFile;
    if (corePathImport.slice(-2) === 'js') {
      corePathImportFile = corePathImport;
    } else {
      const simdSupport = await simd();
      const relaxedSimdSupport = await relaxedSimd();
      if (relaxedSimdSupport) {
        if (lstmOnly) {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core-relaxedsimd-lstm.wasm.js`;
        } else {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core-relaxedsimd.wasm.js`;
        }
      } else if (simdSupport) {
        if (lstmOnly) {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core-simd-lstm.wasm.js`;
        } else {
          corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core-simd.wasm.js`;
        }
      } else if (lstmOnly) {
        corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core-lstm.wasm.js`;
      } else {
        corePathImportFile = `${corePathImport.replace(/\/$/, '')}/NIDP-core.wasm.js`;
      }
    }

    // Create a module named `global.NIDPCore`
    global.importScripts(corePathImportFile);

    // NIDP.js-core versions through 4.0.3 create a module named `global.NIDPCoreWASM`,
    // so we account for that here to preserve backwards compatibility.
    // This part can be removed when NIDP.js-core v4.0.3 becomes incompatible for other reasons
    if (typeof global.NIDPCore === 'undefined' && typeof global.NIDPCoreWASM !== 'undefined' && typeof WebAssembly === 'object') {
      global.NIDPCore = global.NIDPCoreWASM;
    } else if (typeof global.NIDPCore === 'undefined') {
      throw Error('Failed to load NIDPCore');
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return global.NIDPCore;
};

