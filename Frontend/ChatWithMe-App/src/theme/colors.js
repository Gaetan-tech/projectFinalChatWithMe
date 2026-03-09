// Palette de couleurs
const palette = {
  // Primary (Indigo)
  primary50: '#eef2ff',
  primary100: '#e0e7ff',
  primary200: '#c7d2fe',
  primary300: '#a5b4fc',
  primary400: '#818cf8',
  primary500: '#6366f1',
  primary600: '#4f46e5',
  primary700: '#4338ca',
  primary800: '#3730a3',
  primary900: '#312e81',

  // Secondary (Pink)
  secondary50: '#fdf2f8',
  secondary100: '#fce7f3',
  secondary200: '#fbcfe8',
  secondary300: '#f9a8d4',
  secondary400: '#f472b6',
  secondary500: '#ec4899',
  secondary600: '#db2777',
  secondary700: '#be185d',
  secondary800: '#9d174d',
  secondary900: '#831843',

  // Flags
  flagGreen: '#10b981',
  flagGreenLight: '#d1fae5',
  flagRed: '#ef4444',
  flagRedLight: '#fee2e2',

  // Gray
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',

  // Online/Offline
  online: '#10b981',
  offline: '#6b7280',

  // White/Black
  white: '#ffffff',
  black: '#000000',
};

// Thème clair
export const lightTheme = {
  colors: {
    // Primary
    primary: palette.primary600,
    primaryLight: palette.primary100,
    primaryDark: palette.primary700,

    // Secondary
    secondary: palette.secondary600,
    secondaryLight: palette.secondary100,

    // Flags
    flagGreen: palette.flagGreen,
    flagGreenLight: palette.flagGreenLight,
    flagRed: palette.flagRed,
    flagRedLight: palette.flagRedLight,

    // Background
    background: palette.white,
    surface: palette.white,
    card: palette.white,
    cardShadow: palette.black,

    // Text
    text: palette.gray900,
    textSecondary: palette.gray600,
    textTertiary: palette.gray400,

    // Border
    border: palette.gray200,

    // Status
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    errorLight: palette.errorLight,
    info: palette.info,

    // Online/Offline
    online: palette.online,
    offline: palette.offline,

    // Utility
    white: palette.white,
    black: palette.black,
  },
};

// Thème sombre
export const darkTheme = {
  colors: {
    // Primary
    primary: palette.primary400,
    primaryLight: palette.primary900,
    primaryDark: palette.primary300,

    // Secondary
    secondary: palette.secondary400,
    secondaryLight: palette.secondary900,

    // Flags
    flagGreen: palette.flagGreen,
    flagGreenLight: palette.primary900,
    flagRed: palette.flagRed,
    flagRedLight: palette.secondary900,

    // Background
    background: palette.gray900,
    surface: palette.gray800,
    card: palette.gray800,
    cardShadow: palette.black,

    // Text
    text: palette.gray50,
    textSecondary: palette.gray300,
    textTertiary: palette.gray500,

    // Border
    border: palette.gray700,

    // Status
    success: palette.success,
    warning: palette.warning,
    error: palette.error,
    errorLight: palette.flagRedLight,
    info: palette.info,

    // Online/Offline
    online: palette.online,
    offline: palette.offline,

    // Utility
    white: palette.white,
    black: palette.black,
  },
};