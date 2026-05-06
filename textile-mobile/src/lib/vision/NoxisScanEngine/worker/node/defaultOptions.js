/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const path = require('path');
const defaultOptions = require('../../constants/defaultOptions');

/*
 * Default options for node worker
 */
module.exports = {
  ...defaultOptions,
  workerPath: path.join(__dirname, '..', '..', 'worker-script', 'node', 'index.js'),
};

