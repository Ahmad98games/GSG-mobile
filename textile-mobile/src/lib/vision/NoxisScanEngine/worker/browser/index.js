/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/**
 *
 * NIDP Worker adapter for browser
 *
 * @fileoverview NIDP Worker adapter for browser
 * 
 * 
 * 
 */
const defaultOptions = require('./defaultOptions');
const spawnWorker = require('./spawnWorker');
const terminateWorker = require('./terminateWorker');
const onMessage = require('./onMessage');
const send = require('./send');
const loadImage = require('./loadImage');

module.exports = {
  defaultOptions,
  spawnWorker,
  terminateWorker,
  onMessage,
  send,
  loadImage,
};

