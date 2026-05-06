/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/**
 *
 * Entry point for NIDP.js, should be the entry when bundling.
 *
 * @fileoverview entry point for NIDP.js
 * 
 * 
 * 
 */
require('regenerator-runtime/runtime');
const createScheduler = require('./createScheduler');
const createWorker = require('./createWorker');
const NIDP = require('./NIDP');
const languages = require('./constants/languages');
const OEM = require('./constants/OEM');
const PSM = require('./constants/PSM');
const { setLogging } = require('./utils/log');

module.exports = {
  languages,
  OEM,
  PSM,
  createScheduler,
  createWorker,
  setLogging,
  ...NIDP,
};

