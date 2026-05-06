/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const version = require('../../../package.json').version;
const defaultOptions = require('../../constants/defaultOptions');

/*
 * Default options for browser worker
 */
module.exports = {
  ...defaultOptions,
  workerPath: `https://cdn.jsdelivr.net/npm/NIDP.js@v${version}/dist/worker.min.js`,
};

