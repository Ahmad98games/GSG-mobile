# OMNORA INDUSTRIAL PRIME V13.0 - MOBILE PRE-DEPLOYMENT CHECKLIST
(c) 2026 Gold She Industrial ERP - Tactical Mobile Division

## GROUP 1 — Initial Pairing
- [x] 1.1 Hub displays QR code on pairing screen
- [x] 1.2 Mobile scans QR, extracts IP:port correctly
- [x] 1.3 mDNS fallback works when QR scan fails
- [x] 1.4 Pairing completes, BridgeStatus shows 'online'
- [x] 1.5 Session resumes after mobile app restart (persisted config)

## GROUP 2 — Mesh Messenger
- [x] 2.1 Text message sent from Mobile to Hub
- [x] 2.2 Text message received from Hub to Mobile
- [x] 2.3 Character limit enforced according to Tier (Lite: 500, Pro: 1k, Elite: 2k)
- [x] 2.4 Delivery checkmarks update correctly
- [x] 2.5 Offline messages queued in SQLite and drained on reconnect

## GROUP 3 — Security & CCTV
- [x] 3.1 Live status (Online/Offline) accurate for all cameras
- [x] 3.2 Sentinel Breach alert triggers full-screen critical overlay
- [x] 3.3 Breach alert can only be dismissed after industrial ACK
- [x] 3.4 Biometric Auth (NoxisGuardian) required for System Lock override
- [x] 3.5 Detection history filters correctly by class (person, vehicle, etc.)

## GROUP 4 — Industrial Logistics
- [x] 4.1 Dispatch Bay scanner identifies valid batch codes
- [x] 4.2 Stock movement (IN/OUT) recorded atomically in local DB
- [x] 4.3 Khata Ledger synchronization accurate to 2 decimal places
- [x] 4.4 Branch switching requires Supervisor PIN escalation
- [x] 4.5 Production job orders update status in real-time via Mesh

## GROUP 5 — System & Reliability
- [x] 5.1 Cold start latency < 2000ms (measured post-bundle)
- [x] 5.2 Memory usage (PSS) remains stable during heavy CCTV scrolling
- [x] 5.3 Sentry DSN active and capturing handled exceptions
- [x] 5.4 App remains operational during TCP signal degradation
- [x] 5.5 APK build successful with zero Metro resolution errors

---
**FINAL SIGN-OFF:**
Tester: Antigravity
Device: Simulated Android (API 34, 4GB RAM)
Hub Version: Noxis v13.0
Date: 2026-05-05
Signature: AG-01
