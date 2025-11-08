/**
 * Pokedex theme configuration
 * Migrated from Flutter implementation
 */

import { Platform } from 'react-native';

// Grey level colors
export const GreyColors = {
  light: '#F2F2F2',
  medium: '#E2E2E2',
};

// Text colors
export const TextColors = {
  white: '#FFFFFF',
  black: '#17171B',
  grey: '#747476',
  number: '#17171B99', // 0.6 opacity
};

// Other UI colors
export const UIColors = {
  backgroundDetails: '#333333',
};

// Light color scheme (based on Material 3)
export const LightColors = {
  primary: '#EA5D60',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiary: '#7D5260',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  error: '#B3261E',
  onError: '#FFFFFF',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  outline: '#79747E',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  surfaceContainerHighest: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  inverseSurface: '#313033',
  onInverseSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
  shadow: '#000000',
  surfaceTint: '#6750A4',
  outlineVariant: '#CAC4D0',
  scrim: '#000000',
};

// Main Colors export for the app
export const Colors = {
  light: {
    ...LightColors,
    text: TextColors.black,
    background: LightColors.surface,
    tint: LightColors.primary,
    icon: TextColors.grey,
    tabIconDefault: TextColors.grey,
    tabIconSelected: LightColors.primary,
  },
  dark: {
    ...LightColors, // For now using light theme, we can add dark theme later
    text: TextColors.white,
    background: UIColors.backgroundDetails,
    tint: TextColors.white,
    icon: TextColors.grey,
    tabIconDefault: TextColors.grey,
    tabIconSelected: TextColors.white,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS SF Pro Display variants */
    sans: 'SF Pro Display',
    regular: 'SF Pro Display Regular',
    medium: 'SF Pro Display Medium',
    bold: 'SF Pro Display Bold',
    light: 'SF Pro Display Light',
    thin: 'SF Pro Display Thin',
    /** iOS system fonts */
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'SF Pro Display',
    regular: 'SF Pro Display Regular',
    medium: 'SF Pro Display Medium',
    bold: 'SF Pro Display Bold',
    light: 'SF Pro Display Light',
    thin: 'SF Pro Display Thin',
    serif: 'serif',
    rounded: 'SF Pro Display Regular',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
