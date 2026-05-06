# Security Known Issues — Noxis Mobile v13.0

> **Review Date**: 2026-06-03 (30-day maximum window)
> **Audit Date**: 2026-05-04
> **Platform**: Expo SDK 51 / React Native (Hermes)

---

## HIGH Severity: `tar` (node-tar) — Path Traversal via Hardlink/Symlink

| Field | Value |
|---|---|
| **Package** | `tar` (<=7.5.10) |
| **Severity** | HIGH (CVSS 8.2–8.8 across 6 advisories) |
| **CVEs** | GHSA-34x7-hfp2-rc4v, GHSA-8qq5-rm4j-mr97, GHSA-83g3-92jg-28cx, GHSA-qffp-2rhf-9h96, GHSA-9ppj-qmqm-q256, GHSA-r6q2-hw4h-h46w |
| **Affected Module** | `tar` → `@expo/cli`, `cacache` (transitive dependency) |
| **Fix Available** | Only via `expo@49.0.23` (semver-major downgrade — **not viable**) |

### Risk Assessment

**Runtime Impact: NONE.** The `tar` package is only used during `expo prebuild` and `npx expo install` (development/CI toolchain). It is **never bundled** into the production APK/IPA. The attack vector requires a malicious `.tar` archive to be extracted during the build process.

### Mitigations

1. **CI Environment Isolation**: All `expo prebuild` commands run inside Docker containers with no persistent state.
2. **No User-Supplied Archives**: The Noxis Mobile build pipeline does not extract user-uploaded `.tar` files at any stage.
3. **Dependency Lockfile**: `package-lock.json` pins exact versions. No untrusted registries are configured.

### Resolution Path

- Awaiting Expo SDK 52+ stable release which migrates to `tar@8.x`.
- This vulnerability does **not** affect runtime behavior and cannot be exploited via the deployed mobile application.

---

## MODERATE Severity: `postcss` (<8.5.10) — XSS via CSS Stringify

| Field | Value |
|---|---|
| **Package** | `postcss` (<8.5.10) |
| **Severity** | MODERATE |
| **CVE** | GHSA-qx2v-qp2m-jg93 |
| **Affected Module** | `postcss` → `@expo/metro-config` (transitive) |
| **Fix Available** | Only via `expo@49.0.23` (semver-major downgrade — **not viable**) |

### Risk Assessment

**Runtime Impact: NONE.** PostCSS is a CSS processing tool used during Metro bundling. It is not present in the production JS bundle. XSS via CSS stringify requires injecting `</style>` tags into CSS output, which is not applicable to React Native's `StyleSheet` system.

---

## MODERATE Severity: `uuid` (<14.0.0) — Missing Buffer Bounds Check

| Field | Value |
|---|---|
| **Package** | `uuid` (<14.0.0) |
| **Severity** | MODERATE |
| **CVE** | GHSA-w5hq-g745-h8pq |
| **Affected Module** | `uuid` → `@expo/bunyan`, `@expo/rudder-sdk-node`, `xcode` |
| **Fix Available** | Partial via `jest-junit@17.0.0` (semver-major) |

### Risk Assessment

**Runtime Impact: MINIMAL.** The vulnerable code path requires passing a pre-allocated `buf` argument to `uuid.v3()`/`uuid.v5()`. Noxis Mobile uses `Crypto.randomUUID()` (expo-crypto) for all UUID generation, never calling `uuid` directly with buffer arguments.

---

## Hub Platform (6 MODERATE, 0 HIGH, 0 CRITICAL)

| Package | Severity | Transitive Via | Fix |
|---|---|---|---|
| `esbuild` (<=0.24.2) | MODERATE | `drizzle-kit` | Awaiting drizzle-kit update |
| `postcss` (<8.5.10) | MODERATE | `next` | Awaiting Next.js patch |

Both are **build-time only** dependencies with no runtime exposure.

---

## Summary

| Platform | LOW | MODERATE | HIGH | CRITICAL | Action Required |
|---|---|---|---|---|---|
| **Hub** | 0 | 6 | 0 | 0 | Monitor; no blockers |
| **Mobile** | 4 | 21 | 6 | 0 | Documented; mitigated (build-time only) |

> [!IMPORTANT]
> **No HIGH or CRITICAL vulnerabilities affect runtime code.** All identified HIGH vulnerabilities are confined to build-time toolchain dependencies (`tar`, `@expo/cli`) that are never shipped in the production APK.
