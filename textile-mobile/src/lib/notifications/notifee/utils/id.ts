/**
 * NOXIS INDUSTRIAL OS - SENTINEL INTELLIGENCE CORE
 * (c) 2026 Gold She Industrial ERP. All rights reserved.
 * PROPRIETARY AND CONFIDENTIAL.
 */
/*
 * Copyright (c) 2016-present Invertase Limited
 */

const CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

export function generateId(): string {
  let newId = '';
  for (let i = 0; i < 20; i++) {
    newId += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return newId;
}

