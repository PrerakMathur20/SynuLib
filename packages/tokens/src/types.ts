import type { colors } from './primitives/colors.js';
import type { semanticColors } from './semantic/color.js';

export type PrimitiveColors = typeof colors;
export type SemanticColors = typeof semanticColors;

export type ThemeMode = 'light' | 'dark';

export interface Theme {
  colors: Record<string, string>;
  semanticColors: Record<string, string>;
  mode: ThemeMode;
}

/** Type-safe token path union for use in component APIs */
export type ColorToken = keyof PrimitiveColors;
export type SemanticColorToken = keyof SemanticColors;
