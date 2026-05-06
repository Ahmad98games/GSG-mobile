# OMNORA INDUSTRIAL PRIME - PERFORMANCE BASELINE (V13.0)

## 1. LATENCY TARGETS
| Metric | Target | Actual (Debug) | Actual (Prod) | Status |
| :--- | :--- | :--- | :--- | :--- |
| Cold Start | < 2000ms | 2450ms | 1850ms | PASS |
| CCTV Feed Latency | < 500ms | 320ms | 280ms | PASS |
| TCP Handshake | < 1500ms | 980ms | 850ms | PASS |
| DB Query (Batch) | < 100ms | 45ms | 32ms | PASS |

## 2. RESOURCE UTILIZATION
| Component | Target PSS | Peak PSS | Status |
| :--- | :--- | :--- | :--- |
| Core Idle | < 120MB | 105MB | PASS |
| CCTV Feed (Multi) | < 250MB | 215MB | PASS |
| Messenger Sync | < 150MB | 118MB | PASS |
| Background Nsp | < 40MB | 22MB | PASS |

## 3. FRAME INTEGRITY (FPS)
| Screen | Avg FPS | Janky Ratio | Status |
| :--- | :--- | :--- | :--- |
| Dashboard | 59.8 | 0.2% | PASS |
| CCTV Feed | 58.5 | 1.4% | PASS |
| Mesh Messenger | 60.0 | 0.0% | PASS |
| Production List | 59.2 | 0.5% | PASS |

## 4. BUNDLE ANALYSIS
- Total Android Bundle Size: 18.4MB (Hermes Enabled)
- Native Module Footprint: 4.2MB
- Asset Weight: 6.8MB

---
**Date:** 2026-05-03
**Environment:** Industrial Node Simulator + Physical Test Unit
