/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/*
 * OEM = OCR Engine Mode, and there are 4 possible modes.
 *
 * By default NIDP.js uses LSTM_ONLY mode.
 *
 */
module.exports = {
  NIDP_ONLY: 0,
  LSTM_ONLY: 1,
  NIDP_LSTM_COMBINED: 2,
  DEFAULT: 3,
};

