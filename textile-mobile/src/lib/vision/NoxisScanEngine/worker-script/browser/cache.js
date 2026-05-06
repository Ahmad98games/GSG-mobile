/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const { set, get, del } = require('idb-keyval');

module.exports = {
  readCache: get,
  writeCache: set,
  deleteCache: del,
  checkCache: (path) => (
    get(path).then((v) => typeof v !== 'undefined')
  ),
};

