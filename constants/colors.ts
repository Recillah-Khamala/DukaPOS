const Colors = {
  primary: '#012d1d',
  secondary: '#7d5800',
  secondaryContainer: '#ffb702',
  surface: '#f8f9fa',
  onSurface: '#191c1d',
  onSurfaceVariant: '#414844',
  outline: '#717973',
  outlineVariant: '#c1c8c2',
  error: '#ba1a1a',
  primaryFixed: '#c1ecd4',
  white: '#ffffff',
} as const;

export type DukaPOSColors = typeof Colors;

export default Colors;
