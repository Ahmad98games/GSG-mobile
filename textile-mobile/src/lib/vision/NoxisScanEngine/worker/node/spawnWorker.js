/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const { Worker } = require('worker_threads');

/**
 * spawnWorker
 *
 * @name spawnWorker
 * @function fork a new process in node
 * @access public
 */
module.exports = ({ workerPath }) => new Worker(workerPath);

