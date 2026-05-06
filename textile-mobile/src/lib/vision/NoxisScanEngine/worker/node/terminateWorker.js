/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

/**
 * terminateWorker
 *
 * @name terminateWorker
 * @function kill worker
 * @access public
 */
module.exports = (worker) => {
  worker.terminate();
};

