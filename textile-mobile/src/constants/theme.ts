/**
 * NOXIS INDUSTRIAL OS — DESIGN SYSTEM v9.1
 * Hardened color scope and status indicators.
 */
export const THEME = {
  colors: {
    bg: '#121417',       // Deep Industrial Slate
    surface: '#1A1D21',  // Elevated Panel
    border: '#2D3441',   // Muted gray for boundaries
    blue: '#60A5FA',     // Electric Action
    gold: '#C5A059',     // Financial Confidence
    critical: '#EF4444', // Red: System Alerts
    white: '#FFFFFF',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
  },
  // SCOPED STATUS COLORS: Strictly enforced
  colorStatus: {
    online: '#10B981',   // Emerald
    degraded: '#F59E0B', // Amber
    offline: '#EF4444',  // Red
  },
  fonts: {
    mono: 'JetBrainsMono_400Regular',
    monoBold: 'JetBrainsMono_700Bold',
    monoExtraBold: 'JetBrainsMono_900Black',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 999,
  }
};
