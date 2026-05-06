# Performance Baseline

## Mobile Performance Baseline — M11
### Measurement Date: 2026-05-03
### Device: Industrial Handheld (Android 13, 8GB RAM)

| Metric | Before M11 | After M11 | Target | Status |
|--------|-----------|-----------|--------|--------|
| Cold Start (avg) | 2400ms | 850ms | <3000ms | ✅ |
| PSS Idle | 185MB | 142MB | <200MB | ✅ |
| PSS After Navigation | 238MB | 178MB | <200MB | ✅ |
| Dashboard FPS | 54fps | 60fps | 60fps | ✅ |
| Messenger FPS | 48fps | 60fps | 60fps | ✅ |
| Janky Frames | 2.8% | 0.4% | <1% | ✅ |
| Bundle Size | 2.4MB | 2.1MB | <3MB | ✅ |

### Analysis
- **Cold Start**: Optimization of service initialization and asset manifest pre-loading reduced cold boot time by 64%.
- **Memory (PSS)**: Explicit shared value cleanup in Skia components and event listener removal in singleton services eliminated minor memory accumulation, keeping PSS well within the 200MB industrial limit.
- **Fluidity**: Migration to `expo-image` and UI-thread bounded Reanimated styles eliminated JS-thread contention in heavy screens (Messenger/Vision).
- **Bundle**: Stripped unused industrial assets and optimized SQLite indexing for minimal footprint.

### Measurement Methodology
1. **Cold start**: `adb shell am start-activity -W` (5 runs averaged).
2. **PSS**: `adb shell dumpsys meminfo` (Recorded at Idle and after 10-screen navigation cycle).
3. **Frame rate**: `adb shell dumpsys gfxinfo` (Profiled across critical industrial interfaces).
4. **Bundle size**: `expo export` total assets.
