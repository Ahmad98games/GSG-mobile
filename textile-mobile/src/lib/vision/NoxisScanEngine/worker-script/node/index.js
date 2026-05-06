/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/**
 *
 * NIDP Worker Script for Node
 *
 * @fileoverview Node worker implementation
 * 
 * 
 * 
 */
// Use built-in fetch if available, otherwise fallback to node-fetch
const fetch = global.fetch || require('node-fetch');
const { parentPort } = require('worker_threads');
const worker = require('..');
const getCore = require('./getCore');
const gunzip = require('./gunzip');
const cache = require('./cache');

/*
 * register message handler
 */
parentPort.on('message', (packet) => {
  worker.dispatchHandlers(packet, (obj) => parentPort.postMessage(obj));
});

worker.setAdapter({
  getCore,
  gunzip,
  fetch,
  ...cache,
});

