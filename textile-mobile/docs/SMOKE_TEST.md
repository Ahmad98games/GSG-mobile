# OMNORA MOBILE NODE — INTEGRATION SMOKE TEST

This document outlines the physical verification steps for ensuring the Mobile Node and Hub are synchronized correctly.

## Prerequisites

- Android Device (Zebra/Honeywell or Standard) on same WiFi as Hub.
- Hub laptop running `textile-erp-v7` Hub Service.
- Sentry project active.

---

### 1. Fresh Install & Pairing

- **Action**: Wipe app data or fresh install. Scan Hub QR code.
- **Expected**:
  - Border glows **GREEN**.
  - Dashboard loads.
  - JWT is stored in `SecureStore` (verify via logs).
  - Node ID exists in `AsyncStorage`.
- **Failure**: Red glow, stuck on "Bonding", or "MALFORMED_TOKEN" error.

### 2. Tier 1 SOS Event

- **Action**: Trigger SOS (Hidden long-press or button).
- **Expected**:
  - Verification: Check Hub Dashboard for immediate entry.
  - Latency: < 1 second.
- **Failure**: Item appears in "Pending" queue on mobile but doesn't reach Hub.

### 3. Tier 2 Batch Scans

- **Action**: Perform 5 rapid scans.
- **Expected**:
  - Scans are batched.
  - Verification: Hub shows all 5 items arriving as a single transaction (or rapid sequence) after ~3 seconds.
- **Failure**: Items arrive one-by-one with 3s gaps (wrong interval) or don't arrive.

### 4. Tier 3 Telemetry

- **Action**: Leave app open for 60 seconds.
- **Expected**:
  - Check Hub logs for `TelemetryEvent` or `HeartbeatEvent`.
  - Verification: Battery level and signal strength updated.
- **Failure**: No heartbeat updates after 2 minutes.

### 5. Network Jitter & Offline Queue

- **Action**: Disable WiFi. Perform 10 scans.
- **Expected**:
  - Border shows "OFFLINE" status.
  - Stats still increment locally.
  - Verification: Open Diagnostics (Triple-tap) -> SQLite Depth shows 10.
- **Failure**: Lower depth or data lost.

### 6. Restore & Sync

- **Action**: Re-enable WiFi.
- **Expected**:
  - App reconnects.
  - Re-handshake occurs.
  - **Cold Boot Drain**: All 10 items arrive on Hub dashboard automatically.
- **Failure**: Connection restored but queue doesn't drain.

### 7. Persistent Recovery (Cold Boot)

- **Action**: While offline with 10 items in queue, Force-Kill the app. Relaunch.
- **Expected**:
  - `RootLayout` triggers `drainPersistedQueue`.
  - Items move to memory tiers.
  - Once WiFi restored, items send.
- **Failure**: Items deleted from SQLite but never reached Hub.

### 8. Diagnostics HUD

- **Action**: Triple-tap version number in footer.
- **Expected**:
  - Biometric prompt appears.
  - Metrics show non-zero `ENC_LATENCY_AVG` and `PROTO_PACKET_AVG`.
- **Failure**: Metrics show 0 or "NaN".

### 9. Thermal Throttling

- **Action**: Mock battery temperature to 46°C (or run heavy load).
- **Expected**:
  - Red banner: "DEVICE OVERHEATING - PERFORMANCE THROTTLED".
  - Telemetry frequency shifts to 120s.
- **Failure**: No warning banner above 45°C.

### 10. Forensic Sentry Capture

- **Action**: Trigger a test crash from Diagnostics screen (if implemented) or manually throw.
- **Expected**:
  - Error Log appears in Sentry with Node ID and OS context.
- **Failure**: Sentry dashboard remains empty.
