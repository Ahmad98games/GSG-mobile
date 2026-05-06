/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/**
 *
 * Browser worker scripts
 *
 * @fileoverview Browser worker implementation
 * 
 * 
 * 
 */

const worker = require('..');
const getCore = require('./getCore');
const gunzip = require('./gunzip');
const cache = require('./cache');

/*
 * register message handler
 */
global.addEventListener('message', ({ data }) => {
  worker.dispatchHandlers(data, (obj) => postMessage(obj));
});

/*
 * getCore is a sync function to load and return
 * NIDPCore.
 */
worker.setAdapter({
  getCore,
  gunzip,
  fetch: () => {},
  ...cache,
});

