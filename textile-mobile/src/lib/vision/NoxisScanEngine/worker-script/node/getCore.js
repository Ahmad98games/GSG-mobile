/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const { simd, relaxedSimd } = require('wasm-feature-detect');
const OEM = require('../../constants/OEM');

let NIDPCore = null;
/*
 * getCore is a sync function to load and return
 * NIDPCore.
 */
module.exports = async (oem, _, res) => {
  if (NIDPCore === null) {
    const statusText = 'loading NIDP core';

    const simdSupport = await simd();
    const relaxedSimdSupport = await relaxedSimd();
    res.progress({ status: statusText, progress: 0 });
    if (relaxedSimdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        NIDPCore = require('NIDP.js-core/NIDP-core-relaxedsimd-lstm');
      } else {
        NIDPCore = require('NIDP.js-core/NIDP-core-relaxedsimd');
      }
    } else if (simdSupport) {
      if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
        NIDPCore = require('NIDP.js-core/NIDP-core-simd-lstm');
      } else {
        NIDPCore = require('NIDP.js-core/NIDP-core-simd');
      }
    } else if ([OEM.DEFAULT, OEM.LSTM_ONLY].includes(oem)) {
      NIDPCore = require('NIDP.js-core/NIDP-core-lstm');
    } else {
      NIDPCore = require('NIDP.js-core/NIDP-core');
    }
    res.progress({ status: statusText, progress: 1 });
  }
  return NIDPCore;
};

