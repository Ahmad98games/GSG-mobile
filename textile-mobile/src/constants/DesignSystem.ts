/**
 * ELECTRIC SLATE DESIGN SYSTEM (v3.0)
 * Modern industrial aesthetic for the Gold She Industrial ERP.
 */

export const THEME = {
  colors: {
    background: '#121417', // Deep Slate
    surface: '#1C2028',    // Cards & Panels
    surfaceLighter: '#2D3441', // Border/Alt Surface
    border: '#2D3441',     
    blue: '#60A5FA',       // Electric Blue
    gold: '#C5A059',       // Sandstone Gold
    slate: '#94A3B8',      // Cool Slate
    muted: '#4B5563',      // System/Muted
    
    text: {
      primary: '#F0F0F0',
      secondary: '#94A3B8',
      muted: '#64748B',
      accent: '#60A5FA',
      gold: '#C5A059',
    },
    
    status: {
      danger: '#F87171',
      success: '#34D399',
      warning: '#FBBF24',
      info: '#60A5FA',
    },
    
    // NOXIS DARK HORROR PALETTE
    horror: {
      charcoal: '#0A0A0A',
      neonBlue: '#00F2FF',
      neonGreen: '#39FF14',
      neonRed: '#FF3131',
      neonPurple: '#BC13FE',
      glass: 'rgba(10, 10, 10, 0.8)',
    }
  },
  
  fonts: {
    inter: 'Inter-Regular',
    interBold: 'Inter-Bold',
    manrope: 'Manrope-Regular',
    manropeBold: 'Manrope-Bold',
    mono: 'JetBrainsMono-Regular',
    monoBold: 'JetBrainsMono-Bold',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 18,
  }
};

export const COMMON_STYLES = {
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  card: {
    backgroundColor: THEME.colors.surface,
    borderColor: THEME.colors.border,
    borderWidth: 1,
    borderRadius: THEME.borderRadius.md,
    padding: THEME.spacing.md,
  },
  monoText: {
    fontFamily: THEME.fonts.mono,
    color: THEME.colors.text.primary,
  }
};
