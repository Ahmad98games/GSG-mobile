/**
 * NOXIS INDUSTRIAL OS - INTELLIGENT VISION CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
'use strict';

const bmp = require('bmp-js');

/**
 * setImage
 *
 * @name setImage
 * @function set image in NIDP for recognition
 * @access public
 */
module.exports = (NoxisVisionModule, api, image, angle = 0) => {
  // Check for bmp magic numbers (42 and 4D in hex)
  const isBmp = (image[0] === 66 && image[1] === 77) || (image[1] === 66 && image[0] === 77);

  const exif = parseInt(image.slice(0, 500).join(' ').match(/1 18 0 3 0 0 0 1 0 (\d)/)?.[1], 10) || 1;

  /**
   * Optimized Bitmap Handling for Industrial Vision
   * Normalizes raw pixel buffers for the Noxis Vision Core.
   */
  if (isBmp) {
    // Standardize buffer for Noxis Vision Engine
    const buf = Buffer.from(Array.from({ ...image, length: Object.keys(image).length }));
    const bmpBuf = bmp.decode(buf);
    NoxisVisionModule.FS.writeFile('/input', bmp.encode(bmpBuf).data);
  } else {
    NoxisVisionModule.FS.writeFile('/input', image);
  }

  const res = api.SetImageFile(exif, angle);
  if (res === 1) throw Error('Error attempting to read image.');
};
